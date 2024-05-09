import { FormRow } from '../../styles/CommonStyles';
import { SportBaseSpace, SportsBasesCondition, SportsBasesType } from '../../types';
import {
  getSportBaseSpaceSportTypesList,
  getSportBaseSpaceTypesList,
  getSportBaseTechnicalConditionList,
} from '../../utils/functions';
import { inputLabels } from '../../utils/texts';
import AsyncMultiSelect from '../fields/AsyncMultiSelect';
import AsyncSelectField from '../fields/AsyncSelectField';
import TextField from '../fields/TextField';
import { generateUniqueString } from '../fields/utils/function';

const SportBaseSpaceGeneralContainer = ({
  sportBaseSpace,
  errors,
  handleChange,
  disabled,
}: {
  sportBaseSpace: SportBaseSpace;
  errors: any;
  handleChange: any;
  disabled: boolean;
}) => {
  const sportTypes = sportBaseSpace?.sportTypes || {};
  const sportValues = Object.values(sportTypes || {});
  return (
    <FormRow columns={2}>
      <TextField
        disabled={disabled}
        label={inputLabels.name}
        value={sportBaseSpace?.name}
        error={errors?.name}
        name="name"
        onChange={(name) => {
          handleChange(`name`, name);
        }}
      />
      <AsyncSelectField
        disabled={disabled}
        label={inputLabels.type}
        value={sportBaseSpace?.type}
        error={errors?.type}
        name="spaceType"
        onChange={(type: SportsBasesType) => {
          handleChange(`type`, type);
        }}
        getOptionLabel={(option) => option?.name}
        loadOptions={(input, page) => getSportBaseSpaceTypesList(input, page)}
      />
      <AsyncMultiSelect
        disabled={disabled}
        label={inputLabels.sportTypes}
        values={sportValues}
        error={errors?.sportTypes}
        name="sportTypes"
        onChange={(types: SportsBasesType[]) => {
          const filteredSportTypes = {};

          Object.entries(sportTypes).forEach(([key, type]) => {
            const found = types.find((c) => c.id === (type as any)?.id);

            if (found) {
              filteredSportTypes[key] = type;
            }
          });

          types.forEach((type) => {
            if (sportValues.every((sportValue: any) => sportValue.id !== type.id)) {
              filteredSportTypes[generateUniqueString()] = type;
            }
          });

          handleChange(`sportTypes`, filteredSportTypes);
        }}
        getOptionLabel={(option) => option?.name}
        loadOptions={(input, page) => getSportBaseSpaceSportTypesList(input, page)}
      />
      <AsyncSelectField
        disabled={disabled}
        label={inputLabels.technicalSpaceCondition}
        value={sportBaseSpace?.technicalCondition}
        error={errors?.technicalCondition}
        name="technicalCondition"
        onChange={(source: SportsBasesCondition) => {
          handleChange(`technicalCondition`, source);
        }}
        getOptionLabel={(option) => option?.name}
        loadOptions={(input, page) => getSportBaseTechnicalConditionList(input, page)}
      />
    </FormRow>
  );
};

export default SportBaseSpaceGeneralContainer;
