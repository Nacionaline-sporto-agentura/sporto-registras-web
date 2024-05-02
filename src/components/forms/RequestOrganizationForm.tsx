import { FormRow } from '../../styles/CommonStyles';
import { formLabels, inputLabels } from '../../utils/texts';
import CheckBox from '../fields/CheckBox';
import DateField from '../fields/DateField';
import SelectField from '../fields/SelectField';
import TextField from '../fields/TextField';
import SimpleContainer from '../other/SimpleContainer';

const RequestOrganizationForm = ({
  values,
  errors,
  handleChange,
  disabled = false,
}: {
  values: any;
  errors: any;
  handleChange;
  disabled?: boolean;
}) => {
  return (
    <>
      <SimpleContainer title={formLabels.infoAboutInstitution}>
        <FormRow columns={2}>
          <TextField
            label={inputLabels.name}
            value={values.name}
            error={errors.name}
            disabled={disabled}
            name="name"
            onChange={(name) => handleChange('name', name)}
          />

          <TextField
            label={inputLabels.companyCode}
            value={values.code}
            error={errors.code}
            disabled={disabled}
            name="companyCode"
            onChange={(companyCode) => handleChange('code', companyCode)}
          />

          <TextField
            label={inputLabels.companyPhone}
            value={values.phone}
            error={errors.phone}
            disabled={disabled}
            name="companyPhone"
            onChange={(companyPhone) => handleChange('phone', companyPhone)}
          />
          <TextField
            label={inputLabels.companyEmail}
            value={values.email}
            error={errors.email}
            disabled={disabled}
            name="companyEmail"
            onChange={(companyEmail) => handleChange('email', companyEmail)}
          />
        </FormRow>
      </SimpleContainer>

      <SimpleContainer title={formLabels.infoAboutOrganization}>
        <FormRow columns={2}>
          <SelectField
            label={inputLabels.legalForm}
            value={values?.data?.legalForm}
            error={errors?.data?.legalForm}
            disabled={disabled}
            name="legalForm"
            options={[]}
            onChange={(legalForm) => handleChange('data.legalForm', legalForm)}
            getOptionLabel={(label) => label}
          />
          <SelectField
            label={inputLabels.organizationType}
            value={values?.data?.type}
            error={errors?.data?.type}
            disabled={disabled}
            name="type"
            options={[]}
            onChange={(type) => handleChange('data.type', type)}
            getOptionLabel={(label) => label}
          />
          <TextField
            label={inputLabels.locationAddress}
            value={values.address}
            error={errors.address}
            disabled={disabled}
            name="address"
            onChange={(address) => handleChange('address', address)}
          />

          <DateField
            label={inputLabels.foundedAt}
            value={values?.data?.foundedAt}
            error={errors?.data?.foundedAt}
            disabled={disabled}
            onChange={(foundedAt) => handleChange('data.foundedAt', foundedAt)}
          />
          <TextField
            label={inputLabels.url}
            value={values?.data?.url}
            error={errors?.data?.url}
            disabled={disabled}
            name="url"
            onChange={(companyEmail) => handleChange('data.url', companyEmail)}
          />
        </FormRow>
        <FormRow columns={1}>
          <CheckBox
            label={inputLabels.hasBeneficiaryStatus}
            disabled={disabled}
            value={values.data?.hasBeneficiaryStatus}
            onChange={(value) => handleChange('data.hasBeneficiaryStatus', value)}
          />
          <CheckBox
            label={inputLabels.nonGovernmentalOrganization}
            value={values.data?.nonGovernmentalOrganization}
            disabled={disabled}
            onChange={(value) => handleChange('data.nonGovernmentalOrganization', value)}
          />
          <CheckBox
            label={inputLabels.nonFormalEducation}
            value={values.data?.nonFormalEducation}
            disabled={disabled}
            onChange={(value) => handleChange('data.nonFormalEducation', value)}
          />
        </FormRow>
      </SimpleContainer>
    </>
  );
};

export default RequestOrganizationForm;