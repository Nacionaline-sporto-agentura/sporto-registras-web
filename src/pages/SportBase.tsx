import { applyPatch, compare } from 'fast-json-patch';
import { Formik, yupToFormErrors } from 'formik';
import { cloneDeep, isEmpty } from 'lodash';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import * as Yup from 'yup';
import Button from '../components/buttons/Button';
import OrganizationsContainer from '../components/containers/Organizations';
import OwnersContainer from '../components/containers/Owners';
import SpecificationContainer from '../components/containers/Specification';
import SportBaseGeneral from '../components/containers/SportBaseGeneral';
import InvestmentsContainer from '../components/containers/SportBaseInvestments';
import SportBasePhotos from '../components/containers/SportBasePhotos';
import SportBaseSpaceContainer, {
  sportBaseSpaceTabTitles,
} from '../components/containers/SportBaseSpace';
import { extractIdKeys, flattenArrays, processDiffs } from '../components/fields/utils/function';
import { FormErrorMessage } from '../components/other/FormErrorMessage';
import FormPopUp from '../components/other/FormPopup';
import FullscreenLoader from '../components/other/FullscreenLoader';
import HistoryContainer from '../components/other/HistoryContainer';
import RequestFormHeader from '../components/other/RequestFormHeader';
import { useAppSelector } from '../state/hooks';
import { device } from '../styles';
import { SportBase } from '../types';
import api from '../utils/api';
import { AdminRoleType, RequestEntityTypes, StatusTypes } from '../utils/constants';
import { isNew } from '../utils/functions';
import { slugs } from '../utils/routes';
import { buttonsTitles, descriptions, inputLabels, validationTexts } from '../utils/texts';

const generalSchema = Yup.object().shape({
  address: Yup.object().shape({
    city: Yup.string().required(validationTexts.requireText),
    municipality: Yup.string().required(validationTexts.requireText),
    street: Yup.string().required(validationTexts.requireText),
    house: Yup.string().required(validationTexts.requireText),
  }),
  name: Yup.string().required(validationTexts.requireText),
  type: Yup.object().required(validationTexts.requireText),
  webPage: Yup.string().required(validationTexts.requireText),
  level: Yup.object().required(validationTexts.requireText),
  technicalCondition: Yup.object().required(validationTexts.requireText),
  coordinates: Yup.object().shape({
    x: Yup.string().required(validationTexts.requireText),
    y: Yup.string().required(validationTexts.requireText),
  }),
});

const photosSchema = Yup.object().shape({
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
  spaces: Yup.object().test('at-least-one', validationTexts.requireSelect, (obj) => !isEmpty(obj)),
});

const sportBaseSchema = Yup.object()
  .shape({})
  .concat(generalSchema)
  .concat(specificationSxhema)
  .concat(spacesSchema);

const sportBaseTabTitles = {
  generalInfo: 'Bendra informacija',
  specification: 'Specifikacija',
  photos: 'Nuotraukos',
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
  { label: sportBaseTabTitles.photos, validation: photosSchema },
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
  const title = isNew(id) ? 'Prašymas įregistruoti sporto bazę' : 'Prašymas atnaujinti sporto bazę';
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
      entityType: RequestEntityTypes.SPORTS_BASES,
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

  const sportBaseWithoutLastRequest = useMemo(() => {
    if (!sportBase) return {};

    const { lastRequest, ...rest } = sportBase;

    return flattenArrays({ ...rest });
  }, [sportBase]);

  if (sportBaseLoading || requestLoading) return <FullscreenLoader />;

  const getFormValues = () => {
    // Do not apply diff if the last request status type is APPROVED OR REJECTED
    if (lastRequestApprovalOrRejection) {
      return cloneDeep(sportBaseWithoutLastRequest);
    }
    if (request) {
      return applyPatch(cloneDeep(sportBaseWithoutLastRequest), request?.changes || []).newDocument;
    }

    return {};
  };

  const formValues: any = getFormValues();
  const disabled = !canEdit;

  const showDraftButton =
    user.type === AdminRoleType.USER &&
    (isNewRequest ||
      [request?.status].includes(StatusTypes.DRAFT) ||
      lastRequestApprovalOrRejection);

  const validationSchema =
    tabs.length - 1 == currentTabIndex ? sportBaseSchema : tabs[currentTabIndex]?.validation;

  const oldData = isEmpty(sportBaseWithoutLastRequest) ? formValues : sportBaseWithoutLastRequest;

  return (
    <Formik
      enableReinitialize={false}
      initialValues={formValues}
      validationSchema={validationSchema}
      validateOnChange={!!validateOnChange?.all || !!validateOnChange[currentTabIndex]}
      onSubmit={() => {}}
    >
      {({ values, errors, setFieldValue, setErrors, setValues }) => {
        const spaceTypeIds = (Object.values(values?.spaces || {}) as SportBase[])?.map(
          (space) => space?.type?.id,
        );

        const mergedDiffs = () => {
          const idKeys = {};

          const obj = {};

          const sportBaseDif = compare(sportBaseWithoutLastRequest, values, true);
          extractIdKeys(sportBaseDif, idKeys);
          processDiffs(sportBaseDif, idKeys, 0, obj);

          if (sportBase && !lastRequestApprovalOrRejection) {
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
            <SportBaseGeneral
              sportBase={values}
              errors={errors}
              handleChange={setFieldValue}
              disabled={disabled}
            />
          ),
          [sportBaseTabTitles.photos]: (
            <SportBasePhotos
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
              organizations={values.tenants || {}}
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

        const { data: additionalFieldLabels } = useQuery(
          ['spaceTypeIds', spaceTypeIds],
          async () =>
            (await api.getFields({ query: { type: { $in: spaceTypeIds } } })).reduce(
              (obj, curr) => ({ ...obj, [curr.id]: { name: curr.field.title } }),
              {},
            ),
          { enabled: !isEmpty(spaceTypeIds) },
        );

        const titles = {
          name: { name: inputLabels.sportBaseName },
          photos: {
            name: inputLabels.photos,
            labelField: 'description',
            children: {
              representative: { name: inputLabels.representative },
              public: { name: inputLabels.public },
              description: { name: inputLabels.description },
            },
          },
          address: {
            name: inputLabels.address,
            labelField: 'city',
            children: {
              city: { name: inputLabels.town },
              house: { name: inputLabels.houseNo },
              apartment: { name: inputLabels.apartmentNo },
              street: { name: inputLabels.street },
              municipality: { name: inputLabels.municipality },
            },
          },
          type: { name: inputLabels.type, labelField: 'name' },
          technicalCondition: { name: inputLabels.technicalCondition, labelField: 'name' },
          level: { name: inputLabels.level, labelField: 'name' },
          coordinates: {
            name: inputLabels.coordinates,
            children: {
              x: { name: inputLabels.coordinateX },
              y: { name: inputLabels.coordinateY },
            },
          },
          webPage: { name: inputLabels.website },
          plotNumber: { name: inputLabels.plotNumber },
          plotArea: { name: inputLabels.plotArea },
          builtPlotArea: { name: inputLabels.builtPlotArea },
          parkingPlaces: { name: inputLabels.parkingPlaces },
          dressingRooms: { name: inputLabels.dressingRooms },
          methodicalClasses: { name: inputLabels.methodicalClasses },
          saunas: { name: inputLabels.saunas },
          diningPlaces: { name: inputLabels.diningPlaces },
          accommodationPlaces: { name: inputLabels.accommodationPlaces },
          disabledAccessible: { name: descriptions.disabledAccessible },
          blindAccessible: { name: descriptions.blindAccessible },
          publicWifi: { name: descriptions.publicWifi },
          plans: { labelField: 'name', name: descriptions.plans },
          owners: {
            labelField: 'name',
            name: sportBaseTabTitles.owners,
            children: {
              name: { name: inputLabels.jarName },
              companyCode: { name: inputLabels.jarCode },
              website: { name: inputLabels.website },
            },
          },
          investments: {
            labelField: 'items source.name',
            name: sportBaseTabTitles.investments,
            children: {
              items: {
                name: 'Šaltiniai',
                children: {
                  source: { name: inputLabels.source, labelField: 'name' },
                  fundsAmount: { name: inputLabels.fundsAmount },
                },
              },
              appointedAt: { name: inputLabels.appointedAt },
            },
          },
          tenants: {
            labelField: 'companyName',
            name: sportBaseTabTitles.organizations,
            children: {
              companyName: { name: inputLabels.name },
              startAt: { name: inputLabels.startAt },
              endAt: { name: inputLabels.endAt },
              basis: { name: inputLabels.basis },
            },
          },
          spaces: {
            labelField: 'name',
            name: sportBaseTabTitles.spaces,
            children: {
              name: { name: inputLabels.name },
              type: { name: inputLabels.type },
              sportTypes: { name: inputLabels.sportTypes, labelField: 'name' },
              photos: {
                name: inputLabels.photos,
                labelField: 'description',
                children: {
                  representative: { name: inputLabels.representative },
                  public: { name: inputLabels.public },
                  description: { name: inputLabels.description },
                },
              },
              technicalCondition: { name: inputLabels.technicalCondition, labelField: 'name' },
              buildingNumber: { name: inputLabels.buildingNumber },
              buildingArea: { name: inputLabels.buildingArea },
              energyClass: { name: inputLabels.energyClass },
              energyClassCertificate: { name: descriptions.energyClassCertificate },
              buildingType: { name: inputLabels.buildingType },
              buildingPurpose: { name: inputLabels.buildingPurpose },
              constructionDate: { name: inputLabels.constructionDate },
              latestRenovationDate: { name: inputLabels.latestRenovationDate },
              additionalValues: {
                name: sportBaseSpaceTabTitles.additionalFields,
                children: additionalFieldLabels,
              },
            },
          },
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

        return (
          <Container>
            <InnerContainer>
              <RequestFormHeader
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
              />

              <Column>
                {containers[tabs[currentTabIndex]?.label]}
                <FormErrorMessage errors={errors} />
                <ButtonRow>
                  {hasPrevious && <Button onClick={handlePrevious}>{buttonsTitles.back}</Button>}
                  {hasNext && <Button onClick={handleNext}>{buttonsTitles.next}</Button>}
                  {!disabled && !hasNext && (
                    <Button onClick={onSubmit}>{buttonsTitles.save}</Button>
                  )}
                </ButtonRow>
              </Column>
            </InnerContainer>
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

export default SportBasePage;
