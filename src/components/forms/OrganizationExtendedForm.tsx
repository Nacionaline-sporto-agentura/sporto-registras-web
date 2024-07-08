import { phoneNumberRegexPattern } from '@aplinkosministerija/design-system';
import { applyPatch, compare } from 'fast-json-patch';
import { Formik, yupToFormErrors } from 'formik';
import { cloneDeep, isEmpty } from 'lodash';
import { companyCode } from 'lt-codes';
import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import * as Yup from 'yup';
import { useAppSelector } from '../../state/hooks';
import { device } from '../../styles';
import api from '../../utils/api';
import { AdminRoleType, RequestEntityTypes, StatusTypes, TenantTypes } from '../../utils/constants';
import { formatDate, handleErrorToastFromServer, isNew } from '../../utils/functions';
import { slugs } from '../../utils/routes';
import { buttonsTitles, inputLabels, validationTexts } from '../../utils/texts';
import Button from '../buttons/Button';
import GoverningBodiesContainer from '../containers/GoverningBodies';
import OrganizationUsers from '../containers/OrganizationUsers';
import TenantMembershipsContainer from '../containers/TenantMemberships';
import { extractIdKeys, flattenArrays, processDiffs } from '../fields/utils/function';
import { FormErrorMessage } from '../other/FormErrorMessage';
import FormPopUp from '../other/FormPopup';
import FullscreenLoader from '../other/FullscreenLoader';
import HistoryContainer from '../other/HistoryContainer';
import RequestFormHeader from '../other/RequestFormHeader';
import RequestOrganizationForm from './RequestOrganizationForm';

export const validateOrganizationForm = Yup.object().shape({
  name: Yup.string().required(validationTexts.requireText).trim(),
  code: Yup.string()
    .required(validationTexts.requireText)
    .trim()
    .test('validateCompanyCode', validationTexts.companyCode, (value) => {
      return companyCode.validate(value).isValid;
    }),
  phone: Yup.string()
    .required(validationTexts.requireText)
    .trim()
    .matches(phoneNumberRegexPattern, validationTexts.badPhoneFormat),
  email: Yup.string().email(validationTexts.badEmailFormat).required(validationTexts.requireText),
});

const organizationTabTitles = {
  generalInfo: 'Bendra informacija',
  governingBodies: 'Valdymo organai',
  memberships: 'Narystės',
  fundingSources: 'Finansavimo šaltiniai',
  members: 'Naudotojai',
};

export const tabs = [
  {
    label: organizationTabTitles.generalInfo,
    validation: validateOrganizationForm,
  },
  { label: organizationTabTitles.governingBodies },
  { label: organizationTabTitles.memberships },
  // { label: organizationTabTitles.fundingSources },
  { label: organizationTabTitles.members },
];

export interface InstitutionProps {
  companyName?: string;
  companyCode?: string;
  companyPhone?: string;
  address?: string;
  companyEmail: string;
  tenantType?: TenantTypes;
  parent?: any;
  data?: {
    url: string;
    foundedAt: Date;
    hasBeneficiaryStatus: true;
    nonGovernmentalOrganization: false;
    nonFormalEducation: false;
    legalForm: string;
    type: string;
  };
}

const OrganizationExtendedForm = ({ title, disabled, organization, isLoading, id, back }: any) => {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [validateOnChange, setValidateOnChange] = useState<any>(false);
  const [status, setStatus] = useState('');
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const backUrl = slugs.organizations;
  const user = useAppSelector((state) => state.user.userData);

  const lastRequestApprovalRejectionOrDraft =
    organization &&
    [StatusTypes.APPROVED, StatusTypes.REJECTED, StatusTypes.DRAFT].includes(
      organization?.lastRequest?.status,
    );

  const request = organization?.lastRequest;

  const canCreateRequest = organization?.canCreateRequest || !request?.id;

  const isCreateStatus = canCreateRequest || request?.status === StatusTypes.DRAFT;

  const createOrUpdateRequest = useMutation(
    (params: any) =>
      canCreateRequest ? api.createRequests(params) : api.updateRequest(params, request?.id),
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
      entityType: RequestEntityTypes.TENANTS,
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

  const organizationWithoutLastRequest = useMemo(() => {
    if (!organization) return {};

    const { lastRequest, ...rest } = organization;

    return flattenArrays({ ...rest });
  }, [organization]);

  const getFormValues = () => {
    // Do not apply diff if the last request status type is APPROVED OR REJECTED
    if (!request?.id || lastRequestApprovalRejectionOrDraft) {
      return cloneDeep(organizationWithoutLastRequest);
    }
    if (request) {
      return applyPatch(cloneDeep(organizationWithoutLastRequest), request?.changes || [])
        .newDocument;
    }

    return {};
  };

  const validationSchema = validateOrganizationForm;

  const formValues: any = getFormValues();
  const oldData = isEmpty(organizationWithoutLastRequest)
    ? formValues
    : organizationWithoutLastRequest;

  const showDraftButton = user.type === AdminRoleType.USER && lastRequestApprovalRejectionOrDraft;

  if (isLoading) {
    return <FullscreenLoader />;
  }

  return (
    <Formik
      enableReinitialize={false}
      initialValues={formValues}
      validationSchema={validationSchema}
      validateOnChange={validateOnChange}
      onSubmit={() => {}}
    >
      {({ values, errors, setFieldValue, setErrors, setValues }) => {
        const mergedDiffs = () => {
          const idKeys = {};

          const obj = {};

          const OrganizationDif = compare(organizationWithoutLastRequest, values, true);
          extractIdKeys(OrganizationDif, idKeys);
          processDiffs(OrganizationDif, idKeys, 0, obj);

          if (organization && !lastRequestApprovalRejectionOrDraft) {
            const requestDif = compare(formValues, values, true);
            extractIdKeys(requestDif, idKeys);
            processDiffs(requestDif, idKeys, 1, obj);
          }

          return Object.values(obj);
        };

        const changes = mergedDiffs();

        const submitChanges = changes.map((change: any) => change[0]);

        const containers = {
          [organizationTabTitles.generalInfo]: (
            <RequestOrganizationForm
              disabled={disabled}
              values={values}
              errors={errors}
              handleChange={setFieldValue}
            />
          ),
          [organizationTabTitles.governingBodies]: (
            <GoverningBodiesContainer
              disabled={disabled}
              handleChange={setFieldValue}
              governingBodies={values.governingBodies}
            />
          ),
          // [organizationTabTitles.fundingSources]: (
          //   <TenantFundingSourcesContainer
          //     disabled={disabled}
          //     handleChange={setFieldValue}
          //     fundingSources={values.fundingSources}
          //   />
          // ),
          [organizationTabTitles.memberships]: (
            <TenantMembershipsContainer
              disabled={disabled}
              handleChange={setFieldValue}
              memberships={values.memberships}
            />
          ),
          [organizationTabTitles.members]: (
            <OrganizationUsers
              id={id}
              onClickRow={(userId) => navigate(slugs.organizationUser(id, userId))}
            />
          ),
        };

        const hasNext = tabs[currentTabIndex + 1];
        const hasPrevious = tabs[currentTabIndex - 1];

        const titles = {
          name: { name: inputLabels.organizationName },
          code: { name: inputLabels.companyCode },
          phone: { name: inputLabels.companyPhone },
          email: { name: inputLabels.companyEmail },
          address: { name: inputLabels.locationAddress },
          type: { name: inputLabels.organizationType, getValueLabel: (val) => val?.name },
          legalForm: { name: inputLabels.legalForm, getValueLabel: (val) => val?.name },
          data: {
            name: inputLabels.url,
            getValueLabel: (val) => {
              return val?.url;
            },
            children: {
              foundedAt: { name: inputLabels.foundedAt },
              url: { name: inputLabels.url },
              hasBeneficiaryStatus: { name: inputLabels.hasBeneficiaryStatus },
              nonGovernmentalOrganization: { name: inputLabels.nonGovernmentalOrganization },
              nonFormalEducation: { name: inputLabels.nonFormalEducation },
            },
          },
          governingBodies: {
            getValueLabel: (val) => val?.name,
            name: organizationTabTitles.governingBodies,
            children: {
              name: { name: inputLabels.name },
              users: {
                name: inputLabels.users,
                children: {
                  firstName: { name: inputLabels.firstName },
                  lastName: { name: inputLabels.lastName },
                  position: { name: inputLabels.position },
                  personalCode: { name: inputLabels.personalCode },
                },
              },
            },
          },
          fundingSources: {
            getValueLabel: (val) => val?.source?.name,
            name: organizationTabTitles.fundingSources,
            children: {
              source: { name: inputLabels.investmentSources },
              fundsAmount: { name: inputLabels.fundsAmount },
              appointedAt: { name: inputLabels.appointedAt },
              description: { name: inputLabels.description },
            },
          },
          memberships: {
            getValueLabel: (val) => val?.name,
            name: organizationTabTitles.memberships,
            children: {
              name: { name: inputLabels.organizationName },
              startAt: { name: inputLabels.membershipStart },
              endAt: { name: inputLabels.membershipEnd },
              companyCode: { name: inputLabels.companyCode },
            },
          },
        };

        const onSubmit = async () => {
          let errors = {};
          try {
            await validationSchema?.validate(values, { abortEarly: false });
          } catch (e) {
            setValidateOnChange(true);

            errors = yupToFormErrors(e);
          }

          setErrors(errors);

          if (isEmpty(errors)) {
            if (!isCreateStatus) {
              return setStatus(StatusTypes.SUBMITTED);
            }
          }

          handleSubmit({
            changes: submitChanges,
            status: StatusTypes.CREATED,
          });
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
            setValidateOnChange(true);
            setErrors(yupToFormErrors(e));
          }
        };
        const info = [
          ...(organization?.id
            ? [
                <>
                  Identifikavimo kodas: <strong>{`#${organization.id}`}</strong>
                </>,
              ]
            : []),
          ...(organization?.createdAt
            ? [`Įregistruota: ${formatDate(organization.createdAt)}`]
            : []),
          ...(organization?.updatedAt ? [`Atnaujinta: ${formatDate(organization.updatedAt)}`] : []),
          ...(organization?.deletedAt
            ? [`Objekto išregistravimo data: ${formatDate(organization.deletedAt)}`]
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
                canValidate={request?.canValidate}
                currentTabIndex={currentTabIndex}
                onSetCurrentTabIndex={(_, index) => {
                  setCurrentTabIndex(index || 0);
                }}
                onSetStatus={(status) => setStatus(status)}
                tabs={tabs}
                back={back}
                info={info}
              />

              <Column>
                {containers[tabs[currentTabIndex]?.label]}
                <FormErrorMessage errors={errors} />
                <ButtonRow>
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
            {!!request && (
              <HistoryContainer
                handleClear={() => {
                  setValues(organizationWithoutLastRequest);
                }}
                oldData={oldData}
                requestId={request?.id}
                disabled={disabled}
                handleChange={setFieldValue}
                open={!lastRequestApprovalRejectionOrDraft}
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

export default OrganizationExtendedForm;
