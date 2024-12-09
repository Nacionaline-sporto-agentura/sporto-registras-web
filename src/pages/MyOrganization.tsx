import { useMutation, useQuery } from 'react-query';
import * as Yup from 'yup';
import Api from '../utils/api';
import {
  getErrorMessage,
  getReactQueryErrorMessage,
  handleErrorToastFromServer,
  handleSuccessToast,
} from '../utils/functions';
import { pageTitles, validationTexts } from '../utils/texts';

import { phoneNumberRegexPattern } from '@aplinkosministerija/design-system';
import { companyCode } from 'lt-codes';
import Cookies from 'universal-cookie';
import OrganizationExtendedForm from '../components/forms/OrganizationExtendedForm';
import OrganizationForm from '../components/forms/OrganizationForm';
import FormikFormLayout from '../components/layouts/FormikFormLayout';
import FullscreenLoader from '../components/other/FullscreenLoader';
import { TitleColumn } from '../styles/CommonStyles';
import { ReactQueryError } from '../types';
import { TenantTypes } from '../utils/constants';
import { useIsTenantAdmin } from '../utils/hooks';

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
    .matches(phoneNumberRegexPattern, validationTexts.badPhoneFormat),
  companyEmail: Yup.string()
    .email(validationTexts.badEmailFormat)
    .required(validationTexts.requireText),
});

const cookies = new Cookies();

const profileId = cookies.get('profileId');

export interface InstitutionProps {
  companyName?: string;
  companyCode?: string;
  companyPhone?: string;
  address?: string;
  companyEmail: string;
  tenantType?: TenantTypes;
  parent?: any;
  legalForm?: { id: number; name: string };
  type?: { id: number; name: string };
  data?: {
    url: string;
    foundedAt: Date;
    hasBeneficiaryStatus: true;
    nonGovernmentalOrganization: false;
    nonFormalEducation: false;
  };
}

const MyOrganization = () => {
  const title = pageTitles.myOrganization;
  const isTenantAdmin = useIsTenantAdmin();
  const { isFetching, data: organization } = useQuery(
    ['organization', profileId],
    () => Api.getRequestTenantBase({ id: profileId }),
    {
      onError: () => {
        handleErrorToastFromServer();
      },
      refetchOnWindowFocus: false,
    },
  );

  const disabled =
    !isTenantAdmin ||
    (!organization?.lastRequest?.canEdit &&
      !!organization?.lastRequest &&
      !organization?.canCreateRequest);

  const initialValues: any = {
    companyName: organization?.name || '',
    companyCode: organization?.code || '',
    companyPhone: organization?.phone || '',
    companyEmail: organization?.email || '',
    address: organization?.address || '',
    parent: organization?.parent || '',
    tenantType: organization?.tenantType || '',
    data: { ...organization?.data },
  };

  const updateTenant = useMutation((params: any) => Api.updateTenant({ params, id: profileId }), {
    onError: ({ response }) => {
      handleErrorToastFromServer(response);
    },
    onSuccess: () => {
      handleSuccessToast();
    },
    retry: false,
  });

  if (organization?.tenantType === TenantTypes.MUNICIPALITY) {
    const disabled = !isTenantAdmin;
    const handleSubmit = async (values: InstitutionProps, { setErrors }) => {
      const {
        companyEmail,
        companyCode,
        companyName,
        companyPhone,
        parent,
        data,
        address,
        type,
        legalForm,
      } = values;

      const params = {
        name: companyName,
        address,
        legalForm: legalForm?.id,
        type: type?.id,
        code: companyCode,
        phone: companyPhone,
        email: companyEmail?.toLowerCase(),
        ...(!!parent && { parent: parseInt(parent) }),
        data,
      };

      try {
        return await updateTenant.mutateAsync(params);
      } catch (e: any) {
        const error = e as ReactQueryError;
        const type = getReactQueryErrorMessage(error);
        const message = getErrorMessage(type);
        setErrors({ email: message });
      }
    };

    const renderForm = (values: InstitutionProps, errors: any, handleChange) => {
      return (
        <TitleColumn>
          <OrganizationForm
            disabled={disabled}
            toggleShowParentOrganization={true}
            values={values}
            errors={errors}
            handleChange={handleChange}
            groupOptions={[]}
          />
        </TitleColumn>
      );
    };

    if (isFetching) {
      return <FullscreenLoader />;
    }

    return (
      <FormikFormLayout
        back={false}
        title={title}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        renderForm={renderForm}
        validationSchema={validateOrganizationForm}
        disabled={disabled}
      />
    );
  }

  return (
    <OrganizationExtendedForm
      title={title}
      groupOptions={[]}
      disabled={disabled}
      organization={{ ...initialValues, ...organization }}
      isLoading={isFetching}
      id={profileId}
    />
  );
};

export default MyOrganization;
