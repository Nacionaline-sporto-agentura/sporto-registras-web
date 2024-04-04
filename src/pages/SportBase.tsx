import * as Yup from 'yup';
import { Row, TitleColumn } from '../styles/CommonStyles';

import { applyPatch, compare, Operation } from 'fast-json-patch';
import { Formik } from 'formik';
import { isEmpty } from 'lodash';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
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
import { FormErrorMessage } from '../components/other/FormErrorMessage';
import FullscreenLoader from '../components/other/FullscreenLoader';
import HistoryContainer, { ActionTypes } from '../components/other/HistoryContainer';
import TabBar from '../components/Tabs/TabBar';
import { device } from '../styles';
import { SportBase } from '../types';
import api from '../utils/api';
import { StatusTypes } from '../utils/constants';
import { isNew } from '../utils/functions';
import { slugs } from '../utils/routes';
import { buttonsTitles, validationTexts } from '../utils/texts';

const validateCreateUserForm = Yup.object().shape({
  address: Yup.string().required(validationTexts.requireText),
  spaces: Yup.object().test(
    'at-least-one-property',
    validationTexts.requireSelect,
    (obj) => !isEmpty(obj),
  ),
  name: Yup.string().required(validationTexts.requireText),
  owners: Yup.object().test(
    'at-least-one-property',
    validationTexts.requireText,
    (obj) => !isEmpty(obj),
  ),
  photos: Yup.object().test(
    'at-least-one-property',
    'Privalo būti bent viena reprezentuojanti nuotrauka',
    (obj = {}) => Object.keys(obj).some((key) => obj?.[key]?.representative === true),
  ),
  organizations: Yup.object().test(
    'at-least-one-property',
    validationTexts.requireText,
    (obj) => !isEmpty(obj),
  ),

  investments: Yup.object().test(
    'at-least-one-property',
    validationTexts.requireText,
    (obj) => !isEmpty(obj),
  ),

  type: Yup.object().required(validationTexts.requireText),
  level: Yup.object().required(validationTexts.requireText),
  technicalCondition: Yup.object().required(validationTexts.requireText),
  coordinates: Yup.object().shape({
    x: Yup.string().required(validationTexts.requireText),
    y: Yup.string().required(validationTexts.requireText),
  }),
  webPage: Yup.string().required(validationTexts.requireText),
  plotNumber: Yup.string().required(validationTexts.requireText),
  plotArea: Yup.string().required(validationTexts.requireText),
  builtPlotArea: Yup.string().required(validationTexts.requireText),
  audienceSeats: Yup.string().required(validationTexts.requireText),
  parkingPlaces: Yup.string().required(validationTexts.requireText),
  dressingRooms: Yup.string().required(validationTexts.requireText),
  saunas: Yup.string().required(validationTexts.requireText),
  accommodationPlaces: Yup.string().required(validationTexts.requireText),
  diningPlaces: Yup.string().required(validationTexts.requireText),
  plans: Yup.object().test(
    'at-least-one-property',
    validationTexts.requireSelect,
    (obj) => !isEmpty(obj),
  ),
});

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
  },
  {
    label: sportBaseTabTitles.specification,
  },
  { label: sportBaseTabTitles.spaces },
  { label: sportBaseTabTitles.owners },
  { label: sportBaseTabTitles.organizations },
  { label: sportBaseTabTitles.investments },
];

const SportBasePage = () => {
  const navigate = useNavigate();
  const [currentTab, setTab] = useState(0);
  const { id = '' } = useParams();
  const [searchParams] = useSearchParams();
  const title = isNew(id) ? 'Įregistruoti naują sporto bazę' : 'Atnaujinti sporto bazę';
  const { prasymas } = Object.fromEntries([...Array.from(searchParams)]);

  const { isLoading, data: sportBase } = useQuery(['sportBase', id], () => api.getSportBase(id), {
    onError: () => {
      navigate(slugs.sportBases);
    },
    enabled: !isNew(id),
  });

  const { isLoading: requestLoading, data: request } = useQuery(
    ['request', prasymas],
    () => api.getRequest(prasymas),
    {
      onError: () => {
        navigate(slugs.sportBases);
      },
      enabled: !!prasymas,
    },
  );

  const requestId = sportBase?.lastRequest?.id || prasymas;

  const canValidate = sportBase?.lastRequest?.canValidate || request?.canValidate;
  const canEdit = (isNew(id) && !prasymas) || sportBase?.lastRequest?.canEdit || request?.canEdit;

  const createRequest = useMutation(
    (params: any) =>
      !requestId
        ? api.createRequests({ ...params, status: StatusTypes.CREATED })
        : api.updateRequest({ ...params, status: StatusTypes.SUBMITTED }, requestId),
    {
      onSuccess: () => {
        navigate(slugs.sportBases);
      },
      retry: false,
    },
  );

  const response = useMutation((params: any) => api.updateRequest({ ...params }, requestId), {
    onSuccess: () => {
      navigate(slugs.sportBases);
    },
    retry: false,
  });

  const handleSubmit = async (values: any) => {
    const params = {
      ...(!isNew(id) && { entity: id }),
      changes: values.map((item) => {
        const { oldValue, ...rest } = item;

        return rest;
      }),
    };

    createRequest.mutateAsync(params);
  };

  const flattenArrays = (data: any): any => {
    if (Array.isArray(data)) {
      const obj: any = {};
      data.forEach((item, index) => {
        obj[index] = flattenArrays(item);
      });
      return obj;
    } else if (typeof data === 'object' && data !== null) {
      for (let key in data) {
        data[key] = flattenArrays(data[key]);
      }
    }
    return data;
  };

  if (isLoading || requestLoading) return <FullscreenLoader />;

  const getSportBase = () => {
    if (!sportBase) return {};

    const { lastRequest, ...rest } = sportBase;

    return rest;
  };

  const sportBaseWithoutLastRequest = getSportBase();

  const getFormValues = () => {
    if (sportBase) {
      const changes = sportBase?.lastRequest?.changes || [];

      return flattenArrays(applyPatch(sportBaseWithoutLastRequest, changes).newDocument);
    }

    if (request) {
      return flattenArrays(applyPatch({}, request.changes).newDocument);
    }

    return {};
  };

  const initialValues: any = getFormValues();
  const disabled = !canEdit;

  return (
    <Formik
      enableReinitialize={false}
      initialValues={initialValues}
      validateOnChange={false}
      onSubmit={handleSubmit}
      validationSchema={validateCreateUserForm}
    >
      {({ values, errors, setFieldValue, validateForm }) => {
        const show = !isNew(id) && !prasymas;
        const spaceTypeIds = (Object.values(values?.spaces || {}) as SportBase[])?.map(
          (space) => space?.type?.id,
        );
        const [sportBaseCounter, setSportBaseCounter] = useState(
          Object.keys(values.spaces || {}).length,
        );
        const [photoCounter, setPhotoCounter] = useState(Object.keys(values.photos || {}).length);
        const [fieldsCounter, setFieldsCounter] = useState(Object.keys(values.plans || {}).length);
        const [investmentCounter, setInvestmentCounter] = useState(
          Object.keys(values.investments || {}).length,
        );
        const [organizationCounter, setOrganizationCounter] = useState(
          Object.keys(values.organizations || {}).length,
        );
        const [ownersCounter, setOwnersCounter] = useState(Object.keys(values.owners || {}).length);

        const dif = compare(sportBaseWithoutLastRequest, values, true);

        const mergedDiffs: Operation[] = Object.values(
          dif.reduce((obj, curr) => {
            obj[curr.path] = obj[curr.path] || {};

            if (curr.op === ActionTypes.TEST) {
              obj[curr.path] = { ...obj[curr.path], oldValue: curr.value };
            } else {
              obj[curr.path] = { ...obj[curr.path], ...curr };
            }

            return obj;
          }, {}),
        );

        const preprocessJsonPatch = (patchOps: Operation[]) => {
          const idKeys = {};

          const diffs: any = [];

          for (const item of patchOps) {
            if (item.path.includes('/id')) {
              const parentPath = item.path.replace('/id', '');
              idKeys[parentPath] = 1;
            } else {
              diffs.push(item);
            }
          }

          diffs.push(
            ...Object.values(
              patchOps.reduce((acc, curr) => {
                const { path, ...rest } = curr as any;
                const key = path.split('/');
                const prop = key.pop();
                const parentPath = key.join('/');

                if (idKeys[parentPath]) {
                  acc[parentPath] = {
                    path: parentPath,
                    op: curr.op,
                    oldValue: { ...(acc[parentPath]?.oldValue || {}), [prop]: rest?.oldValue },
                    value: { ...(acc[parentPath]?.value || {}), [prop]: rest?.value },
                  };
                }

                return acc;
              }, {}),
            ),
          );

          return diffs;
        };

        const containers = {
          [sportBaseTabTitles.generalInfo]: (
            <SportBaseGeneral
              counter={photoCounter}
              setCounter={setPhotoCounter}
              sportBase={values}
              errors={errors}
              handleChange={setFieldValue}
              disabled={disabled}
            />
          ),
          [sportBaseTabTitles.specification]: (
            <SpecificationContainer
              counter={fieldsCounter}
              setCounter={setFieldsCounter}
              sportBase={values}
              errors={errors}
              handleChange={setFieldValue}
              disabled={disabled}
            />
          ),
          [sportBaseTabTitles.spaces]: (
            <SportBaseSpaceContainer
              sportBaseCounter={sportBaseCounter}
              setSportBaseCounter={setSportBaseCounter}
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
              errors={errors?.owners}
              handleChange={setFieldValue}
              counter={ownersCounter}
              setCounter={setOwnersCounter}
              disabled={disabled}
            />
          ),
          [sportBaseTabTitles.organizations]: (
            <OrganizationsContainer
              organizations={values.organizations || {}}
              errors={errors?.organizations}
              handleChange={setFieldValue}
              counter={organizationCounter}
              setCounter={setOrganizationCounter}
              disabled={disabled}
            />
          ),
          [sportBaseTabTitles.investments]: (
            <InvestmentsContainer
              investments={values.investments || {}}
              errors={errors?.investments}
              handleChange={setFieldValue}
              counter={investmentCounter}
              setCounter={setInvestmentCounter}
              disabled={disabled}
            />
          ),
        };

        const hasNext = tabs[currentTab + 1];
        const hasPrevious = tabs[currentTab - 1];

        return (
          <>
            <Container>
              <TitleColumn>
                <BackButton />
                <Row>
                  <Title>{title}</Title>
                  {canValidate && (
                    <AdditionalButtons
                      handleChange={(status) => response.mutateAsync({ status })}
                    />
                  )}
                </Row>
              </TitleColumn>
              {show}

              <Column>
                <TabBar
                  tabs={tabs}
                  onClick={(_, index) => setTab(index || 0)}
                  isActive={(_, index) => currentTab == index}
                />
                {containers[tabs[currentTab]?.label]}
                <FormErrorMessage errors={errors} />
                <ButtonRow>
                  {hasPrevious && (
                    <Button
                      onClick={async () => {
                        setTab(currentTab - 1);
                      }}
                    >
                      {buttonsTitles.back}
                    </Button>
                  )}

                  {hasNext && (
                    <Button
                      onClick={async () => {
                        setTab(currentTab + 1);
                      }}
                    >
                      {buttonsTitles.next}
                    </Button>
                  )}

                  {!disabled && !hasNext && (
                    <Button
                      onClick={async () => {
                        const errors = await validateForm(values);

                        if (isEmpty(errors)) {
                          handleSubmit(preprocessJsonPatch(mergedDiffs));
                        }
                      }}
                    >
                      {buttonsTitles.save}
                    </Button>
                  )}

                  {!isNew(id) && !prasymas}
                </ButtonRow>
              </Column>
            </Container>
            <HistoryContainer
              disabled={disabled}
              handleChange={setFieldValue}
              spaceTypeIds={spaceTypeIds}
              diff={preprocessJsonPatch(mergedDiffs) as any}
              data={values}
            />
          </>
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 16px;
  margin: 0 auto;
  min-height: 100%;
  max-width: 1000px;
`;

const Column = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const InnerRow = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
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
