import { personalCode } from 'lt-codes';
import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { useAppSelector } from '../../state/hooks';
import { Column, FormRow } from '../../styles/CommonStyles';
import { DeleteInfoProps, ReactQueryError, User } from '../../types';
import api from '../../utils/api';
import { AdminRoleType, UserRoleType } from '../../utils/constants';
import {
  getReactQueryErrorMessage,
  handleErrorToastFromServer,
  isCurrentUser,
  isNew,
} from '../../utils/functions';
import { slugs } from '../../utils/routes';
import {
  buttonsTitles,
  deleteDescriptionFirstPart,
  deleteDescriptionSecondPart,
  deleteTitles,
  formLabels,
  inputLabels,
  pageTitles,
  roleLabels,
  validationTexts,
} from '../../utils/texts';
import CheckBox from '../fields/CheckBox';
import SelectField from '../fields/SelectField';
import TextField from '../fields/TextField';
import FormPageWrapper from '../layouts/FormLayout';
import FullscreenLoader from '../other/FullscreenLoader';
import SimpleContainer from '../other/SimpleContainer';

export interface UserProps {
  id?: string;
  firstName?: string;
  role?: AdminRoleType;
  fullName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  userWithPassword?: boolean;
  personalCode?: string;
}

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

  personalCode: Yup.string().when(['userWithPassword'], (items: any, schema) => {
    if (!items[0]) {
      return schema
        .required(validationTexts.requireText)
        .trim()
        .test('validatePersonalCode', validationTexts.personalCode, (value) => {
          return personalCode.validate(value).isValid;
        });
    }

    return schema.nullable();
  }),

  phone: Yup.string()
    .required(validationTexts.requireText)
    .trim()
    .matches(/^(86|\+3706)\d{7}$/, validationTexts.badPhoneFormat),
  email: Yup.string().email(validationTexts.badEmailFormat).required(validationTexts.requireText),
});

const UserForm = ({
  backUrl,
  tenantId,
  canDelete,
  canSubmit,
}: {
  backUrl: string;
  tenantId: string;
  canDelete: boolean;
  canSubmit: boolean;
}) => {
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const currentUser = useAppSelector((state) => state.user.userData);
  const disabled = !isNew(id);

  const title = isNew(id) ? pageTitles.newUser : pageTitles.updateUser;

  const { isFetching, data: user } = useQuery(
    ['externalUser', id],
    () => api.getTenantUser({ tenantId, id }),
    {
      onError: () => {
        navigate(backUrl);
      },
      onSuccess: () => {
        if (isCurrentUser(id, currentUser.id)) return navigate(slugs.profile);
      },
      enabled: !isNew(id),
    },
  );

  const handleSubmit = async (values: UserProps, { setErrors }) => {
    const { firstName, lastName, email, phone, role, userWithPassword, personalCode } = values;

    const params = {
      firstName,
      lastName,
      ...(!userWithPassword && { personalCode }),
      email: email?.toLowerCase(),
      phone,
      role,
      tenantId: parseInt(tenantId),
    };

    if (isNew(id)) {
      try {
        await createUser.mutateAsync(params);
      } catch (e: any) {
        const error = e as ReactQueryError;
        const errorMessage = getReactQueryErrorMessage(error.response.data.message);
        setErrors({ email: errorMessage });
      }
      return;
    }

    return await updateUser.mutateAsync(params);
  };

  const createUser = useMutation((params: User) => api.createUser({ params }), {
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
      navigate(backUrl);
    },
    retry: false,
  });

  const updateUser = useMutation(
    (params: User) => api.updateTenantUser({ params: { role: params.role }, id, tenantId }),
    {
      onError: ({ response }) => {
        handleErrorToastFromServer(response);
      },
      onSuccess: () => {
        navigate(backUrl);
      },
      retry: false,
    },
  );

  const handleDelete = useMutation(
    () =>
      api.deleteTenantUser({
        id,
        tenantId,
      }),
    {
      onError: () => {
        handleErrorToastFromServer();
      },
      onSuccess: () => {
        navigate(backUrl);
      },
    },
  );

  const deleteInfo: DeleteInfoProps = {
    deleteButtonText: buttonsTitles.deleteUser,
    deleteDescriptionFirstPart: deleteDescriptionFirstPart.user,
    deleteDescriptionSecondPart: deleteDescriptionSecondPart.user,
    deleteTitle: deleteTitles.user,
    deleteName: user?.fullName,
    handleDelete: canDelete ? handleDelete.mutateAsync : undefined,
  };

  const initialValues: UserProps = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || AdminRoleType.USER,
    userWithPassword: true,
  };

  const renderForm = (values: UserProps, errors: any, handleChange) => {
    const showPersonalCodeField = !disabled && !values.userWithPassword;

    return (
      <Column>
        <SimpleContainer title={formLabels.userInfo}>
          <FormRow columns={2}>
            <TextField
              label={inputLabels.firstName}
              value={values.firstName}
              error={errors.firstName}
              name="firstName"
              disabled={disabled}
              onChange={(firstName) => handleChange('firstName', firstName)}
            />
            <TextField
              label={inputLabels.lastName}
              name="lastName"
              value={values.lastName}
              error={errors.lastName}
              disabled={disabled}
              onChange={(lastName) => handleChange('lastName', lastName)}
            />
          </FormRow>
          <FormRow columns={showPersonalCodeField ? 3 : 2}>
            <TextField
              label={inputLabels.phone}
              value={values.phone}
              error={errors.phone}
              disabled={disabled}
              name="phone"
              placeholder="868888888"
              onChange={(phone) => handleChange('phone', phone)}
            />
            <TextField
              label={inputLabels.email}
              disabled={disabled}
              name="email"
              type="email"
              placeholder="vardas.pavardė@ltusportas.lt"
              value={values.email}
              error={errors.email}
              onChange={(email) => handleChange('email', email)}
            />
            {showPersonalCodeField && (
              <TextField
                label={inputLabels.personalCode}
                value={values.personalCode}
                error={errors.personalCode}
                onChange={(personalCode) => handleChange('personalCode', personalCode)}
              />
            )}
          </FormRow>
          <FormRow columns={1}>
            <SelectField
              label={inputLabels.role}
              name="role"
              value={values.role}
              disabled={!canSubmit}
              error={errors.role}
              options={Object.keys(UserRoleType)}
              onChange={(role) => handleChange('role', role)}
              getOptionLabel={(option) => roleLabels[option]}
            />
          </FormRow>
          {!disabled && (
            <FormRow columns={1}>
              <CheckBox
                label={inputLabels.userWithPassword}
                value={values.userWithPassword}
                onChange={(value) => handleChange('userWithPassword', value)}
              />
            </FormRow>
          )}
        </SimpleContainer>
      </Column>
    );
  };

  if (isFetching) {
    return <FullscreenLoader />;
  }

  return (
    <FormPageWrapper
      title={title}
      disabled={!canSubmit}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      renderForm={renderForm}
      validationSchema={validateCreateUserForm}
      deleteInfo={deleteInfo}
    />
  );
};

export default UserForm;
