import { InstitutionProps } from '../../pages/InstitutionForm';
import { FormRow } from '../../styles/CommonStyles';
import { formLabels, inputLabels } from '../../utils/texts';
import DateField from '../DateField';
import CheckBox from '../fields/CheckBox';
import SelectField from '../fields/SelectField';
import TextField from '../fields/TextField';
import TreeSelectField from '../fields/TreeSelect';
import SimpleContainer from '../other/SimpleContainer';

const OrganizationForm = ({
  values,
  errors,
  handleChange,
  groupOptions,
}: {
  values: InstitutionProps;
  errors: any;
  handleChange;
  groupOptions;
}) => {
  return (
    <>
      <SimpleContainer title={formLabels.infoAboutInstitution}>
        <FormRow columns={2}>
          <TextField
            label={inputLabels.name}
            value={values.companyName}
            error={errors.companyName}
            name="name"
            onChange={(name) => handleChange('companyName', name?.trim())}
          />
          <TreeSelectField
            label={inputLabels.group}
            name={`group`}
            error={errors?.parent}
            groupOptions={groupOptions}
            value={values.parent}
            onChange={(value) => {
              handleChange('parent', value.id);
            }}
          />
          <TextField
            label={inputLabels.companyCode}
            value={values.companyCode}
            error={errors.companyCode}
            name="companyCode"
            onChange={(companyCode) => handleChange('companyCode', companyCode)}
          />

          <TextField
            label={inputLabels.companyPhone}
            value={values.companyPhone}
            error={errors.companyPhone}
            name="companyPhone"
            onChange={(companyPhone) => handleChange('companyPhone', companyPhone)}
          />
          <TextField
            label={inputLabels.companyEmail}
            value={values.companyEmail}
            error={errors.companyEmail}
            name="companyEmail"
            onChange={(companyEmail) => handleChange('companyEmail', companyEmail)}
          />
        </FormRow>
        <FormRow columns={1}>
          <CheckBox
            label={inputLabels.canHaveChildren}
            value={values.canHaveChildren}
            onChange={(value) => handleChange('canHaveChildren', value)}
          />
        </FormRow>
      </SimpleContainer>

      {values.canHaveChildren && (
        <SimpleContainer title={formLabels.infoAboutOrganization}>
          <FormRow columns={2}>
            <SelectField
              label={inputLabels.legalForm}
              value={values?.data?.legalForm}
              error={errors?.data?.legalForm}
              name="legalForm"
              options={[]}
              onChange={(legalForm) => handleChange('data.legalForm', legalForm)}
              getOptionLabel={(label) => label}
            />
            <SelectField
              label={inputLabels.organizationType}
              value={values?.data?.type}
              error={errors?.data?.type}
              name="type"
              options={[]}
              onChange={(type) => handleChange('data.type', type)}
              getOptionLabel={(label) => label}
            />
            <TextField
              label={inputLabels.locationAddress}
              value={values.address}
              error={errors.address}
              name="address"
              onChange={(address) => handleChange('address', address)}
            />

            <DateField
              label={inputLabels.foundedAt}
              value={values?.data?.foundedAt}
              error={errors?.data?.foundedAt}
              onChange={(foundedAt) => handleChange('data.foundedAt', foundedAt)}
            />
            <TextField
              label={inputLabels.url}
              value={values?.data?.url}
              error={errors?.data?.url}
              name="url"
              onChange={(companyEmail) => handleChange('data.url', companyEmail)}
            />
          </FormRow>
          <FormRow columns={1}>
            <CheckBox
              label={inputLabels.hasBeneficiaryStatus}
              value={values.data?.hasBeneficiaryStatus}
              onChange={(value) => handleChange('data.hasBeneficiaryStatus', value)}
            />
            <CheckBox
              label={inputLabels.nonGovernmentalOrganization}
              value={values.data?.nonGovernmentalOrganization}
              onChange={(value) => handleChange('data.nonGovernmentalOrganization', value)}
            />
            <CheckBox
              label={inputLabels.nonFormalEducation}
              value={values.data?.nonFormalEducation}
              onChange={(value) => handleChange('data.nonFormalEducation', value)}
            />
          </FormRow>
        </SimpleContainer>
      )}
    </>
  );
};

export default OrganizationForm;
