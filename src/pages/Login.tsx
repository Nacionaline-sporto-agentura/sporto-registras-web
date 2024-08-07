import { CheckBox } from '@aplinkosministerija/design-system';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import * as Yup from 'yup';
import Button from '../components/buttons/Button';
import Checkbox from '../components/buttons/Checkbox';
import PasswordField from '../components/fields/PasswordField';
import TextField from '../components/fields/TextField';
import Icon, { IconName } from '../components/other/Icons';
import { device } from '../styles';
import { Url } from '../styles/CommonStyles';
import api from '../utils/api';
import { useCheckUserInfo, useEGatesSign } from '../utils/hooks';
import { handleUpdateTokens } from '../utils/loginFunctions';
import { slugs } from '../utils/routes';
import { url, validationTexts } from '../utils/texts';
interface LoginProps {
  email: string;
  password: string;
  refresh: boolean;
}

export const loginSchema = Yup.object().shape({
  email: Yup.string().required(validationTexts.requireText).email(validationTexts.badEmailFormat),
  password: Yup.string().required(validationTexts.requireText),
});

export const Login = () => {
  const navigate = useNavigate();
  const [agreedWithTermsOfService, setAgreedWithTermsOfService] = useState(false);

  const handleLogin = async (values: LoginProps) => {
    const { email, password, refresh } = values;
    const params = {
      password,
      refresh,
      email: email.toLocaleLowerCase(),
    };

    return await api.login(params);
  };

  const handleError = ({ response }) => {
    const text = validationTexts[response?.data?.type] || validationTexts.error;
    return setErrors({ email: text });
  };

  const loginMutation = useMutation((params: LoginProps) => handleLogin(params), {
    onError: handleError,
    onSuccess: (data) => {
      handleUpdateTokens(data);
    },
    retry: false,
  });

  const { isLoading: userInfoLoading } = useCheckUserInfo();

  const { mutateAsync: eGatesMutation, isLoading: eGatesSignLoading } = useEGatesSign();

  const loading = [loginMutation.isLoading, userInfoLoading].some((loading) => loading);

  const { values, errors, setFieldValue, handleSubmit, setErrors } = useFormik({
    initialValues: {
      email: '',
      password: '',
      refresh: false,
    },
    validateOnChange: false,
    validationSchema: loginSchema,
    onSubmit: loginMutation.mutateAsync,
  });

  const handleType = (field: string, value: string | boolean) => {
    setFieldValue(field, value);
    setErrors({});
  };

  return (
    <Container>
      <TextField
        value={values.email}
        type="email"
        name="email"
        error={errors.email}
        onChange={(value) => handleType('email', value)}
        label={'El. paštas'}
      />
      <PasswordField
        value={values.password}
        name="password"
        error={errors.password}
        onChange={(value) => handleType('password', value)}
        label={'Slaptažodis'}
        secondLabel={
          <Navigation onClick={() => navigate(slugs.forgotPassword)}>
            {'Pamiršote slaptažodį?'}
          </Navigation>
        }
      />
      <InnerContainer>
        <CheckBox
          label={
            <CheckBoxContainer>
              Sutinku su sporto registro {''}
              <Url target="_blank" href={url.privacyPolicy}>
                Privatumo politika
              </Url>{' '}
              ir{' '}
              <Url target="_blank" href={url.registrySecuritySettings}>
                Registro saugos nuostatais
              </Url>
            </CheckBoxContainer>
          }
          value={agreedWithTermsOfService}
          onChange={(value) => setAgreedWithTermsOfService(value)}
        />
        <Row>
          <StyledSingleCheckbox
            onChange={(value) => handleType('refresh', value!)}
            value={values.refresh}
            label={'Likti prisijungus'}
          />
          <div>
            <Button
              loading={loading}
              disabled={loading || !agreedWithTermsOfService}
              onClick={(e) => handleSubmit(e as any)}
            >
              {'Prisijungti'}
            </Button>
          </div>
        </Row>
      </InnerContainer>

      <OrRow>
        <Hr />
        <OrLabel>{'Arba'}</OrLabel>
        <Hr />
      </OrRow>

      <Button
        type="button"
        onClick={() => eGatesMutation()}
        loading={eGatesSignLoading}
        disabled={eGatesSignLoading || !agreedWithTermsOfService}
        leftIcon={<Icon name={IconName.eGate} />}
      >
        Prisijungti per El. valdžios vartus
      </Button>
    </Container>
  );
};

const InnerContainer = styled.form`
  margin-top: 12px;
`;

const CheckBoxContainer = styled.div`
  font-size: 1.4rem;
  color: #4b5565;
`;

const OrLabel = styled.div`
  font-weight: normal;
  font-size: 1.4rem;
  letter-spacing: 0.56px;
  color: #716c6b;
  margin: 0 17px;
`;

const OrRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 12px 0px;
  width: 100%;
  @media ${device.mobileL} {
    margin: 6px 0px;
  }
`;

const Hr = styled.div`
  background-color: #d3d2d2;
  width: 100%;
  height: 1px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  padding-top: 16px;
`;

const StyledSingleCheckbox = styled(Checkbox)`
  flex-grow: 1;
`;

const Container = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Navigation = styled.div`
  font-size: 1.4rem;
  color: #0862ab;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
