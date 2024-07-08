import { applyPatch, compare } from 'fast-json-patch';
import { Formik, yupToFormErrors } from 'formik';
import { cloneDeep, isEmpty } from 'lodash';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import * as Yup from 'yup';
import Button from '../components/buttons/Button';
import CompetitionInfo from '../components/containers/CompetitionInfo';
import ResultsInfo from '../components/containers/ResultsInfo';
import { extractIdKeys, flattenArrays, processDiffs } from '../components/fields/utils/function';
import { FormErrorMessage } from '../components/other/FormErrorMessage';
import FormPopUp from '../components/other/FormPopup';
import FullscreenLoader from '../components/other/FullscreenLoader';
import HistoryContainer from '../components/other/HistoryContainer';
import RequestFormHeader from '../components/other/RequestFormHeader';
import { useAppSelector } from '../state/hooks';
import { device } from '../styles';
import api from '../utils/api';
import { AdminRoleType, RequestEntityTypes, StatusTypes } from '../utils/constants';
import { formatDate, handleErrorToastFromServer, isNew } from '../utils/functions';
import { slugs } from '../utils/routes';
import {
  buttonsTitles,
  descriptions,
  inputLabels,
  matchTypeLabels,
  validationTexts,
} from '../utils/texts';

const generalSchema = Yup.object().shape({
  name: Yup.string().required(validationTexts.requireText),
  year: Yup.string()
    .required(validationTexts.requireText)
    .matches(/^\d{4}$/, validationTexts.yearFormat),
  competitionType: Yup.object().required(validationTexts.requireText),
  website: Yup.string().required(validationTexts.requireText),
  protocolDocument: Yup.object().required(validationTexts.requireText),
});

const sportBaseSchema = Yup.object().shape({}).concat(generalSchema);

const resultTabTitles = {
  competitionInfo: 'Varžybų informacija',
  results: 'Rezultatai',
};

export const tabs = [
  {
    label: resultTabTitles.competitionInfo,
    validation: generalSchema,
  },
  {
    label: resultTabTitles.results,
  },
];

const titles = {
  name: { name: inputLabels.competitionName },
  year: { name: inputLabels.year },
  competitionType: { name: inputLabels.competitionType, getValueLabel: (val) => val?.name },
  results: {
    name: inputLabels.result,
    getValueLabel: (val) => val?.sportType?.name,
    children: {
      name: { name: inputLabels.name },
      participantsNumber: { name: inputLabels.teamCount },
      stages: { name: inputLabels.stagesCount },
      countriesCount: { name: inputLabels.statesCount },
      selection: { name: inputLabels.isInternationalSelection },
      matchType: { name: inputLabels.matchType, getValueLabel: (val) => matchTypeLabels[val] },
      otherMatch: { name: inputLabels.matchName },
      match: { name: inputLabels.sportMatchType, getValueLabel: (val) => val?.name },
      sportType: { name: inputLabels.sportType, getValueLabel: (val) => val?.name },
      resultType: { name: inputLabels.result, getValueLabel: (val) => val?.name },
      result: {
        name: inputLabels.place,
        children: {
          value: {
            name: inputLabels.place,
            children: { from: { name: inputLabels.placeFrom }, to: { name: inputLabels.placeTo } },
          },
        },
      },
    },
  },
  website: { name: inputLabels.websiteToProtocols },
  protocolDocument: { name: descriptions.protocolDocument, getValueLabel: (val) => val?.name },
};

const CompetitionPage = () => {
  const navigate = useNavigate();
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const { id = '' } = useParams();
  const [searchParams] = useSearchParams();
  const title = isNew(id) ? 'Prašymas įvesti rezultatus' : 'Prašymas atnaujinti rezultatus';
  const { prasymas: queryStringRequestId } = Object.fromEntries([...Array.from(searchParams)]);
  const backUrl = isNew(id) ? slugs.unconfirmedResults : slugs.results;
  const [status, setStatus] = useState('');
  const user = useAppSelector((state) => state.user.userData);
  const [validateOnChange, setValidateOnChange] = useState<any>({});
  const queryClient = useQueryClient();

  const { isLoading: competitionLoading, data: competition } = useQuery(
    ['competition', id],
    () => api.getCompetition(id),
    {
      onError: () => {
        navigate(slugs.results);
      },
      refetchOnWindowFocus: false,
      enabled: !isNew(id),
    },
  );

  const { isLoading: requestLoading, data: requestResponse } = useQuery(
    ['resultRequest', queryStringRequestId],
    () => api.getRequest(queryStringRequestId),
    {
      onError: () => {
        navigate(slugs.unconfirmedResults);
      },
      refetchOnWindowFocus: false,
      enabled: !!queryStringRequestId,
    },
  );

  const lastRequestApprovalOrRejection =
    competition &&
    [StatusTypes.APPROVED, StatusTypes.REJECTED].includes(competition?.lastRequest?.status);

  const request = competition?.lastRequest || requestResponse;

  const canValidate = request?.canValidate;

  const isNewRequest = isNew(id) && !queryStringRequestId;

  const showDraftButton =
    user.type === AdminRoleType.USER &&
    (isNewRequest ||
      [request?.status].includes(StatusTypes.DRAFT) ||
      lastRequestApprovalOrRejection);

  const canEdit = isNewRequest || request?.canEdit || showDraftButton;
  const canCreateRequest = showDraftButton || !request?.id;

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
      entityType: RequestEntityTypes.COMPETITIONS,
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

  const competitionWithoutLastRequest = useMemo(() => {
    if (!competition) return {};

    const { lastRequest, ...rest } = competition;

    return flattenArrays({ ...rest });
  }, [competition]);

  if (competitionLoading || requestLoading) return <FullscreenLoader />;

  const getFormValues = () => {
    // Do not apply diff if the last request status type is APPROVED OR REJECTED
    if (lastRequestApprovalOrRejection) {
      return cloneDeep(competitionWithoutLastRequest);
    }
    if (request) {
      return applyPatch(cloneDeep(competitionWithoutLastRequest), request?.changes || [])
        .newDocument;
    }

    return {};
  };

  const formValues: any = getFormValues();
  const disabled = !canEdit;

  const validationSchema =
    tabs.length - 1 == currentTabIndex ? sportBaseSchema : tabs[currentTabIndex]?.validation;

  const oldData = isEmpty(competitionWithoutLastRequest)
    ? formValues
    : competitionWithoutLastRequest;

  return (
    <Formik
      enableReinitialize={false}
      initialValues={formValues}
      validationSchema={validationSchema}
      validateOnChange={!!validateOnChange?.all || !!validateOnChange[currentTabIndex]}
      onSubmit={() => {}}
    >
      {({ values, errors, setFieldValue, setErrors, setValues }) => {
        const mergedDiffs = () => {
          const idKeys = {};

          const obj = {};

          const sportBaseDif = compare(competitionWithoutLastRequest, values, true);
          extractIdKeys(sportBaseDif, idKeys);
          processDiffs(sportBaseDif, idKeys, 0, obj);

          if (competition && !lastRequestApprovalOrRejection) {
            const requestDif = compare(formValues, values, true);
            extractIdKeys(requestDif, idKeys);
            processDiffs(requestDif, idKeys, 1, obj);
          }

          return Object.values(obj);
        };

        const changes = mergedDiffs();

        const submitChanges = changes.map((change: any) => change[0]);

        const containers = {
          [resultTabTitles.competitionInfo]: (
            <CompetitionInfo
              result={values}
              errors={errors}
              handleChange={setFieldValue}
              disabled={disabled}
            />
          ),
          [resultTabTitles.results]: (
            <ResultsInfo
              handleChange={setFieldValue}
              disabled={disabled}
              results={values.results}
            />
          ),
        };

        const hasNext = tabs[currentTabIndex + 1];
        const hasPrevious = tabs[currentTabIndex - 1];

        const onSubmit = async () => {
          let errors = {};
          try {
            await validationSchema?.validate(values, { abortEarly: false });
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
          ...(competition?.id
            ? [
                <>
                  Identifikavimo kodas: <strong>{`#${competition.id}`}</strong>
                </>,
              ]
            : []),
          ...(competition?.createdAt ? [`Įregistruota: ${formatDate(competition.createdAt)}`] : []),
          ...(competition?.updatedAt ? [`Atnaujinta: ${formatDate(competition.updatedAt)}`] : []),
          ...(competition?.deletedAt
            ? [`Objekto išregistravimo data: ${formatDate(competition.deletedAt)}`]
            : []),
        ];

        return (
          <Container>
            <InnerContainer>
              <RequestFormHeader
                loading={createOrUpdateRequest.isLoading}
                title={title}
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
                  setValues(competitionWithoutLastRequest);
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

export default CompetitionPage;
