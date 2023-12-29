import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import * as Yup from 'yup';
import OrganizationForm from '../components/forms/OrganizationForm';
import UserWithEmailForm from '../components/forms/UserWithEmailForm';
import FormPageWrapper from '../components/layouts/FormLayout';
import { Column } from '../styles/CommonStyles';
import { ReactQueryError } from '../types';
import Api from '../utils/api';
import { TenantTypes } from '../utils/constants';
import { getReactQueryErrorMessage, handleErrorToastFromServer, isNew } from '../utils/functions';
import { slugs } from '../utils/routes';
import { pageTitles, validationTexts } from '../utils/texts';

import { companyCode } from 'lt-codes';

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
  email: Yup.string().email(validationTexts.badEmailFormat).required(validationTexts.requireText),

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
      canHaveChildren,
      data,
    } = values;

    const params = {
      user: {
        firstName,
        lastName,
        email: email?.toLowerCase(),
        phone,
        personalCode,
      },
      address,
      name: companyName,
      code: companyCode,
      phone: companyPhone,
      email: companyEmail?.toLowerCase(),
      ...(!!parent && { parent: parseInt(parent) }),
      tenantType: canHaveChildren ? TenantTypes.ORGANIZATION : TenantTypes.MUNICIPALITY,
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
    canHaveChildren: false,
    phone: '',
    personalCode: '',
    parent: parent || '',
  };

  const renderForm = (values: InstitutionProps, errors: any, handleChange) => {
    return (
      <Column>
        <OrganizationForm
          toggleCanHaveChildren={true}
          values={values}
          errors={errors}
          handleChange={handleChange}
          groupOptions={groupOptions}
        />
        <UserWithEmailForm values={values} errors={errors} handleChange={handleChange} />
      </Column>
    );
  };

  return (
    <FormPageWrapper
      title={title}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      renderForm={renderForm}
      validationSchema={validateCreateUserForm}
    />
  );
};

export default InstitutionForm;
