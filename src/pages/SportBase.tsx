import * as Yup from 'yup';
import { Row, TitleColumn } from '../styles/CommonStyles';

import { applyPatch, compare } from 'fast-json-patch';
import { Formik, yupToFormErrors } from 'formik';
import { isEmpty } from 'lodash';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import AdditionalButtons from '../components/buttons/AdditionalButtons';
import BackButton from '../components/buttons/BackButton';
import Button from '../components/buttons/Button';
import InvestmentsContainer from '../components/containers/Investments';
import OrganizationsContainer from '../components/containers/Organizations';
import OwnersContainer from '../components/containers/Owners';
import SpecificationContainer from '../components/containers/Specification';
import SportBaseGeneral from '../components/containers/SportBaseGeneral';
import SportBaseSpaceContainer from '../components/containers/SportBaseSpace';
import { generateUniqueString } from '../components/fields/utils/function';
import { FormErrorMessage } from '../components/other/FormErrorMessage';
import FormPopUp from '../components/other/FormPopup';
import FullscreenLoader from '../components/other/FullscreenLoader';
import HistoryContainer, { ActionTypes } from '../components/other/HistoryContainer';
import TabBar from '../components/Tabs/TabBar';
import { useAppSelector } from '../state/hooks';
import { device } from '../styles';
import { SportBase } from '../types';
import api from '../utils/api';
import { AdminRoleType, StatusTypes } from '../utils/constants';
import { isNew } from '../utils/functions';
import { slugs } from '../utils/routes';
import { buttonsTitles, validationTexts } from '../utils/texts';

const generalSchema = Yup.object().shape({
  address: Yup.string().required(validationTexts.requireText),
  name: Yup.string().required(validationTexts.requireText),
  type: Yup.object().required(validationTexts.requireText),
  webPage: Yup.string().required(validationTexts.requireText),
  level: Yup.object().required(validationTexts.requireText),
  technicalCondition: Yup.object().required(validationTexts.requireText),
  coordinates: Yup.object().shape({
    x: Yup.string().required(validationTexts.requireText),
    y: Yup.string().required(validationTexts.requireText),
  }),
  photos: Yup.object().test(
    'at-least-one-property',
    'Privalo būti bent viena reprezentuojanti nuotrauka',
    (obj = {}) => Object.keys(obj).some((key) => obj?.[key]?.representative === true),
  ),
});

const specificationSxhema = Yup.object().shape({
  plotNumber: Yup.string().required(validationTexts.requireText),
  plotArea: Yup.string().required(validationTexts.requireText),
  builtPlotArea: Yup.string().required(validationTexts.requireText),
  methodicalClasses: Yup.string().required(validationTexts.requireText),
  parkingPlaces: Yup.string().required(validationTexts.requireText),
  dressingRooms: Yup.string().required(validationTexts.requireText),
  saunas: Yup.string().required(validationTexts.requireText),
  accommodationPlaces: Yup.string().required(validationTexts.requireText),
  diningPlaces: Yup.string().required(validationTexts.requireText),
});

const spacesSchema = Yup.object().shape({
  spaces: Yup.object().test(
    'at-least-one-property',
    validationTexts.requireSelect,
    (obj) => !isEmpty(obj),
  ),
});

const sportBaseSchema = Yup.object()
  .shape({})
  .concat(generalSchema)
  .concat(specificationSxhema)
  .concat(spacesSchema);

export const sportBaseTabTitles = {
  generalInfo: 'Bendra informacija',
  specification: 'Specifikacija',
  spaces: 'Erdvės',
  owners: 'Savininkai',
  organizations: 'Organizacijos',
  investments: 'Investicijos',
};

export const tabs = [
  {
    label: sportBaseTabTitles.generalInfo,
    validation: generalSchema,
  },
  {
    label: sportBaseTabTitles.specification,
    validation: specificationSxhema,
  },
  { label: sportBaseTabTitles.spaces, validation: spacesSchema },
  { label: sportBaseTabTitles.owners },
  { label: sportBaseTabTitles.organizations },
  { label: sportBaseTabTitles.investments },
];

const SportBasePage = () => {
  const navigate = useNavigate();
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const { id = '' } = useParams();
  const [searchParams] = useSearchParams();
  const title = isNew(id) ? 'Įregistruoti naują sporto bazę' : 'Atnaujinti sporto bazę';
  const { prasymas: queryStringRequestId } = Object.fromEntries([...Array.from(searchParams)]);
  const backUrl = isNew(id) ? slugs.unConfirmedSportBases : slugs.sportBases;
  const [status, setStatus] = useState('');
  const user = useAppSelector((state) => state.user.userData);
  const [validateOnChange, setValidateOnChange] = useState<any>({});
  const queryClient = useQueryClient();

  const { isLoading: sportBaseLoading, data: sportBase } = useQuery(
    ['sportBase', id],
    () => api.getSportBase(id),
    {
      onError: () => {
        navigate(slugs.sportBases);
      },
      refetchOnWindowFocus: false,
      enabled: !isNew(id),
    },
  );

  const { isLoading: requestLoading, data: requestResponse } = useQuery(
    ['request', queryStringRequestId],
    () => api.getRequest(queryStringRequestId),
    {
      onError: () => {
        navigate(slugs.unConfirmedSportBases);
      },
      refetchOnWindowFocus: false,
      enabled: !!queryStringRequestId,
    },
  );

  const lastRequestApprovalOrRejection =
    sportBase &&
    [StatusTypes.APPROVED, StatusTypes.REJECTED].includes(sportBase?.lastRequest?.status);

  const request = sportBase?.lastRequest || requestResponse;

  const canValidate = request?.canValidate;

  const isNewRequest = isNew(id) && !queryStringRequestId;

  const canEdit = isNewRequest || request?.canEdit || sportBase?.canCreateRequest;
  const canCreateRequest = sportBase?.canCreateRequest || !request?.id;

  const isCreateStatus = canCreateRequest || request.status === StatusTypes.DRAFT;

  const createOrUpdateRequest = useMutation(
    (params: any) =>
      canCreateRequest ? api.createRequests(params) : api.updateRequest(params, request.id),
    {
      onSuccess: () => {
        navigate(backUrl);
        queryClient.invalidateQueries({ queryKey: ['sportBase', id] });
        queryClient.invalidateQueries({ queryKey: ['request', queryStringRequestId] });
      },
      retry: false,
    },
  );

  const handleDraft = async (changes) => {
    handleSubmit({ changes, status: StatusTypes.DRAFT });
  };

  const handleSubmit = async ({ changes, status, comment }: any) => {
    const params = {
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

  const flattenArrays = (data: any): any => {
    if (Array.isArray(data)) {
      const obj: any = {};
      data.forEach((item) => {
        obj[item.id || generateUniqueString()] = flattenArrays(item);
      });
      return obj;
    } else if (typeof data === 'object' && data !== null) {
      for (let key in data) {
        data[key] = flattenArrays(data[key]);
        if (['createdAt', 'createdBy', 'deletedAt', 'deletedBy', 'sportBase'].includes(key)) {
          delete data[key];
        }
      }
    }
    return data;
  };

  const sportBaseWithoutLastRequest = useMemo(() => {
    if (!sportBase) return {};

    const { lastRequest, ...rest } = sportBase;

    return flattenArrays({ ...rest });
  }, [sportBase]);

  if (sportBaseLoading || requestLoading) return <FullscreenLoader />;

  const getFormValues = () => {
    // Do not apply diff if the last request status type is APPROVED OR REJECTED
    if (lastRequestApprovalOrRejection) {
      return { ...sportBaseWithoutLastRequest };
    }
    if (request) {
      return applyPatch({ ...sportBaseWithoutLastRequest }, request?.changes || []).newDocument;
    }

    return {};
  };

  const initialValues: any = getFormValues();
  const disabled = !canEdit;

  const showDraftButton =
    user.type === AdminRoleType.USER &&
    (isNewRequest ||
      [request?.status].includes(StatusTypes.DRAFT) ||
      lastRequestApprovalOrRejection);

  const validationSchema =
    tabs.length - 1 == currentTabIndex ? sportBaseSchema : tabs[currentTabIndex]?.validation;

  const oldData = isEmpty(sportBase) ? request : sportBaseWithoutLastRequest;

  return (
    <Formik
      enableReinitialize={false}
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnChange={!!validateOnChange?.all || !!validateOnChange[currentTabIndex]}
      onSubmit={() => {}}
    >
      {({ values, errors, setFieldValue, setErrors, setValues }) => {
        const spaceTypeIds = (Object.values(values?.spaces || {}) as SportBase[])?.map(
          (space) => space?.type?.id,
        );

        const processDiffs = (diffs, idKeys, index, obj) => {
          for (const key of diffs) {
            const pathArr = key.path.split('/');
            const prop = pathArr.pop() || '';
            const parentPath = pathArr.join('/');
            const item = key;

            const actionType = item.op === ActionTypes.TEST ? 'oldValue' : 'value';
            const currentOperation = item.op !== ActionTypes.TEST ? item.op : undefined;
            const isParentPath = !!idKeys[parentPath];
            const path = isParentPath ? parentPath : item.path;
            const curr = obj[path]?.[index];
            const entry = {
              path,
              op: curr?.op || currentOperation,
              oldValue: isParentPath ? { ...(curr?.oldValue || {}) } : curr?.oldValue,
              value: isParentPath ? { ...(curr?.value || {}) } : curr?.value,
            };

            if (idKeys[parentPath]) {
              entry[actionType][prop] = item.value;
            } else {
              entry[actionType] = item.value;
            }

            if (index !== 0 && (!obj[path] || !obj[path][0])) {
              // If the 0 index element doesn't exist, don't create the 1 index element
              continue;
            }

            if (idKeys[parentPath]) {
              obj[parentPath] = obj[parentPath] || [];
              obj[parentPath][index] = entry;
            } else {
              obj[item.path] = obj[item.path] || [];
              obj[item.path][index] = entry;
            }
          }
        };

        const mergedDiffs = () => {
          const idKeys = {};

          const extractIdKeys = (diff) => {
            for (const key of diff) {
              if (key.path.endsWith('/id')) {
                const parentPath = key.path.replace('/id', '');
                idKeys[parentPath] = 1;
              }
            }
          };

          const obj = {};

          if (sportBase && !lastRequestApprovalOrRejection) {
            const sportBaseDif = compare(sportBaseWithoutLastRequest, values, true);
            extractIdKeys(sportBaseDif);
            processDiffs(sportBaseDif, idKeys, 0, obj);

            const requestDif = compare(initialValues, values, true);
            extractIdKeys(requestDif);
            processDiffs(requestDif, idKeys, 1, obj);
          } else {
            const sportBaseDif = compare(sportBaseWithoutLastRequest, values, true);
            extractIdKeys(sportBaseDif);
            processDiffs(sportBaseDif, idKeys, 0, obj);
          }

          return Object.values(obj);
        };

        const changes = mergedDiffs();

        const submitChanges = changes.map((change: any) => change[0]);

        const containers = {
          [sportBaseTabTitles.generalInfo]: (
            <SportBaseGeneral
              sportBase={values}
              errors={errors}
              handleChange={setFieldValue}
              disabled={disabled}
            />
          ),
          [sportBaseTabTitles.specification]: (
            <SpecificationContainer
              sportBase={values}
              errors={errors}
              handleChange={setFieldValue}
              disabled={disabled}
            />
          ),
          [sportBaseTabTitles.spaces]: (
            <SportBaseSpaceContainer
              spaces={values.spaces || {}}
              sportBaseTypeId={values?.type?.id}
              handleChange={setFieldValue}
              errors={errors?.spaces}
              disabled={disabled}
            />
          ),
          [sportBaseTabTitles.owners]: (
            <OwnersContainer
              owners={values.owners || {}}
              handleChange={setFieldValue}
              disabled={disabled}
            />
          ),
          [sportBaseTabTitles.organizations]: (
            <OrganizationsContainer
              organizations={values.organizations || {}}
              handleChange={setFieldValue}
              disabled={disabled}
            />
          ),
          [sportBaseTabTitles.investments]: (
            <InvestmentsContainer
              investments={values.investments || {}}
              handleChange={setFieldValue}
              disabled={disabled}
            />
          ),
        };

        const hasNext = tabs[currentTabIndex + 1];
        const hasPrevious = tabs[currentTabIndex - 1];

        return (
          <Container>
            <InnerContainer>
              <TitleColumn>
                <BackButton />
                <Row>
                  <Title>{title}</Title>
                  {showDraftButton && (
                    <Button
                      onClick={() => {
                        handleDraft(submitChanges);
                      }}
                    >
                      {buttonsTitles.saveAsDraft}
                    </Button>
                  )}
                  {canValidate && (
                    <AdditionalButtons handleChange={(status) => setStatus(status)} />
                  )}
                </Row>
                <FormPopUp
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
              </TitleColumn>

              <Column>
                <TabBar
                  tabs={tabs}
                  onClick={(_, index) => {
                    setCurrentTabIndex(index || 0);
                  }}
                  isActive={(_, index) => currentTabIndex == index}
                />
                {containers[tabs[currentTabIndex]?.label]}
                <FormErrorMessage errors={errors} />
                <ButtonRow>
                  {hasPrevious && (
                    <Button
                      onClick={async () => {
                        setCurrentTabIndex(currentTabIndex - 1);
                      }}
                    >
                      {buttonsTitles.back}
                    </Button>
                  )}

                  {hasNext && (
                    <Button
                      onClick={async () => {
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
                      }}
                    >
                      {buttonsTitles.next}
                    </Button>
                  )}

                  {!disabled && !hasNext && (
                    <Button
                      onClick={async () => {
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
                      }}
                    >
                      {buttonsTitles.save}
                    </Button>
                  )}
                </ButtonRow>
              </Column>
            </InnerContainer>
            {!isNewRequest && (
              <HistoryContainer
                handleClear={() => {
                  setValues(sportBaseWithoutLastRequest);
                }}
                oldData={oldData}
                requestId={request?.id}
                disabled={disabled}
                handleChange={setFieldValue}
                open={!lastRequestApprovalOrRejection}
                spaceTypeIds={spaceTypeIds}
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
  max-width: 1000px;
`;

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;

  gap: 16px;
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

const Title = styled.div`
  font-size: 3.2rem;
  font-weight: bold;
  color: #121926;
  opacity: 1;
  @media ${device.mobileL} {
    font-size: 2.4rem;
  }
`;

export default SportBasePage;
