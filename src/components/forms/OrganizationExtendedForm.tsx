import { applyPatch } from 'fast-json-patch';
import { Formik, yupToFormErrors } from 'formik';
import { cloneDeep, isEmpty } from 'lodash';
import { companyCode } from 'lt-codes';
import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import * as Yup from 'yup';
import { device } from '../../styles';
import api from '../../utils/api';
import { StatusTypes, TenantTypes } from '../../utils/constants';
import { isNew } from '../../utils/functions';
import { slugs } from '../../utils/routes';
import { buttonsTitles, inputLabels, validationTexts } from '../../utils/texts';
import Button from '../buttons/Button';
import GoverningBodiesContainer from '../containers/GoverningBodies';
import TenantFundingSourcesContainer from '../containers/TenantFundingSources';
import TenantMembershipsContainer from '../containers/TenantMemberships';
import { flattenArrays } from '../fields/utils/function';
import { FormErrorMessage } from '../other/FormErrorMessage';
import FormPopUp from '../other/FormPopup';
import FullscreenLoader from '../other/FullscreenLoader';
import HistoryContainer from '../other/HistoryContainer';
import RequestFormHeader from '../other/RequestFormHeader';
import OrganizationForm from './OrganizationForm';

export const validateOrganizationForm = Yup.object().shape({
  companyName: Yup.string().required(validationTexts.requireText).trim(),
  companyCode: Yup.string()
    .required(validationTexts.requireText)
    .trim()
    .test('validateCompanyCode', validationTexts.companyCode, (value) => {
      return companyCode.validate(value).isValid;
    }),
  companyPhone: Yup.string()
    .required(validationTexts.requireText)
    .trim()
    .matches(/^(86|\+3706)\d{7}$/, validationTexts.badPhoneFormat),
  companyEmail: Yup.string()
    .email(validationTexts.badEmailFormat)
    .required(validationTexts.requireText),
});

const organizationTabTitles = {
  generalInfo: 'Bendra informacija',
  governingBodies: 'Valdymo organai',
  memberships: 'Narystės',
  fundingSources: 'Finansavimo šaltiniai',
};

export const tabs = [
  {
    label: organizationTabTitles.generalInfo,
    validation: validateOrganizationForm,
  },
  { label: organizationTabTitles.governingBodies },
  { label: organizationTabTitles.memberships },
  { label: organizationTabTitles.fundingSources },
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

const OrganizationExtendedForm = ({
  title,
  disabled,
  organization,
  groupOptions = [],
  isLoading,
  id,
}) => {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [validateOnChange, setValidateOnChange] = useState<any>({});
  const [status, setStatus] = useState('');
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const backUrl = slugs.organizations;

  const lastRequestApprovalOrRejection =
    organization &&
    [StatusTypes.APPROVED, StatusTypes.REJECTED].includes(organization?.lastRequest?.status);

  const request = organization?.lastRequest;

  const canCreateRequest = true;

  const createOrUpdateRequest = useMutation(
    (params: any) =>
      canCreateRequest ? api.createRequests(params) : api.updateRequest(params, id),
    {
      onSuccess: () => {
        navigate(backUrl);
        queryClient.invalidateQueries({ queryKey: ['tenant', id] });
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

  const organizationWithoutLastRequest = useMemo(() => {
    if (!organization) return {};

    const { ...rest } = organization;

    return flattenArrays({ ...rest });
  }, [organization]);

  const getFormValues = () => {
    // Do not apply diff if the last request status type is APPROVED OR REJECTED
    if (lastRequestApprovalOrRejection) {
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

          return Object.values(obj);
        };

        const changes = mergedDiffs();

        const submitChanges = changes.map((change: any) => change[0]);

        const containers = {
          [organizationTabTitles.generalInfo]: (
            <OrganizationForm
              disabled={disabled}
              toggleShowParentOrganization={false}
              values={values}
              errors={errors}
              handleChange={setFieldValue}
              groupOptions={groupOptions}
            />
          ),
          [organizationTabTitles.governingBodies]: (
            <GoverningBodiesContainer
              disabled={disabled}
              handleChange={setFieldValue}
              governingBodies={values.governingBodies}
            />
          ),
          [organizationTabTitles.fundingSources]: (
            <TenantFundingSourcesContainer
              disabled={disabled}
              handleChange={setFieldValue}
              fundingSources={values.fundingSources}
            />
          ),
          [organizationTabTitles.memberships]: (
            <TenantMembershipsContainer
              disabled={disabled}
              handleChange={setFieldValue}
              memberships={values.memberships}
            />
          ),
        };

        const hasNext = tabs[currentTabIndex + 1];
        const hasPrevious = tabs[currentTabIndex - 1];

        const titles = {
          name: { name: inputLabels.organizationName },
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

          // if (isEmpty(errors)) {
          //   if (!isCreateStatus) {
          //     return setStatus(StatusTypes.SUBMITTED);
          //   }

          handleSubmit({
            changes: submitChanges,
            status: StatusTypes.CREATED,
          });
          // }
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
                request={undefined}
                showDraftButton={false}
                disabled={disabled}
                handleDraft={() => handleDraft(submitChanges)}
                onSubmit={onSubmit}
                canValidate={false}
                currentTabIndex={currentTabIndex}
                onSetCurrentTabIndex={(_, index) => {
                  setCurrentTabIndex(index || 0);
                }}
                onSetStatus={(status) => setStatus(status)}
                tabs={tabs}
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
                // handleSubmit({
                //   ...(status === StatusTypes.SUBMITTED && { changes: submitChanges }),
                //   status,
                //   comment,
                // });
              }}
            />
            <HistoryContainer
              handleClear={() => {
                setValues(organizationWithoutLastRequest);
              }}
              oldData={oldData}
              requestId={1}
              disabled={disabled}
              handleChange={setFieldValue}
              open={!lastRequestApprovalOrRejection}
              titles={titles}
              diff={changes as any}
              data={values}
            />
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
