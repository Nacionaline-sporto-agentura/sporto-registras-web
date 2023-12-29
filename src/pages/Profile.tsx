import { useMutation } from 'react-query';
import * as Yup from 'yup';
import PasswordField from '../components/fields/PasswordField';
import TextField from '../components/fields/TextField';
import FormPageWrapper from '../components/layouts/FormLayout';
import PasswordCheckListContainer from '../components/other/PasswordCheckListContainer';
import SimpleContainer from '../components/other/SimpleContainer';
import { useAppSelector } from '../state/hooks';
import { FormColumn, FormRow } from '../styles/CommonStyles';
import { ReactQueryError } from '../types';
import Api from '../utils/api';
import { AuthStrategy } from '../utils/constants';
import { getReactQueryErrorMessage, handleSuccessToast } from '../utils/functions';
import { formLabels, inputLabels, pageTitles, validationTexts } from '../utils/texts';

export interface UserProps {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  oldPassword?: string;
  newPassword?: string;
  repeatNewPassword?: string;
  allValid?: boolean;
}

export const validateProfileForm = Yup.object().shape(
  {
    oldPassword: Yup.string().when(['newPassword', 'repeatNewPassword'], (items: any, schema) => {
      if (items.some((item) => !!item)) {
        return schema.required(validationTexts.requireText);
      }
      return schema.nullable();
    }),
    repeatNewPassword: Yup.string().when(['oldPassword', 'newPassword'], (items: any, schema) => {
      if (items.some((item) => item)) {
        return schema.required(validationTexts.requireText);
      }
      return schema.nullable();
    }),

    newPassword: Yup.string().when(
      ['oldPassword', 'repeatNewPassword', 'allValid'],
      (items: any, schema) => {
        if (!!items[0] || !!items[1]) {
          return schema
            .required(validationTexts.requireText)
            .test(
              'doesNotMeetRequirements',
              validationTexts.doesNotMeetRequirements,
              () => !!items[2],
            );
        }

        return schema.nullable();
      },
    ),

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
      .matches(/(86|\+3706)\d{7}/, validationTexts.badPhoneFormat),
    email: Yup.string().email(validationTexts.badEmailFormat).required(validationTexts.requireText),
  },
  [
    ['newPassword', 'oldPassword'],
    ['newPassword', 'allValid'],
    ['newPassword', 'repeatNewPassword'],
    ['oldPassword', 'repeatNewPassword'],
  ],
);

const Profile = () => {
  const user = useAppSelector((state) => state.user.userData);

  const updateProfile = useMutation(
    (values: UserProps) => Api.updateAdminUser({ params: values, id: user.id || '' }),
    {
      onSuccess: () => {
        handleSuccessToast(validationTexts.profileUpdated);
      },
      retry: false,
    },
  );

  const handleProfileSubmit = async (values: UserProps, { setErrors }) => {
    const { firstName, lastName, email, phone, oldPassword, newPassword } = values;

    const params = {
      firstName,
      lastName,
      email: email?.toLowerCase(),
      phone,
      ...(!!newPassword && { password: newPassword }),
      ...(!!oldPassword && { oldPassword }),
    };

    try {
      await updateProfile.mutateAsync(params);
    } catch (e: any) {
      const error = e as ReactQueryError;
      const errorMessage = getReactQueryErrorMessage(error.response);
      setErrors({ oldPassword: errorMessage });
    }
  };

  const canChangePassword = user.authStrategy === AuthStrategy.PASSWORD;

  const initialProfileValues: UserProps = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    oldPassword: '',
    newPassword: '',
    allValid: false,
    repeatNewPassword: '',
  };

  const renderProfileForm = (values: UserProps, errors: any, handleChange) => {
    return (
      <>
        <SimpleContainer title={formLabels.profileInfo}>
          <FormRow columns={2}>
            <TextField
              disabled={true}
              label={inputLabels.firstName}
              value={values.firstName}
              error={errors.firstName}
              name="firstName"
              onChange={(firstName) => handleChange('firstName', firstName)}
            />
            <TextField
              disabled={true}
              label={inputLabels.lastName}
              name="lastName"
              value={values.lastName}
              error={errors.lastName}
              onChange={(lastName) => handleChange('lastName', lastName)}
            />
          </FormRow>
          <FormRow columns={2}>
            <TextField
              label={inputLabels.phone}
              value={values.phone}
              error={errors.phone}
              name="phone"
              onChange={(phone) => handleChange('phone', phone)}
            />
            <TextField
              label={inputLabels.email}
              name="email"
              type="email"
              value={values.email}
              error={errors.email}
              onChange={(email) => handleChange('email', email)}
            />
          </FormRow>
        </SimpleContainer>
        {canChangePassword && (
          <SimpleContainer title={formLabels.changePassword}>
            <FormRow columns={2}>
              <PasswordField
                label={inputLabels.oldPassword}
                value={values.oldPassword}
                error={errors.oldPassword}
                name="oldPassword"
                onChange={(oldPassword) => handleChange('oldPassword', oldPassword)}
              />
            </FormRow>
            <FormRow columns={2}>
              <FormColumn>
                <PasswordField
                  label={inputLabels.newPassword}
                  name="newPassword"
                  value={values.newPassword}
                  error={errors.newPassword}
                  onChange={(newPassword) => handleChange('newPassword', newPassword)}
                />
                <PasswordCheckListContainer
                  setAllValid={(allValid) => handleChange('allValid', allValid)}
                  password={values.newPassword!}
                  repeatPassword={values.repeatNewPassword!}
                />
              </FormColumn>
              <PasswordField
                label={inputLabels.repeatNewPassword}
                value={values.repeatNewPassword}
                error={errors.repeatNewPassword}
                name="repeatNewPassword"
                onChange={(repeatNewPassword) =>
                  handleChange('repeatNewPassword', repeatNewPassword)
                }
              />
            </FormRow>
          </SimpleContainer>
        )}
      </>
    );
  };

  return (
    <FormPageWrapper
      back={false}
      title={pageTitles.updateProfile}
      initialValues={initialProfileValues}
      onSubmit={handleProfileSubmit}
      renderForm={renderProfileForm}
      validationSchema={validateProfileForm}
    />
  );
};

export default Profile;
