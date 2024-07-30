import { device } from '@aplinkosministerija/design-system';
import styled from 'styled-components';
import { FormRow } from '../../styles/CommonStyles';
import { Field } from '../../types';
import { FieldTypes } from '../../utils/constants';
import ButtonsGroup from '../buttons/ButtonsGroup';
import NumericTextField from '../fields/NumericTextField';
import SelectField from '../fields/SelectField';
import TextAreaField from '../fields/TextAreaField';

const FIELD_GROUPS = {
  ERDVES_ISMATAVIMAI: 'Erdvės išmatavimai',
  ZIUROVU_VIETOS: 'Žiūrovų vietos',
  PRITAIKYMAS_ASMENIMS_SU_NEGALIA: 'Pritaikymas asmenims su negalia',
  DANGOS: 'Dangos',
  YPATYBES: 'Ypatybės',
  PAPILDOMI_SEKTORIAI: 'Papildomi sektoriai',
  BASEINO_PARAMETRAI: 'Baseino parametrai',
  TRASOS_PARAMETRAI: 'Trasos parametrai',
  SAUDYKLOS_PARAMETRAI: 'Šaudyklos parametrai',
  PRIEPLAUKU_PARAMETRAI: 'Prieplaukų parametrai',
  PAPILDOMA_INFORMACIJA: 'Papildoma informacija',
};

const SportBaseSpaceAdditionalFields = ({
  additionalValues = {},
  additionalFields,
  errors,
  handleChange,
  disabled,
}: {
  additionalFields: any[];
  additionalValues: { [key: string]: any };
  errors: any;
  handleChange: any;
  disabled: boolean;
}) => {
  const renderField = (id, field: Field, onChange) => {
    const { title, options, type, description } = field;
    const fieldValue = additionalValues?.[id];
    const error = errors?.[id];

    const getCommonProps = {
      onChange,
      error,
      value: fieldValue,
      label: title,
      disabled,
      bottomLabel: description,
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
      case FieldTypes.TEXT_AREA:
        return <TextAreaField {...getCommonProps} />;
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

  const groupedFields = additionalFields.reduce((acc, curr) => {
    const group = curr.field.fieldGroup;

    if (!acc[group]) {
      acc[group] = [];
    }

    acc[group].push(curr);

    return acc;
  }, {});

  const sortedGroupedFields = Object.keys(FIELD_GROUPS).reduce((sortedAcc, key) => {
    if (groupedFields[key]) {
      sortedAcc[key] = groupedFields[key];
    }
    return sortedAcc;
  }, {});

  return (
    <Container>
      {Object.keys(sortedGroupedFields).map((group) => {
        const additionalFields = sortedGroupedFields[group];

        return (
          <div key={group}>
            <GroupTitle>{FIELD_GROUPS[group]}</GroupTitle>

            <FormRow columns={2}>
              {additionalFields
                .filter((additionalField) => additionalField.field.type !== FieldTypes.TEXT_AREA)
                .map((item) => {
                  return renderField(item.id, item.field, (value) => {
                    handleChange(`additionalValues`, { ...additionalValues, [item.id]: value });
                  });
                })}
            </FormRow>
            <FormRow columns={1}>
              {additionalFields
                .filter((additionalField) => additionalField.field.type === FieldTypes.TEXT_AREA)
                .map((item) => {
                  return renderField(item.id, item.field, (value) => {
                    handleChange(`additionalValues`, { ...additionalValues, [item.id]: value });
                  });
                })}
            </FormRow>
          </div>
        );
      })}
    </Container>
  );
};

export default SportBaseSpaceAdditionalFields;

const GroupTitle = styled.div`
  font-size: 2.4rem;
  font-weight: bold;
  color: #121926;
  opacity: 1;
  @media ${device.mobileL} {
    font-size: 1.2rem;
  }
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 20px 0;
`;
