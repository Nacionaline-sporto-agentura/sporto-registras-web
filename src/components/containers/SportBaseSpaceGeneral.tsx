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

const SportBaseSpaceGeneralContainer = ({
  sportBaseTypeId,
  sportBaseSpace,
  errors,
  handleChange,
  setCounter,
  counter,
}: {
  sportBaseTypeId: number;
  sportBaseSpace: SportBaseSpace;
  errors: any;
  handleChange: any;
  counter: number;
  setCounter: (num: number) => void;
}) => {
  const sportTypes = sportBaseSpace?.sportTypes || {};
  const sportValues = Object.values(sportTypes || {});
  return (
    <FormRow columns={2}>
      <TextField
        label={inputLabels.name}
        value={sportBaseSpace?.name}
        error={errors?.name}
        name="name"
        onChange={(name) => {
          handleChange(`name`, name);
        }}
      />
      <AsyncSelectField
        label={inputLabels.type}
        value={sportBaseSpace?.type}
        error={errors?.type}
        name="spaceType"
        onChange={(type: SportsBasesType) => {
          handleChange(`type`, type);
        }}
        dependsOnTheValue={sportBaseTypeId}
        getOptionLabel={(option) => option?.name}
        loadOptions={(input, page, id) => getSportBaseSpaceTypesList(input, page, id)}
      />
      <AsyncMultiSelect
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
              filteredSportTypes[counter] = type;
              setCounter(counter + 1);
            }
          });

          handleChange(`sportTypes`, filteredSportTypes);
        }}
        getOptionLabel={(option) => option?.name}
        loadOptions={(input, page) => getSportBaseSpaceSportTypesList(input, page)}
      />
      <AsyncSelectField
        label={inputLabels.technicalCondition}
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
