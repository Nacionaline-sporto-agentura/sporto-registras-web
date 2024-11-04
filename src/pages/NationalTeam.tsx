import { applyPatch } from 'fast-json-patch';
import { Formik, yupToFormErrors } from 'formik';
import { cloneDeep, isEmpty } from 'lodash';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import * as Yup from 'yup';
import Button from '../components/buttons/Button';
import NationalTeamAthletes from '../components/containers/NationalTeamAthletes';
import NationalTeamCoaches from '../components/containers/NationalTeamCoaches';
import NationalTeamGeneral from '../components/containers/NationalTeamGeneral';
import { flattenArrays, getSubmitChanges, mergedDiffs } from '../components/fields/utils/function';
import { FormErrorMessage } from '../components/other/FormErrorMessage';
import FormPopUp from '../components/other/FormPopup';
import FullscreenLoader from '../components/other/FullscreenLoader';
import HistoryContainer from '../components/other/HistoryContainer';
import RequestFormHeader from '../components/other/RequestFormHeader';
import { useAppSelector } from '../state/hooks';
import { device } from '../styles';
import api from '../utils/api';
import { AdminRoleType, RequestEntityTypes, StatusTypes } from '../utils/constants';
import { formatDate, getFullName, handleErrorToastFromServer, isNew } from '../utils/functions';
import { slugs } from '../utils/routes';
import { buttonsTitles, inputLabels, validationTexts } from '../utils/texts';

const generalSchema = Yup.object().shape({
  name: Yup.string().required(validationTexts.requireText),
  ageGroup: Yup.object().required(validationTexts.requireText),
  sportType: Yup.object().required(validationTexts.requireText),
  gender: Yup.object().required(validationTexts.requireText),
  startAt: Yup.date().required(validationTexts.requireText),
});

const nationalTeamSchema = Yup.object().shape({}).concat(generalSchema);

const titles = {
  name: { name: inputLabels.nationalTeamName },
  ageGroup: { name: inputLabels.ageGroup, getValueLabel: (val) => val?.name },
  sportType: { name: inputLabels.sportPersonSportType, getValueLabel: (val) => val?.name },
  gender: { name: inputLabels.nationalTeamGender, getValueLabel: (val) => val?.name },
  startAt: { name: inputLabels.sportPersonSportType },
  endAt: { name: inputLabels.sportPersonSportType },
  coaches: { name: inputLabels.coaches, getValueLabel: (val) => getFullName(val) },
  athletes: { name: inputLabels.athletes, getValueLabel: (val) => getFullName(val) },
};

const sportBaseTabTitles = {
  generalInfo: 'Rinktinės informacija',
  athletes: 'Sportininkai',
  coaches: 'Treneriai',
};

export const tabs = [
  {
    label: sportBaseTabTitles.generalInfo,
    validation: generalSchema,
  },
  {
    label: sportBaseTabTitles.athletes,
  },
  {
    label: sportBaseTabTitles.coaches,
  },
];

const NationalTeamPage = () => {
  const navigate = useNavigate();
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const { id = '' } = useParams();
  const [searchParams] = useSearchParams();
  const title = isNew(id) ? 'Prašymas įregistruoti rinktinę' : 'Rinktinė';
  const { prasymas: queryStringRequestId } = Object.fromEntries([...Array.from(searchParams)]);
  const backUrl = isNew(id) ? slugs.unConfirmedNationalTeams : slugs.nationalTeams;
  const [status, setStatus] = useState('');
  const user = useAppSelector((state) => state.user.userData);
  const [validateOnChange, setValidateOnChange] = useState<any>({});
  const queryClient = useQueryClient();

  const { isLoading: nationalTeamLoading, data: nationalTeam } = useQuery(
    ['nationalTeam', id],
    () => api.getNationalTeam(id),
    {
      onError: () => {
        navigate(slugs.nationalTeams);
      },
      refetchOnWindowFocus: false,
      enabled: !isNew(id),
    },
  );

  const { isLoading: requestLoading, data: requestResponse } = useQuery(
    ['nationalTeamRequest', queryStringRequestId],
    () => api.getRequest(queryStringRequestId),
    {
      onError: () => {
        navigate(slugs.unConfirmedNationalTeams);
      },
      refetchOnWindowFocus: false,
      enabled: !!queryStringRequestId,
    },
  );

  const lastRequestApprovalOrRejection =
    nationalTeam &&
    [StatusTypes.APPROVED, StatusTypes.REJECTED].includes(nationalTeam?.lastRequest?.status);

  const request = nationalTeam?.lastRequest || requestResponse;

  const canValidate = request?.canValidate;

  const isNewRequest = isNew(id) && !queryStringRequestId;

  const isUser = user.type === AdminRoleType.USER;

  const showDraftButton =
    isUser &&
    (isNewRequest ||
      [request?.status].includes(StatusTypes.DRAFT) ||
      lastRequestApprovalOrRejection);

  const canEdit = isNewRequest || request?.canEdit || (isUser && lastRequestApprovalOrRejection);
  const canCreateRequest = (isUser && lastRequestApprovalOrRejection) || !request?.id;
  const disabled = !canEdit;

  const isCreateStatus = canCreateRequest || request.status === StatusTypes.DRAFT;

  const createOrUpdateRequest = useMutation(
    (params: any) =>
      canCreateRequest ? api.createRequests(params) : api.updateRequest(params, request.id),
    {
      onError: ({ response }) => {
        handleErrorToastFromServer(response);
      },
      onSuccess: () => {
        navigate(backUrl);
        queryClient.invalidateQueries();
      },
      retry: false,
    },
  );

  const handleDraft = async (changes) => {
    handleSubmit({ changes, status: StatusTypes.DRAFT });
  };

  const handleSubmit = async ({ changes, status, comment }: any) => {
    const params = {
      entityType: RequestEntityTypes.NATIONAL_TEAMS,
      ...(!isNew(id) && { entity: id }),
      status,
      comment,
      ...(!isEmpty(changes) && {
        changes: changes.map((item) => {
          const { oldValue, ...rest } = item;
          return rest;
        }),
      }),
    };

    createOrUpdateRequest.mutateAsync(params);
  };

  const nationalTeamWithoutLastRequest = useMemo(() => {
    if (!nationalTeam) return {};

    const { lastRequest, ...rest } = nationalTeam;

    return flattenArrays({ ...rest });
  }, [nationalTeam]);

  const getFormValues = () => {
    if (nationalTeamLoading || requestLoading) return {};

    // Do not apply diff if the last request status type is APPROVED OR REJECTED
    if (lastRequestApprovalOrRejection) {
      return cloneDeep(nationalTeamWithoutLastRequest);
    }
    if (request) {
      return applyPatch(cloneDeep(nationalTeamWithoutLastRequest), request?.changes || [])
        .newDocument;
    }

    return {};
  };

  const formValues: any = getFormValues();

  if (nationalTeamLoading || requestLoading) return <FullscreenLoader />;

  const validationSchema =
    tabs.length - 1 == currentTabIndex ? nationalTeamSchema : tabs[currentTabIndex]?.validation;

  const oldData = isEmpty(nationalTeamWithoutLastRequest)
    ? formValues
    : nationalTeamWithoutLastRequest;

  return (
    <Formik
      enableReinitialize={false}
      initialValues={formValues}
      validationSchema={validationSchema}
      validateOnChange={!!validateOnChange?.all || !!validateOnChange[currentTabIndex]}
      onSubmit={() => {}}
    >
      {({ values, errors, setFieldValue, setErrors, setValues }) => {
        const changes = mergedDiffs({
          entity: nationalTeamWithoutLastRequest,
          lastRequestApprovalOrRejection,
          formValues,
          values,
        });

        const submitChanges = getSubmitChanges(changes);

        const containers = {
          [sportBaseTabTitles.generalInfo]: (
            <NationalTeamGeneral
              nationalTeam={values}
              errors={errors}
              handleChange={setFieldValue}
              disabled={disabled}
            />
          ),
          [sportBaseTabTitles.coaches]: (
            <NationalTeamCoaches
              coaches={values?.coaches}
              handleChange={setFieldValue}
              disabled={disabled}
            />
          ),
          [sportBaseTabTitles.athletes]: (
            <NationalTeamAthletes
              athletes={values?.athletes}
              handleChange={setFieldValue}
              disabled={disabled}
            />
          ),
        };

        const hasNext = tabs[currentTabIndex + 1];
        const hasPrevious = tabs[currentTabIndex - 1];

        const onSubmit = async () => {
          let errors = {};
          try {
            await nationalTeamSchema?.validate(values, { abortEarly: false });
          } catch (e) {
            const updatedValidateOnChange = {
              ...validateOnChange,
              all: true,
            };
            setValidateOnChange(updatedValidateOnChange);

            errors = yupToFormErrors(e);
          }

          setErrors(errors);

          if (isEmpty(errors)) {
            if (!isCreateStatus) {
              return setStatus(StatusTypes.SUBMITTED);
            }

            handleSubmit({
              changes: submitChanges,
              status: StatusTypes.CREATED,
            });
          }
        };

        const handlePrevious = () => {
          setCurrentTabIndex(currentTabIndex - 1);
        };

        const handleNext = async () => {
          if (!validationSchema) return setCurrentTabIndex(currentTabIndex + 1);

          try {
            await validationSchema?.validate(values, { abortEarly: false });
            setCurrentTabIndex(currentTabIndex + 1);
          } catch (e) {
            const updatedValidateOnChange = {
              ...validateOnChange,
              [currentTabIndex]: true,
            };
            setValidateOnChange(updatedValidateOnChange);
            setErrors(yupToFormErrors(e));
          }
        };

        const info = [
          ...(nationalTeam?.id
            ? [
                <>
                  Identifikavimo kodas: <strong>{`#${nationalTeam.id}`}</strong>
                </>,
              ]
            : []),
          ...(nationalTeam?.createdAt
            ? [`Įregistruota: ${formatDate(nationalTeam.createdAt)}`]
            : []),
          ...(nationalTeam?.updatedAt ? [`Atnaujinta: ${formatDate(nationalTeam.updatedAt)}`] : []),
          ...(nationalTeam?.deletedAt
            ? [`Objekto išregistravimo data: ${formatDate(nationalTeam.deletedAt)}`]
            : []),
        ];

        return (
          <Container>
            <InnerContainer>
              <RequestFormHeader
                title={title}
                loading={createOrUpdateRequest.isLoading}
                request={request}
                showDraftButton={showDraftButton}
                disabled={disabled}
                handleDraft={() => handleDraft(submitChanges)}
                onSubmit={onSubmit}
                canValidate={canValidate}
                currentTabIndex={currentTabIndex}
                onSetCurrentTabIndex={(_, index) => {
                  setCurrentTabIndex(index || 0);
                }}
                onSetStatus={(status) => setStatus(status)}
                tabs={tabs}
                back={true}
                info={info}
              />

              <Column>
                {containers[tabs[currentTabIndex]?.label]}
                <FormErrorMessage errors={errors} />
                <ButtonRow>
                  {hasPrevious && (
                    <Button disabled={createOrUpdateRequest.isLoading} onClick={handlePrevious}>
                      {buttonsTitles.back}
                    </Button>
                  )}
                  {hasNext && (
                    <Button disabled={createOrUpdateRequest.isLoading} onClick={handleNext}>
                      {buttonsTitles.next}
                    </Button>
                  )}
                  {!disabled && !hasNext && (
                    <Button
                      disabled={createOrUpdateRequest.isLoading}
                      loading={createOrUpdateRequest.isLoading}
                      onClick={onSubmit}
                    >
                      {buttonsTitles.submit}
                    </Button>
                  )}
                </ButtonRow>
              </Column>
            </InnerContainer>
            <FormPopUp
              loading={createOrUpdateRequest.isLoading}
              onClose={() => setStatus('')}
              status={status}
              onSubmit={({ comment, status }) => {
                handleSubmit({
                  ...(status === StatusTypes.SUBMITTED && { changes: submitChanges }),
                  status,
                  comment,
                });
              }}
            />
            {!isNewRequest && (
              <HistoryContainer
                handleClear={() => {
                  setValues(nationalTeamWithoutLastRequest);
                }}
                oldData={oldData}
                requestId={request?.id}
                disabled={disabled}
                handleChange={setFieldValue}
                open={!lastRequestApprovalOrRejection}
                titles={titles}
                diff={changes as any}
                data={values}
              />
            )}
          </Container>
        );
      }}
    </Formik>
  );
};

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin: 16px 0;
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 16px;
  margin: 0 auto;
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;

  @media ${device.mobileL} {
    flex-wrap: wrap;
    justify-content: flex-end;
  }
`;

const Column = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
`;

export default NationalTeamPage;
