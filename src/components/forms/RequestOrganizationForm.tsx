import { FormRow } from '../../styles/CommonStyles';
import { getTenantLegalFormList, getTenantSportOrganizationTypeList } from '../../utils/functions';
import { formLabels, inputLabels } from '../../utils/texts';
import AsyncSelectField from '../fields/AsyncSelectField';
import CheckBox from '../fields/CheckBox';
import DateField from '../fields/DateField';
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
          <AsyncSelectField
            label={inputLabels.legalForm}
            disabled={disabled}
            value={values?.legalForm}
            error={errors?.legalForm}
            name="legalForm"
            onChange={(legalForm) => handleChange('legalForm', legalForm)}
            getOptionLabel={(option) => option.name}
            loadOptions={getTenantLegalFormList}
          />
          <AsyncSelectField
            label={inputLabels.organizationType}
            disabled={disabled}
            value={values?.type}
            error={errors?.type}
            name="organizationType"
            onChange={(type) => handleChange('type', type)}
            getOptionLabel={(option) => option.name}
            loadOptions={getTenantSportOrganizationTypeList}
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
          <CheckBox
            label={inputLabels.canHaveChildren}
            value={values.data?.canHaveChildren}
            disabled={disabled}
            onChange={(value) => handleChange('data.canHaveChildren', value)}
          />
        </FormRow>
      </SimpleContainer>
    </>
  );
};

export default RequestOrganizationForm;
