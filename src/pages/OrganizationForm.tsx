import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import OrganizationForm from '../components/forms/OrganizationForm';
import OwnerForm from '../components/forms/OwnerForm';
import FormikFormLayout from '../components/layouts/FormikFormLayout';
import { TitleColumn } from '../styles/CommonStyles';
import { ReactQueryError } from '../types';
import Api from '../utils/api';
import { ServerErrorTypes, TenantTypes } from '../utils/constants';
import {
  getErrorMessage,
  getReactQueryErrorMessage,
  handleErrorToastFromServer,
  isNew,
} from '../utils/functions';
import { useIsTenantUser } from '../utils/hooks';
import { slugs } from '../utils/routes';
import { pageTitles } from '../utils/texts';
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
  phone: string;
  parent?: any;
  ownerWithPassword?: boolean;
  tenantType?: TenantTypes;
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

const cookies = new Cookies();

const profileId = cookies.get('profileId');

const OrganizationFormPage = () => {
  const navigate = useNavigate();
  const { id = '' } = useParams();

  const [searchParams] = useSearchParams();
  const { parent } = Object.fromEntries([...Array.from(searchParams)]);
  const isTenantUser = useIsTenantUser();
  const title = pageTitles.newOrganization;

  const handleSubmit = async (values: InstitutionProps, { setErrors }) => {
    const {
      firstName,
      lastName,
      email,
      phone,
      companyEmail,
      address,
      companyCode,
      personalCode,
      companyName,
      companyPhone,
      ownerWithPassword,
      parent,
      legalForm,
      type,
      data,
      showOwnerForm,
    } = values;

    const params = {
      address,
      legalForm: legalForm?.id,
      type: type?.id,
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
      tenantType: TenantTypes.ORGANIZATION,
      data,
    };

    if (isNew(id)) {
      try {
        await createTenant.mutateAsync(params);
      } catch (e: any) {
        const error = e as ReactQueryError;
        const type = getReactQueryErrorMessage(error);
        const message = getErrorMessage(type);

        if (type === ServerErrorTypes.AUTH_COMPANY_EXISTS) {
          setErrors({ companyCode: message });
        } else {
          setErrors({ form: message });
        }
      }
      return;
    }

    return await updateTenant.mutateAsync(params);
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
      navigate(slugs.organizations);
    },
    retry: false,
  });

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
    async () => (await Api.getTenantOptions()).rows,
    {
      onError: () => {
        handleErrorToastFromServer();
      },
    },
  );

  const disabled = isTenantUser;

  const initialValues: InstitutionProps = {
    companyName: '',
    legalForm: undefined,
    type: undefined,
    companyCode: '',
    companyPhone: '',
    companyEmail: '',
    firstName: '',
    lastName: '',
    address: '',
    email: '',
    tenantType: TenantTypes.ORGANIZATION,
    ownerWithPassword: false,
    phone: '',
    personalCode: '',
    parent: parent || profileId || '',
    showOwnerForm: false,
  };

  const renderForm = (values: InstitutionProps, errors: any, handleChange) => {
    return (
      <TitleColumn>
        <OrganizationForm
          disabled={disabled}
          values={values}
          errors={errors}
          handleChange={handleChange}
          groupOptions={groupOptions}
        />
        <OwnerForm
          disabled={disabled}
          values={values}
          errors={errors}
          handleChange={handleChange}
        />
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
      disabled={isTenantUser}
    />
  );
};

export default OrganizationFormPage;
