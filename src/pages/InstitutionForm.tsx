import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import OrganizationForm from '../components/forms/OrganizationForm';
import FormikFormLayout from '../components/layouts/FormikFormLayout';
import { TitleColumn } from '../styles/CommonStyles';
import { ReactQueryError } from '../types';
import Api from '../utils/api';
import { getErrorMessage, getReactQueryErrorMessage, handleErrorToastFromServer, isNew } from '../utils/functions';
import { slugs } from '../utils/routes';
import { pageTitles } from '../utils/texts';
import OwnerForm from '../components/forms/OwnerForm';
import { TenantTypes } from '../utils/constants';
import { combinedInstitutionValidationSchema } from '../utils/validation';

export interface InstitutionProps {
  companyName?: string;
  companyCode?: string;
  companyPhone?: string;
  address?: string;
  firstName?: string;
  companyEmail: string;
  lastName?: string;
  email?: string;
  personalCode?: string;
  ownerWithPassword?: boolean;
  phone: string;
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
  showOwnerForm?: boolean;
}

const InstitutionForm = () => {
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const [searchParams] = useSearchParams();
  const { parent } = Object.fromEntries([...Array.from(searchParams)]);

  const title = pageTitles.newInstitution;

  const handleSubmit = async (values: InstitutionProps, { setErrors }) => {
    const {
      firstName,
      lastName,
      email,
      address,
      phone,
      companyEmail,
      companyCode,
      personalCode,
      companyName,
      companyPhone,
      parent,
      tenantType,
      ownerWithPassword,
      data,
      legalForm,
      type,
      showOwnerForm,
    } = values;

    const params = {
      legalForm: legalForm?.id,
      type: type?.id,

      address,
      name: companyName,
      code: companyCode,
      phone: companyPhone,
      email: companyEmail?.toLowerCase(),
      ...(!!parent && { parent: parseInt(parent) }),
      ...(!!showOwnerForm && {
        user: {
          firstName,
          lastName,
          email: email?.toLowerCase(),
          phone,
          ...(!ownerWithPassword && { personalCode }),
        },
      }),
      tenantType: tenantType,
      data: { ...data, canHaveChildren: true },
    };

    if (isNew(id)) {
      try {
        await createTenant.mutateAsync(params);
      } catch (e: any) {
        const error = e as ReactQueryError;
        const type = getReactQueryErrorMessage(error);
        const message = getErrorMessage(type);
        setErrors({ email: message });
      }
      return;
    }
  };

  const createTenant = useMutation((params: any) => Api.createTenant({ params }), {
    onError: ({ response }) => {
      handleErrorToastFromServer(response);
    },
    onSuccess: (response) => {
      if (response?.url) {
        const url = new URL(response?.url);
        url.hostname = window.location.hostname;
        url.port = window.location.port;
        url.protocol = window.location.protocol;
        console.log(url.href);
        alert(url.href);
      }
      navigate(slugs.institutions);
    },
    retry: false,
  });

  const { data: groupOptions = [] } = useQuery(
    ['tenantOption', id],
    async () => (await Api.getTenantOptions()).rows,
    {
      onError: () => {
        handleErrorToastFromServer();
      },
    },
  );

  const initialValues: InstitutionProps = {
    companyName: '',
    companyCode: '',
    companyPhone: '',
    companyEmail: '',
    firstName: '',
    lastName: '',
    address: '',
    email: '',
    tenantType: TenantTypes.MUNICIPALITY,
    phone: '',
    personalCode: '',
    parent: parent || '',
    data: undefined,
    showOwnerForm: false,
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
        <OwnerForm disabled={false} values={values} errors={errors} handleChange={handleChange} />
      </TitleColumn>
    );
  };

  return (
    <FormikFormLayout
      title={title}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      renderForm={renderForm}
      validationSchema={combinedInstitutionValidationSchema}
    />
  );
};

export default InstitutionForm;
