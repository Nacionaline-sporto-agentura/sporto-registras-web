import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import * as Yup from 'yup';
import OrganizationForm from '../components/forms/OrganizationForm';
import FormPageWrapper from '../components/layouts/FormLayout';
import FullscreenLoader from '../components/other/FullscreenLoader';
import { Column } from '../styles/CommonStyles';
import { DeleteInfoProps, ReactQueryError } from '../types';
import Api from '../utils/api';
import {
  filterOutGroup,
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
    .matches(/^(86|\+3706)\d{7}$/, validationTexts.badPhoneFormat),
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

const UpdateOrganizationForm = () => {
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const [searchParams] = useSearchParams();
  const { parent } = Object.fromEntries([...Array.from(searchParams)]);

  const title = pageTitles.updateInstitution;

  const { isFetching, data: institution } = useQuery(
    ['institution', id],
    () => Api.getTenant({ id }),
    {
      onError: () => {
        navigate(slugs.institutions);
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

  const updateTenant = useMutation((params: any) => Api.updateTenant({ params, id }), {
    onError: ({ response }) => {
      handleErrorToastFromServer(response);
    },
    onSuccess: () => {
      navigate(slugs.institutions);
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
        navigate(slugs.institutions);
      },
    },
  );

  const deleteInfo: DeleteInfoProps = {
    deleteButtonText: buttonsTitles.group,
    deleteDescriptionFirstPart: deleteDescriptionFirstPart.group,
    deleteDescriptionSecondPart: deleteDescriptionSecondPart.group,
    deleteTitle: deleteTitles.group,
    deleteName: institution?.name,
    handleDelete: !isNew(id) ? handleDelete.mutateAsync : undefined,
  };

  const initialValues: InstitutionProps = {
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
      <Column>
        <OrganizationForm
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
      title={title}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      renderForm={renderForm}
      validationSchema={validateCreateUserForm}
      deleteInfo={deleteInfo}
    />
  );
};

export default UpdateOrganizationForm;
