import { useMutation, useQuery } from 'react-query';
import * as Yup from 'yup';
import OrganizationForm from '../components/forms/OrganizationForm';
import FormPageWrapper from '../components/layouts/FormLayout';
import FullscreenLoader from '../components/other/FullscreenLoader';
import { Column } from '../styles/CommonStyles';
import { ReactQueryError } from '../types';
import Api from '../utils/api';
import {
  filterOutGroup,
  getReactQueryErrorMessage,
  handleErrorToastFromServer,
  handleSuccessToast,
} from '../utils/functions';
import { pageTitles, validationTexts } from '../utils/texts';

import { companyCode } from 'lt-codes';
import Cookies from 'universal-cookie';
import { TenantTypes } from '../utils/constants';
import { useIsTenantAdmin } from '../utils/hooks';

export const validateCreateUserForm = Yup.object().shape({
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

const MyOrganization = () => {
  const title = pageTitles.myOrganization;
  const isTenantAdmin = useIsTenantAdmin();
  const disabled = !isTenantAdmin;

  const { isFetching, data: institution } = useQuery(
    ['organization', profileId],
    () => Api.getTenant({ id: profileId }),
    {
      onError: () => {
        handleErrorToastFromServer();
      },
    },
  );

  const handleSubmit = async (values: InstitutionProps, { setErrors }) => {
    const { companyEmail, companyCode, companyName, companyPhone, parent, data, address } = values;

    const params = {
      name: companyName,
      address,
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
      const errorMessage = getReactQueryErrorMessage(error.response.data.message);
      setErrors({ email: errorMessage });
    }
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

  const { data: groupOptions = [] } = useQuery(
    ['tenantOption', profileId],
    async () => filterOutGroup((await Api.getTenantOptions())?.rows, profileId),
    {
      onError: () => {
        handleErrorToastFromServer();
      },
    },
  );

  const initialValues: InstitutionProps = {
    companyName: institution?.name || '',
    companyCode: institution?.code || '',
    companyPhone: institution?.phone || '',
    companyEmail: institution?.email || '',
    address: institution?.address || '',
    parent: institution?.parent || parent || '',
    tenantType: institution?.tenantType || '',
    data: { ...institution?.data },
  };

  const renderForm = (values: InstitutionProps, errors: any, handleChange) => {
    return (
      <Column>
        <OrganizationForm
          disabled={disabled}
          treeSelectDisabled={true}
          values={values}
          errors={errors}
          handleChange={handleChange}
          groupOptions={groupOptions}
        />
      </Column>
    );
  };

  if (isFetching) {
    return <FullscreenLoader />;
  }

  return (
    <FormPageWrapper
      back={false}
      title={title}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      renderForm={renderForm}
      validationSchema={validateCreateUserForm}
      disabled={disabled}
    />
  );
};

export default MyOrganization;
