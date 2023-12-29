import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import * as Yup from 'yup';
import OrganizationForm from '../components/forms/OrganizationForm';
import UserWithPersonalCodeForm from '../components/forms/UserWithPersonalCodeForm';
import FormPageWrapper from '../components/layouts/FormLayout';
import FullscreenLoader from '../components/other/FullscreenLoader';
import { useAppSelector } from '../state/hooks';
import { Column } from '../styles/CommonStyles';
import { DeleteInfoProps, ReactQueryError } from '../types';
import Api from '../utils/api';
import { TenantTypes } from '../utils/constants';
import {
  getReactQueryErrorMessage,
  handleErrorToastFromServer,
  isCurrentUser,
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

export const validateCreateUserForm = Yup.object().shape({
  firstName: Yup.string()
    .required(validationTexts.requireText)
    .test('validFirstName', validationTexts.validFirstName, (values) => {
      if (/\d/.test(values || '')) return false;

      return true;
    }),
  lastName: Yup.string()
    .required(validationTexts.requireText)
    .test('validLastName', validationTexts.validLastName, (values) => {
      if (/\d/.test(values || '')) return false;

      return true;
    }),
  phone: Yup.string()
    .required(validationTexts.requireText)
    .trim()
    .matches(/^(86|\+3706)\d{7}$/, validationTexts.badPhoneFormat),
  personalCode: Yup.string().required(validationTexts.requireText),
});

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
  canHaveChildren?: boolean;
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

const OrganizationFormPage = () => {
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const currentUser = useAppSelector((state) => state.user.userData);
  const [searchParams] = useSearchParams();
  const { parent } = Object.fromEntries([...Array.from(searchParams)]);

  const title = pageTitles.newOrganization;

  const { isFetching, data: institution } = useQuery(
    ['institution', id],
    () => Api.getUser({ id }),
    {
      onError: () => {
        navigate(slugs.users);
      },
      onSuccess: () => {
        if (isCurrentUser(id, currentUser.id)) return navigate(slugs.profile);
      },
      enabled: !isNew(id),
    },
  );

  const handleSubmit = async (values: InstitutionProps, { setErrors }) => {
    const {
      firstName,
      lastName,
      email,
      phone,
      companyEmail,
      companyCode,
      personalCode,
      companyName,
      companyPhone,
      parent,
      data,
    } = values;

    const params = {
      firstName,
      parent,
      lastName,
      email: email?.toLowerCase(),
      personalCode,
      phone,
      companyEmail: companyEmail?.toLowerCase(),
      companyCode,
      companyName,
      companyPhone,
      tenantType: TenantTypes.ORGANIZATION,
      data,
    };

    if (isNew(id)) {
      try {
        await createTenant.mutateAsync(params);
      } catch (e: any) {
        const error = e as ReactQueryError;
        const errorMessage = getReactQueryErrorMessage(error.response.data.message);
        setErrors({ email: errorMessage });
      }
      return;
    }

    return await updateTenant.mutateAsync(params);
  };

  const createTenant = useMutation((params: InstitutionProps) => Api.createTenant({ params }), {
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

  const updateTenant = useMutation((params: InstitutionProps) => Api.updateTenant({ params, id }), {
    onError: ({ response }) => {
      handleErrorToastFromServer(response);
    },
    onSuccess: () => {
      navigate(slugs.users);
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
        navigate(slugs.users);
      },
    },
  );

  const deleteInfo: DeleteInfoProps = {
    deleteButtonText: buttonsTitles.deleteUser,
    deleteDescriptionFirstPart: deleteDescriptionFirstPart.group,
    deleteDescriptionSecondPart: deleteDescriptionSecondPart.group,
    deleteTitle: deleteTitles.group,
    deleteName: institution?.name,
    handleDelete: !isNew(id) ? handleDelete.mutateAsync : undefined,
  };

  const initialValues: InstitutionProps = {
    companyName: '',
    companyCode: '',
    companyPhone: '',
    companyEmail: '',
    firstName: '',
    lastName: '',
    address: '',
    email: '',
    canHaveChildren: false,
    phone: '',
    personalCode: '',
    parent: parent || '',
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
        <UserWithPersonalCodeForm values={values} errors={errors} handleChange={handleChange} />
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

export default OrganizationFormPage;
