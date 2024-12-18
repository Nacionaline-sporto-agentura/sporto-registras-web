import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import * as Yup from 'yup';
import OrganizationForm from '../components/forms/OrganizationForm';
import FormikFormLayout from '../components/layouts/FormikFormLayout';
import FullscreenLoader from '../components/other/FullscreenLoader';
import { TitleColumn } from '../styles/CommonStyles';
import { DeleteInfoProps, ReactQueryError } from '../types';
import Api from '../utils/api';
import {
  filterOutGroup,
  getErrorMessage,
  getReactQueryErrorMessage,
  handleErrorToastFromServer,
  isNew,
} from '../utils/functions';
import { slugs } from '../utils/routes';
import {
  buttonsTitles,
  deleteDescriptionFirstPart,
  deleteDescriptionSecondPart,
  deleteTitles,
  pageTitles,
  validationTexts,
} from '../utils/texts';

import { phoneNumberRegexPattern } from '@aplinkosministerija/design-system';
import { companyCode } from 'lt-codes';
import { TenantTypes } from '../utils/constants';

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
    .matches(phoneNumberRegexPattern, validationTexts.badPhoneFormat),
  companyEmail: Yup.string()
    .email(validationTexts.badEmailFormat)
    .required(validationTexts.requireText),
});

export interface InstitutionProps {
  companyName?: string;
  companyCode?: string;
  companyPhone?: string;
  address?: string;
  tenantType: TenantTypes;
  companyEmail: string;
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

const UpdateOrganizationForm = () => {
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const [searchParams] = useSearchParams();
  const { parent } = Object.fromEntries([...Array.from(searchParams)]);

  const title = pageTitles.organization;

  const { isFetching, data: institution } = useQuery(
    ['organization', id],
    () => Api.getTenant({ id }),
    {
      onError: () => {
        navigate(slugs.organizations);
      },
    },
  );

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
      legalForm: legalForm?.id,
      type: type?.id,
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
      const type = getReactQueryErrorMessage(error);
      const message = getErrorMessage(type);
      setErrors({ email: message });
    }
  };

  const updateTenant = useMutation((params: any) => Api.updateTenant({ params, id }), {
    onError: ({ response }) => {
      handleErrorToastFromServer(response);
    },
    onSuccess: () => {
      navigate(slugs.organizations);
    },
    retry: false,
  });

  const { data: groupOptions = [] } = useQuery(
    ['tenantOption', id],
    async () => filterOutGroup((await Api.getTenantOptions())?.rows, id),
    {
      onError: () => {
        handleErrorToastFromServer();
      },
    },
  );

  const handleDelete = useMutation(
    () =>
      Api.deleteTenant({
        id,
      }),
    {
      onError: () => {
        handleErrorToastFromServer();
      },
      onSuccess: () => {
        navigate(slugs.organizations);
      },
    },
  );

  const deleteInfo: DeleteInfoProps = {
    deleteButtonText: buttonsTitles.deleteGroup,
    deleteDescriptionFirstPart: deleteDescriptionFirstPart.delete,
    deleteDescriptionSecondPart: deleteDescriptionSecondPart.group,
    deleteTitle: deleteTitles.group,
    deleteName: institution?.name,
    handleDelete: handleDelete.mutateAsync,
  };

  const initialValues: any = {
    companyName: institution?.name || '',
    companyCode: institution?.code || '',
    companyPhone: institution?.phone || '',
    companyEmail: institution?.email || '',
    address: institution?.address || '',
    parent: institution?.parent || parent || '',
    tenantType: institution?.tenantType,
    data: { ...institution?.data },
  };

  const renderForm = (values: InstitutionProps, errors: any, handleChange) => {
    return (
      <TitleColumn>
        <OrganizationForm
          values={values}
          errors={errors}
          handleChange={handleChange}
          groupOptions={groupOptions}
        />
      </TitleColumn>
    );
  };

  if (isFetching) {
    return <FullscreenLoader />;
  }

  return (
    <FormikFormLayout
      title={title}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      renderForm={renderForm}
      validationSchema={validateCreateUserForm}
      deleteInfo={!isNew(id) ? deleteInfo : undefined}
    />
  );
};

export default UpdateOrganizationForm;
