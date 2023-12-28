import { Form, Formik, yupToFormErrors } from 'formik';
import { isEmpty } from 'lodash';
import { useState } from 'react';
import styled from 'styled-components';
import { device } from '../../styles';
import { ChildrenType, DeleteInfoProps } from '../../types';
import { buttonsTitles } from '../../utils/texts';
import BackButton from '../buttons/BackButton';
import Button from '../buttons/Button';
import { DeleteComponent } from '../other/DeleteComponent';

interface FormPageWrapperProps {
  renderForm: (
    values: any,
    errors: any,
    handleChange: (name: string, value: any) => {},
    setValues?: (values: any, shouldValidate?: boolean | undefined) => void,
    handleSubmit?: any,
    setErrors?: any,
  ) => ChildrenType;
  initialValues: any;
  onSubmit?: (values: any, setErrors?: any) => void;
  title?: string;
  validationSchema: any;
  back?: boolean;
  canSubmit?: boolean;
  enableReinitialize?: boolean;
  handleEdit?: () => void;
  disabled?: boolean;
  deleteInfo?: DeleteInfoProps;
  twoColumn?: boolean;
  submitButtonText?: string;
  showFormError?: boolean;
}

const FormPageWrapper = ({
  renderForm,
  title = '',
  initialValues,
  showFormError = true,
  onSubmit,
  validationSchema,
  back = true,
  deleteInfo,
  canSubmit = true,
  enableReinitialize = true,
  twoColumn = false,
  disabled,
  submitButtonText = buttonsTitles.save,
}: FormPageWrapperProps) => {
  const [validateOnChange, setValidateOnChange] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any, helper?: any) => {
    if (!onSubmit) return;

    setLoading(true);
    try {
      await onSubmit(values, helper);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const handleValidate = async (values) => {
    setValidateOnChange(true);
    try {
      await validationSchema.validate(values, { abortEarly: false });
    } catch (e) {
      return yupToFormErrors(e);
    }
  };

  return (
    <Container>
      <Formik
        enableReinitialize={enableReinitialize}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validateOnChange={validateOnChange}
        validationSchema={validationSchema}
        validate={handleValidate}
      >
        {({ values, errors, setFieldValue, handleSubmit, setValues }: any) => {
          return (
            <StyledForm two_column={twoColumn ? 1 : 0}>
              <Row>
                {back && <BackButton />}

                <InnerRow>
                  <Title>{title}</Title>
                  <DeleteComponent deleteInfo={deleteInfo} />
                </InnerRow>
              </Row>
              {renderForm(values, errors, setFieldValue, setValues, handleSubmit)}

              {showFormError && !isEmpty(errors) ? (
                <ErrorMessage>{errors.form || 'Užpildykite formą teisingai'}</ErrorMessage>
              ) : null}
              {!disabled && canSubmit && (
                <ButtonRow>
                  {onSubmit && (
                    <Button
                      onClick={handleSubmit}
                      type="button"
                      loading={loading}
                      disabled={loading}
                    >
                      {submitButtonText}
                    </Button>
                  )}
                </ButtonRow>
              )}
            </StyledForm>
          );
        }}
      </Formik>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 16px 16px;
  margin: 0 auto;
  min-height: 100%;
`;

const StyledForm = styled(Form)<{ two_column: number }>`
  flex-basis: ${({ two_column }) => (two_column ? '1200px' : '800px')};
`;

const Row = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const InnerRow = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 12px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  margin: 16px 0;
`;

const Title = styled.div`
  font-size: 3.2rem;
  font-weight: bold;
  color: #121926;
  opacity: 1;
  @media ${device.mobileL} {
    font-size: 2.4rem;
  }
`;

const ErrorMessage = styled.div`
  background-color: #ffedf0;
  color: #fe1d42;
  border: 1px solid #fe1d42;
  border-radius: 4px;
  padding: 5px 0 5px 16px;
  display: flex;
  align-items: center;
`;

export default FormPageWrapper;
