import { applyPatch, compare } from 'fast-json-patch';
import { Formik, yupToFormErrors } from 'formik';
import { cloneDeep, isEmpty, omit } from 'lodash';
import { personalCode } from 'lt-codes';
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import * as Yup from 'yup';
import Button from '../components/buttons/Button';
import Athlete from '../components/containers/Athlete';
import SportsPersonGeneral from '../components/containers/SportsPersonGeneral';
import {
  extractIdKeys,
  filterSelectedOptions,
  flattenArrays,
  processDiffs,
} from '../components/fields/utils/function';
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
import { buttonsTitles, inputLabels, validationTexts } from '../utils/texts';

const generalSchema = Yup.object().shape({
  firstName: Yup.string().required(validationTexts.requireText),
  lastName: Yup.string().required(validationTexts.requireText),
  personalCode: Yup.string()
    .required(validationTexts.requireText)
    .trim()
    .test('validatePersonalCode', validationTexts.personalCode, (value) => {
      return personalCode.validate(value).isValid;
    }),
  sportTypes: Yup.object().test(
    'at-least-one-property',
    validationTexts.requireSelect,
    (obj) => !isEmpty(obj),
  ),
  nationality: Yup.string().required(validationTexts.requireText),
});

const sportBaseSchema = Yup.object().shape({}).concat(generalSchema);

const sportBaseTabTitles = {
  generalInfo: 'Bendra informacija',
  athlete: 'Sportininkas',
};

export const tabs = [
  {
    label: sportBaseTabTitles.generalInfo,
    validation: generalSchema,
  },
];

export const additionalTabs: any = [
  {
    label: sportBaseTabTitles.athlete,
    canDelete: true,
    value: 'athlete',
  },
];

const SportsPersonPage = () => {
  const navigate = useNavigate();
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const { id = '' } = useParams();
  const [searchParams] = useSearchParams();
  const title = isNew(id) ? 'Prašymas įregistruoti sporto asmenį' : 'Sporto asmuo';
  const { prasymas: queryStringRequestId } = Object.fromEntries([...Array.from(searchParams)]);
  const backUrl = isNew(id) ? slugs.unConfirmedSportsPersons : slugs.sportsPersons;
  const [status, setStatus] = useState('');
  const user = useAppSelector((state) => state.user.userData);
  const [validateOnChange, setValidateOnChange] = useState<any>({});
  const queryClient = useQueryClient();
  const [currentTabs, setCurrentTabs] = useState(tabs);

  const { isLoading: sportBaseLoading, data: sportPerson } = useQuery(
    ['sportPerson', id],
    () => api.getSportsPerson(id),
    {
      onError: () => {
        navigate(slugs.sportsPersons);
      },
      refetchOnWindowFocus: false,
      enabled: !isNew(id),
    },
  );

  const { isLoading: requestLoading, data: requestResponse } = useQuery(
    ['sportPersonRequest', queryStringRequestId],
    () => api.getRequest(queryStringRequestId),
    {
      onError: () => {
        navigate(slugs.unConfirmedSportsPersons);
      },
      refetchOnWindowFocus: false,
      enabled: !!queryStringRequestId,
    },
  );

  const lastRequestApprovalOrRejection =
    sportPerson &&
    [StatusTypes.APPROVED, StatusTypes.REJECTED].includes(sportPerson?.lastRequest?.status);

  const request = sportPerson?.lastRequest || requestResponse;

  const canValidate = request?.canValidate;

  const isNewRequest = isNew(id) && !queryStringRequestId;

  const canEdit = isNewRequest || request?.canEdit || sportPerson?.canCreateRequest;
  const canCreateRequest = sportPerson?.canCreateRequest || !request?.id;

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
      entityType: RequestEntityTypes.SPORTS_PERSONS,
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

  const sportsPersonWithoutLastRequest = useMemo(() => {
    if (!sportPerson) return {};

    const { lastRequest, ...rest } = sportPerson;

    return flattenArrays({ ...rest });
  }, [sportPerson]);

  const getFormValues = () => {
    if (sportBaseLoading || requestLoading) return {};

    // Do not apply diff if the last request status type is APPROVED OR REJECTED
    if (lastRequestApprovalOrRejection) {
      return cloneDeep(sportsPersonWithoutLastRequest);
    }
    if (request) {
      return applyPatch(cloneDeep(sportsPersonWithoutLastRequest), request?.changes || [])
        .newDocument;
    }

    return {};
  };

  const formValues: any = getFormValues();

  useEffect(() => {
    if (!formValues) return;

    const sportPersonKeys = Object.keys(formValues);

    setCurrentTabs([
      ...tabs,
      ...additionalTabs.filter((tab) => sportPersonKeys.includes(tab.value)),
    ]);
  }, [JSON.stringify(formValues)]);

  if (sportBaseLoading || requestLoading) return <FullscreenLoader />;

  const disabled = !canEdit;

  const showDraftButton =
    user.type === AdminRoleType.USER &&
    (isNewRequest ||
      [request?.status].includes(StatusTypes.DRAFT) ||
      lastRequestApprovalOrRejection);

  const validationSchema =
    tabs.length - 1 == currentTabIndex ? sportBaseSchema : tabs[currentTabIndex]?.validation;

  const oldData = isEmpty(sportsPersonWithoutLastRequest)
    ? formValues
    : sportsPersonWithoutLastRequest;

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

          const sportBaseDif = compare(sportsPersonWithoutLastRequest, values, true);
          extractIdKeys(sportBaseDif, idKeys);
          processDiffs(sportBaseDif, idKeys, 0, obj);

          if (sportPerson && !lastRequestApprovalOrRejection) {
            const requestDif = compare(formValues, values, true);
            extractIdKeys(requestDif, idKeys);
            processDiffs(requestDif, idKeys, 1, obj);
          }

          return Object.values(obj);
        };

        const changes = mergedDiffs();

        const submitChanges = changes.map((change: any) => change[0]);

        const containers = {
          [sportBaseTabTitles.generalInfo]: (
            <SportsPersonGeneral
              sportsPerson={values}
              errors={errors}
              handleChange={setFieldValue}
              disabled={disabled}
            />
          ),
          [sportBaseTabTitles.athlete]: (
            <Athlete
              athlete={values?.athlete || []}
              errors={errors}
              handleChange={setFieldValue}
              disabled={disabled}
            />
          ),
        };

        const hasNext = currentTabs[currentTabIndex + 1];
        const hasPrevious = currentTabs[currentTabIndex - 1];

        const titles = {
          firstName: { name: inputLabels.firstName },
          lastName: { name: inputLabels.lastName },
          nationality: { name: inputLabels.citizenship },
          personalCode: { name: inputLabels.personalCode },
          sportTypes: { name: inputLabels.sportPersonSportType, labelField: 'name' },
        };

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
          ...(sportPerson?.id
            ? [
                <>
                  Identifikavimo kodas: <strong>{`#${sportPerson.id}`}</strong>
                </>,
              ]
            : []),
          ...(sportPerson?.createdAt ? [`Įregistruota: ${formatDate(sportPerson.createdAt)}`] : []),
          ...(sportPerson?.updatedAt ? [`Atnaujinta: ${formatDate(sportPerson.updatedAt)}`] : []),
          ...(sportPerson?.deletedAt
            ? [`Objekto išregistravimo data: ${formatDate(sportPerson.deletedAt)}`]
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
                tabs={currentTabs}
                back={true}
                info={info}
                options={filterSelectedOptions(
                  additionalTabs,
                  currentTabs,
                  (option) => option.label,
                )}
                onAddTab={(tab) => {
                  setCurrentTabs([...currentTabs, tab]);
                  setFieldValue(tab.value, {});
                }}
                onDeleteTab={(currentTab) => {
                  if (currentTab.label == currentTabs[currentTabIndex].label) {
                    setCurrentTabIndex(currentTabIndex - 1);
                  }
                  setCurrentTabs(currentTabs.filter((tab) => tab.label !== currentTab.label));
                  setValues(omit(values!, currentTab.value));
                }}
                addTabLabel={'+ Pridėti asmens tipą'}
              />

              <Column>
                {containers[currentTabs[currentTabIndex]?.label]}
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
                  setValues(sportsPersonWithoutLastRequest);
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

export default SportsPersonPage;
