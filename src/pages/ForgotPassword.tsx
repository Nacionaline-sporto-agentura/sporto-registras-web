import { useFormik } from 'formik';
import { useMutation } from 'react-query';
import styled from 'styled-components';
import * as Yup from 'yup';
import Button from '../components/buttons/Button';
import TextField from '../components/fields/TextField';
import ReturnToLogin from '../components/other/ReturnToLogin';
import { ReactQueryError } from '../types';
import api from '../utils/api';
import {
  getErrorMessage,
  getReactQueryErrorMessage,
  handleErrorToastFromServer,
} from '../utils/functions';
import { validationTexts } from '../utils/texts';

export const remindPasswordSchema = Yup.object().shape({
  email: Yup.string().required(validationTexts.requireText).email(validationTexts.badEmailFormat),
});
const ForgotPassword = () => {
  const handleRemindPassword = async (values: { email: string }) => {
    const { email } = values;
    const params = { email: email.toLocaleLowerCase() };

    return await api.remindPassword(params);
  };

  const handleInputError = (e) => {
    const error = e as ReactQueryError;
    const type = getReactQueryErrorMessage(error);
    const message = getErrorMessage(type);
    if (error) {
      return setErrors({ email: message });
    }
    handleErrorToastFromServer();
  };

  const handleSuccess = (response) => {
    if (response.invalidUntil) {
      return setErrors({
        email: validationTexts.tooFrequentRequest,
      });
    }

    if (response?.url) {
      const url = new URL(response?.url);
      url.hostname = window.location.hostname;
      url.port = window.location.port;
      url.protocol = window.location.protocol;
      console.log(url.href);
      alert(url.href);
    }
  };

  const { mutateAsync, isLoading, data } = useMutation(
    (params: { email: string }) => handleRemindPassword(params),
    {
      onError: handleInputError,
      onSuccess: handleSuccess,
      retry: false,
    },
  );

  const isSuccess = data?.success;

  const { values, errors, setFieldValue, handleSubmit, setErrors } = useFormik({
    initialValues: {
      email: '',
    },
    validateOnChange: false,
    validationSchema: remindPasswordSchema,
    onSubmit: (values) => mutateAsync({ email: values.email }),
  });

  const handleType = (field: string, value: string | boolean) => {
    setFieldValue(field, value);
    setErrors({});
  };

  return (
    <>
      {!isSuccess ? (
        <Container noValidate onSubmit={handleSubmit}>
          <InfoContainer>
            <SecondTitle>{'Pamiršote slaptažodį?'}</SecondTitle>
            <Description>{'Slaptažodžio priminimas'}</Description>
          </InfoContainer>
          <FormContainer>
            <TextField
              value={values.email}
              type="email"
              name="email"
              error={errors.email}
              onChange={(value) => handleType('email', value)}
              label={'El. paštas'}
            />
            <Button loading={isLoading} disabled={isLoading} type="submit">
              {'Atstatyti slaptažodį'}
            </Button>
          </FormContainer>
        </Container>
      ) : (
        <InnerSecondContainer>
          <SecondTitle>{'Slaptažodžio priminimas'}</SecondTitle>
          <Description>
            {`El. paštu ${values.email} išsiuntėme prisijungimo instrukciją`}
          </Description>
        </InnerSecondContainer>
      )}
      <ReturnToLogin />
    </>
  );
};

export default ForgotPassword;

const InnerSecondContainer = styled.div`
  margin-bottom: 48px;
`;

const SecondTitle = styled.div`
  color: #121926;
  font-size: 1.8rem;
  font-weight: bold;
`;

const Description = styled.div`
  font-weight: normal;
  font-size: 1.4rem;
  color: #121926;
  margin
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Container = styled.form`
  display: flex;
  flex-direction: column;
  gap: 48px;
`;
