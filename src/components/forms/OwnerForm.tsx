import { InstitutionProps } from '../../pages/InstitutionForm';
import { FormRow, TitleColumn } from '../../styles/CommonStyles';
import { formLabels, inputLabels } from '../../utils/texts';
import CheckBox from '../fields/CheckBox';
import TextField from '../fields/TextField';
import SimpleContainer from '../other/SimpleContainer';

const OwnerForm = ({
  values,
  errors,
  handleChange,
}: {
  values: InstitutionProps;
  errors: any;
  handleChange;
}) => {
  const showPersonalCodeField = !values.ownerWithPassword;
  return (
    <TitleColumn>
      <SimpleContainer title={formLabels.addOwner}>
        <FormRow columns={2}>
          <TextField
            label={inputLabels.firstName}
            value={values.firstName}
            error={errors.firstName}
            onChange={(firstName) => handleChange('firstName', firstName)}
          />
          <TextField
            label={inputLabels.lastName}
            value={values.lastName}
            error={errors.lastName}
            onChange={(lastName) => handleChange('lastName', lastName)}
          />
        </FormRow>
        <FormRow columns={showPersonalCodeField ? 3 : 2}>
          <TextField
            label={inputLabels.phone}
            value={values.phone}
            error={errors.phone}
            onChange={(phone) => handleChange('phone', phone)}
          />
          <TextField
            label={inputLabels.email}
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
          <CheckBox
            label={inputLabels.ownerWithPassword}
            value={values.ownerWithPassword}
            onChange={(value) => handleChange('ownerWithPassword', value)}
          />
        </FormRow>
      </SimpleContainer>
    </TitleColumn>
  );
};

export default OwnerForm;
