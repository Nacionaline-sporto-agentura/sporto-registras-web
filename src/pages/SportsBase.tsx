import { phoneNumberRegexPattern } from '@aplinkosministerija/design-system';
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
import { DeleteInfoProps, FeatureCollection, SportsBase } from '../types';
import api from '../utils/api';
import { AdminRoleType, RequestEntityTypes, StatusTypes } from '../utils/constants';
import {
  formatDate,
  getFormattedAddress,
  handleErrorToastFromServer,
  isNew,
} from '../utils/functions';
import { slugs } from '../utils/routes';
import {
  areUnitLabels,
  buttonsTitles,
  deleteDescriptionFirstPart,
  deleteDescriptionSecondPart,
  deleteTitles,
  descriptions,
  inputLabels,
  validationTexts,
} from '../utils/texts';

const generalSchema = Yup.object().shape({
  address: Yup.object().shape({
    city: Yup.string().required(validationTexts.requireText),
    municipality: Yup.string().required(validationTexts.requireText),
    street: Yup.string().required(validationTexts.requireText),
    house: Yup.string().required(validationTexts.requireText),
  }),
  name: Yup.string().required(validationTexts.requireText),
  type: Yup.object().required(validationTexts.requireText),
  phone: Yup.string()
    .required(validationTexts.requireText)
    .trim()
    .matches(phoneNumberRegexPattern, validationTexts.badPhoneFormat),
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

const specificationSchema = Yup.object().shape({
  plotNumber: Yup.string().required(validationTexts.requireText),
  areaUnits: Yup.string().required(validationTexts.requireText),
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

const sportsBaseSchema = Yup.object()
  .shape({})
  .concat(generalSchema)
  .concat(photosSchema)
  .concat(specificationSchema)
  .concat(spacesSchema);

const sportsBaseTabTitles = {
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
    label: sportsBaseTabTitles.generalInfo,
    validation: generalSchema,
  },
  { label: sportsBaseTabTitles.photos, validation: photosSchema },
  {
    label: sportsBaseTabTitles.specification,
    validation: specificationSchema,
  },
  { label: sportsBaseTabTitles.spaces, validation: spacesSchema },
  { label: sportsBaseTabTitles.owners },
  { label: sportsBaseTabTitles.organizations },
  { label: sportsBaseTabTitles.investments },
];

const SportsBasePage = () => {
  const navigate = useNavigate();
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const { id = '' } = useParams();
  const [searchParams] = useSearchParams();
  const title = isNew(id) ? 'Prašymas įregistruoti sporto bazę' : 'Sporto bazė';
  const { prasymas: queryStringRequestId } = Object.fromEntries([...Array.from(searchParams)]);
  const backUrl = isNew(id) ? slugs.unConfirmedSportBases : slugs.sportsBases;
  const [status, setStatus] = useState('');
  const user = useAppSelector((state) => state.user.userData);
  const [validateOnChange, setValidateOnChange] = useState<any>({});
  const queryClient = useQueryClient();

  const { isLoading: sportsBaseLoading, data: sportsBase } = useQuery(
    ['sportBase', id],
    () => api.getSportsBase(id),
    {
      onError: () => {
        navigate(slugs.sportsBases);
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
    sportsBase &&
    [StatusTypes.APPROVED, StatusTypes.REJECTED].includes(sportsBase?.lastRequest?.status);

  const request = sportsBase?.lastRequest || requestResponse;

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
  const isRequestSubmittedOrCreated =
    request?.status && [StatusTypes.SUBMITTED, StatusTypes.CREATED].includes(request?.status);

  const isRequestReturnedOrDraft =
    request?.status && [StatusTypes.RETURNED, StatusTypes.DRAFT].includes(request?.status);

  const canDelete =
    (!isUser && isRequestSubmittedOrCreated) || (isUser && isRequestReturnedOrDraft);

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

  const deleteRequest = useMutation(
    () =>
      api.deleteRequest({
        id: request?.id,
      }),
    {
      onError: () => {
        handleErrorToastFromServer();
      },
      onSuccess: () => {
        navigate(backUrl);
      },
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
    if (!sportsBase) return {};

    const { lastRequest, ...rest } = sportsBase;

    return flattenArrays({ ...rest });
  }, [sportsBase]);

  if (sportsBaseLoading || requestLoading) return <FullscreenLoader />;

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

  const deleteInfo: DeleteInfoProps = {
    deleteButtonText: buttonsTitles.deleteRequest,
    deleteDescriptionFirstPart: deleteDescriptionFirstPart.delete,
    deleteDescriptionSecondPart: deleteDescriptionSecondPart.request,
    deleteTitle: deleteTitles.request,
    deleteName: formValues?.name,
    handleDelete: deleteRequest.mutateAsync,
  };

  const validationSchema =
    tabs.length - 1 == currentTabIndex ? sportsBaseSchema : tabs[currentTabIndex]?.validation;

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
        const spaceTypeIds = (Object.values(values?.spaces || {}) as SportsBase[])?.map(
          (space) => space?.type?.id,
        );

        const mergedDiffs = () => {
          const idKeys = {};

          const obj = {};

          const sportBaseDif = compare(sportBaseWithoutLastRequest, values, true);
          extractIdKeys(sportBaseDif, idKeys);
          processDiffs(sportBaseDif, idKeys, 0, obj);

          if (sportsBase && !lastRequestApprovalOrRejection) {
            const requestDif = compare(formValues, values, true);
            extractIdKeys(requestDif, idKeys);
            processDiffs(requestDif, idKeys, 1, obj);
          }

          return Object.values(obj);
        };

        const changes = mergedDiffs();

        const submitChanges = changes.map((change: any) => change[0]);

        const containers = {
          [sportsBaseTabTitles.generalInfo]: (
            <SportBaseGeneral
              sportBase={values}
              errors={errors}
              handleChange={setFieldValue}
              disabled={disabled}
            />
          ),
          [sportsBaseTabTitles.photos]: (
            <SportBasePhotos
              sportBase={values}
              errors={errors}
              handleChange={setFieldValue}
              disabled={disabled}
            />
          ),
          [sportsBaseTabTitles.specification]: (
            <SpecificationContainer
              sportBase={values}
              errors={errors}
              handleChange={setFieldValue}
              disabled={disabled}
            />
          ),
          [sportsBaseTabTitles.spaces]: (
            <SportBaseSpaceContainer
              spaces={values.spaces || {}}
              handleChange={setFieldValue}
              errors={errors?.spaces}
              disabled={disabled}
            />
          ),
          [sportsBaseTabTitles.owners]: (
            <OwnersContainer
              owners={values.owners || {}}
              handleChange={setFieldValue}
              disabled={disabled}
            />
          ),
          [sportsBaseTabTitles.organizations]: (
            <OrganizationsContainer
              organizations={values.tenants || {}}
              handleChange={setFieldValue}
              disabled={disabled}
            />
          ),
          [sportsBaseTabTitles.investments]: (
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
            getValueLabel: (val) => val?.description,
            children: {
              representative: { name: inputLabels.representative },
              public: { name: inputLabels.public },
              description: { name: inputLabels.description },
            },
          },
          address: {
            name: inputLabels.address,
            getValueLabel: (val) => getFormattedAddress(val),
            children: {
              city: { name: inputLabels.town },
              house: { name: inputLabels.houseNo },
              apartment: { name: inputLabels.apartmentNo },
              street: { name: inputLabels.street },
              municipality: { name: inputLabels.municipality },
            },
          },
          type: { name: inputLabels.sportBaseType, getValueLabel: (val) => val?.name },
          technicalCondition: {
            name: inputLabels.technicalBaseCondition,
            getValueLabel: (val) => val?.name,
          },
          geom: {
            name: inputLabels.coordinates,
            getValueLabel: (val: FeatureCollection) =>
              val?.features
                ?.map((feature) =>
                  feature?.geometry?.coordinates
                    ? `X: ${feature.geometry.coordinates[0]} Y: ${feature.geometry.coordinates[1]}`
                    : '',
                )
                .join(', '),
          },
          level: { name: inputLabels.level, getValueLabel: (val) => val?.name },
          coordinates: {
            name: inputLabels.coordinates,
            children: {
              x: { name: inputLabels.coordinateX },
              y: { name: inputLabels.coordinateY },
            },
          },
          webPage: { name: inputLabels.website },
          email: { name: inputLabels.companyEmail },
          phone: { name: inputLabels.companyPhone },
          areaUnits: { name: inputLabels.areaUnits, getValueLabel: (val) => areUnitLabels[val] },
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
          plans: { getValueLabel: (val) => val?.name, name: descriptions.plans },
          owners: {
            getValueLabel: (val) => val?.name,
            name: sportsBaseTabTitles.owners,
            children: {
              name: { name: inputLabels.jarName },
              companyCode: { name: inputLabels.jarCode },
              website: { name: inputLabels.website },
            },
          },
          investments: {
            labelField: 'items source.name',
            getValueLabel: (val) =>
              val?.items &&
              Object.keys(val.items)
                .map((key) => val.items[key]?.source?.name)
                .join(', '),
            name: sportsBaseTabTitles.investments,
            children: {
              items: {
                name: inputLabels.sources,
                children: {
                  source: {
                    name: inputLabels.investmentSources,
                    getValueLabel: (val) => val?.name,
                  },
                  fundsAmount: { name: inputLabels.fundsAmount },
                },
              },
              appointedAt: { name: inputLabels.appointedAt },
            },
          },
          tenants: {
            getValueLabel: (val) => val?.companyName,
            name: sportsBaseTabTitles.organizations,
            children: {
              companyName: { name: inputLabels.name },
              startAt: { name: inputLabels.startAt },
              endAt: { name: inputLabels.endAt },
              basis: { name: inputLabels.basis },
            },
          },
          spaces: {
            getValueLabel: (val) => val?.name,
            name: sportsBaseTabTitles.spaces,
            children: {
              name: { name: inputLabels.name },
              group: { name: inputLabels.sportBaseSpaceGroup },
              type: { name: inputLabels.sportBaseSpaceType },
              sportTypes: { name: inputLabels.sportTypes, getValueLabel: (val) => val?.name },
              photos: {
                name: inputLabels.photos,
                getValueLabel: (val) => val?.description,
                children: {
                  representative: { name: inputLabels.representative },
                  public: { name: inputLabels.public },
                  description: { name: inputLabels.description },
                },
              },
              technicalCondition: {
                name: inputLabels.technicalSpaceCondition,
                getValueLabel: (val) => val?.name,
              },
              buildingNumber: { name: inputLabels.buildingNumber },
              buildingArea: { name: inputLabels.buildingArea },
              energyClass: { name: inputLabels.energyClass, getValueLabel: (val) => val?.name },
              buildingPurpose: {
                name: inputLabels.buildingPurpose,
                getValueLabel: (val) => val?.name,
              },
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
            await sportsBaseSchema?.validate(values, { abortEarly: false });
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
          ...(sportsBase?.id
            ? [
                <>
                  Identifikavimo kodas: <strong>{`#${sportsBase.id}`}</strong>
                </>,
              ]
            : []),
          ...(sportsBase?.createdAt ? [`Įregistruota: ${formatDate(sportsBase.createdAt)}`] : []),
          ...(sportsBase?.updatedAt ? [`Atnaujinta: ${formatDate(sportsBase.updatedAt)}`] : []),
          ...(sportsBase?.deletedAt
            ? [`Objekto išregistravimo data: ${formatDate(sportsBase.deletedAt)}`]
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
                deleteInfo={canDelete ? deleteInfo : undefined}
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

export default SportsBasePage;
