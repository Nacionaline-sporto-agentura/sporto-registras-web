import { FormRow } from '../../styles/CommonStyles';
import { TenantTypes } from '../../utils/constants';
import { getTenantLegalFormList, getTenantSportOrganizationTypeList } from '../../utils/functions';
import { formLabels, inputLabels } from '../../utils/texts';
import AsyncSelectField from '../fields/AsyncSelectField';
import CheckBox from '../fields/CheckBox';
import DateField from '../fields/DateField';
import TextField from '../fields/TextField';
import TreeSelectField from '../fields/TreeSelect';
import SimpleContainer from '../other/SimpleContainer';

const OrganizationForm = ({
  values,
  errors,
  handleChange,
  groupOptions,
  disabled,
  toggleShowParentOrganization = true,
}: {
  values: any;
  errors: any;
  handleChange;
  groupOptions;
  disabled?: boolean;
  toggleShowParentOrganization?: boolean;
}) => {
  return (
    <>
      <SimpleContainer title={formLabels.infoAboutInstitution}>
        <FormRow columns={2}>
          <TextField
            label={inputLabels.name}
            value={values.companyName}
            error={errors.companyName}
            disabled={disabled}
            name="name"
            onChange={(name) => handleChange('companyName', name)}
          />
          {toggleShowParentOrganization && (
            <TreeSelectField
              label={inputLabels.parentOrganization}
              name={`parentOrganization`}
              error={errors?.parent}
              options={groupOptions}
              disabled={disabled}
              value={values.parent}
              onChange={(value) => {
                handleChange('parent', value.id);
              }}
            />
          )}
          <TextField
            label={inputLabels.companyCode}
            value={values.companyCode}
            error={errors.companyCode}
            disabled={disabled}
            name="companyCode"
            onChange={(companyCode) => handleChange('companyCode', companyCode)}
          />

          <TextField
            label={inputLabels.companyPhone}
            value={values.companyPhone}
            error={errors.companyPhone}
            disabled={disabled}
            name="companyPhone"
            onChange={(companyPhone) => handleChange('companyPhone', companyPhone)}
          />
          <TextField
            label={inputLabels.companyEmail}
            value={values.companyEmail}
            error={errors.companyEmail}
            disabled={disabled}
            name="companyEmail"
            onChange={(companyEmail) => handleChange('companyEmail', companyEmail)}
          />
        </FormRow>
      </SimpleContainer>

      {values.tenantType === TenantTypes.ORGANIZATION && (
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
      )}
    </>
  );
};

export default OrganizationForm;
