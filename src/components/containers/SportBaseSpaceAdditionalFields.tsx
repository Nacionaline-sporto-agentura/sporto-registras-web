import { FormRow } from '../../styles/CommonStyles';
import { Field } from '../../types';
import { FieldTypes } from '../../utils/constants';
import ButtonsGroup from '../buttons/ButtonsGroup';
import NumericTextField from '../fields/NumericTextField';
import SelectField from '../fields/SelectField';
import TextField from '../fields/TextField';

const SportBaseSpaceAdditionalFields = ({
  additionalValues,
  additionalFields,
  errors,
  handleChange,
  disabled,
}: {
  additionalFields: any;
  additionalValues: { [key: string]: any };
  errors: any;
  handleChange: any;
  disabled: boolean;
}) => {
  const renderField = (id, field: Field, onChange) => {
    const { title, options, type } = field;
    const fieldValue = additionalValues?.[id];
    const error = errors?.[id];

    const getCommonProps = {
      onChange,
      error,
      value: fieldValue,
      label: title,
      disabled,
    };
    const geSelectProps = {
      ...getCommonProps,
      getOptionLabel: (option: any) => option,
      options,
    };

    switch (type) {
      case FieldTypes.SELECT:
        return (
          <SelectField
            {...geSelectProps}
            value={options.find((option) => option === fieldValue)}
            onChange={(value) => onChange(value)}
          />
        );
      case FieldTypes.TEXT:
        return <TextField {...getCommonProps} />;
      case FieldTypes.NUMBER:
        return <NumericTextField {...getCommonProps} digitsAfterComma={field.scale} />;

      case FieldTypes.BOOLEAN:
        return (
          <ButtonsGroup
            {...geSelectProps}
            onChange={(value) => onChange(value)}
            options={[true, false]}
            getOptionLabel={(option) => (option ? 'Taip' : 'Ne')}
            isSelected={(options) => options === fieldValue}
          />
        );

      default:
        return null;
    }
  };

  return (
    <FormRow columns={2}>
      {additionalFields.map((item) => {
        return renderField(item.id, item.field, (value) => {
          handleChange(`additionalValues.${item.id}`, value);
        });
      })}
    </FormRow>
  );
};

export default SportBaseSpaceAdditionalFields;
