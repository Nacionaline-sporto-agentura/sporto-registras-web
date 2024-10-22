import { InstitutionProps } from '../../pages/InstitutionForm';
import { FormRow } from '../../styles/CommonStyles';
import { formLabels, inputLabels } from '../../utils/texts';
import CheckBox from '../fields/CheckBox';
import TextField from '../fields/TextField';
import styled from 'styled-components';

const OwnerForm = ({
  values,
  errors,
  handleChange,
  disabled,
}: {
  values: InstitutionProps;
  errors: any;
  handleChange;
  disabled: boolean;
}) => {
  const showPersonalCodeField = !values.ownerWithPassword;
  return (
    <Container>
      <CheckBox
        label={inputLabels.addOwner}
        value={values.showOwnerForm}
        onChange={(value) => handleChange('showOwnerForm', value)}
      />
      {values.showOwnerForm && (
        <>
          <TitleRow>
            <Title>{formLabels.addOwner}</Title>
          </TitleRow>

          <FormRow columns={2}>
            <TextField
              disabled={disabled}
              label={inputLabels.firstName}
              value={values.firstName}
              error={errors.firstName}
              onChange={(firstName) => handleChange('firstName', firstName)}
            />
            <TextField
              disabled={disabled}
              label={inputLabels.lastName}
              value={values.lastName}
              error={errors.lastName}
              onChange={(lastName) => handleChange('lastName', lastName)}
            />
          </FormRow>
          <FormRow columns={showPersonalCodeField ? 3 : 2}>
            <TextField
              disabled={disabled}
              label={inputLabels.phone}
              value={values.phone}
              error={errors.phone}
              onChange={(phone) => handleChange('phone', phone)}
            />
            <TextField
              disabled={disabled}
              label={inputLabels.email}
              value={values.email}
              error={errors.email}
              onChange={(email) => handleChange('email', email)}
            />
            {showPersonalCodeField && (
              <TextField
                disabled={disabled}
                label={inputLabels.personalCode}
                value={values.personalCode}
                error={errors.personalCode}
                onChange={(personalCode) => handleChange('personalCode', personalCode)}
              />
            )}
          </FormRow>
          <FormRow columns={1}>
            <CheckBox
              disabled={disabled}
              label={inputLabels.ownerWithPassword}
              value={values.ownerWithPassword}
              onChange={(value) => handleChange('ownerWithPassword', value)}
            />
          </FormRow>
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  background-color: #ffffff;
  border: 1px solid #dfdfdf;
  border-radius: 4px;
  padding: 16px;
  width: 100%;
`;

const Title = styled.div`
  font-size: 1.4rem;
  font-weight: bold;
  color: #231f20;
`;

const TitleRow = styled.div`
  display: flex;
  margin: 16px 0;
`;

export default OwnerForm;
