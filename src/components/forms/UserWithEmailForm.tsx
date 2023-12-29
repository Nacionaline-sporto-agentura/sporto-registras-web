import { InstitutionProps } from '../../pages/InstitutionForm';
import { FormRow } from '../../styles/CommonStyles';
import { formLabels, inputLabels } from '../../utils/texts';
import TextField from '../fields/TextField';
import SimpleContainer from '../other/SimpleContainer';

const UserWithEmailForm = ({
  values,
  errors,
  handleChange,
}: {
  values: InstitutionProps;
  errors: any;
  handleChange;
}) => {
  return (
    <SimpleContainer title={formLabels.infoAboutOwner}>
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
      <FormRow columns={3}>
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
        <TextField
          label={inputLabels.personalCode}
          value={values.personalCode}
          error={errors.personalCode}
          onChange={(personalCode) => handleChange('personalCode', personalCode)}
        />
      </FormRow>
    </SimpleContainer>
  );
};

export default UserWithEmailForm;
