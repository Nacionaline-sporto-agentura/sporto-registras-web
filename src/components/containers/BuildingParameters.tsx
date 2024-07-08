import { useQuery } from 'react-query';
import { FormRow } from '../../styles/CommonStyles';
import { SportBaseSpace } from '../../types';
import api from '../../utils/api';
import { getSportBaseSpaceEnergyClassList } from '../../utils/functions';
import { descriptions, inputLabels } from '../../utils/texts';
import AsyncSelectField from '../fields/AsyncSelectField';
import DateField from '../fields/DateField';
import DragAndDropUploadField from '../fields/DragAndDropUploadField';
import NumericTextField from '../fields/NumericTextField';
import TextField from '../fields/TextField';
import TreeSelectField from '../fields/TreeSelect';

const BuildingParametersContainer = ({
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
  const { data: buildingPurposesOptions = [] } = useQuery(['buildingPurposesOptions'], async () =>
    api.getSportBaseSpaceBuildingPurposesTree(),
  );

  return (
    <>
      <FormRow columns={2}>
        <TextField
          label={inputLabels.buildingNumber}
          value={sportBaseSpace?.buildingNumber}
          error={errors?.buildingNumber}
          name="buildingNumber"
          disabled={disabled}
          onChange={(buildingNumber) => {
            handleChange(`buildingNumber`, buildingNumber);
          }}
        />
        <NumericTextField
          label={inputLabels.buildingArea}
          disabled={disabled}
          value={sportBaseSpace?.buildingArea}
          digitsAfterComma={3}
          error={errors?.buildingArea}
          name="buildingArea"
          onChange={(buildingArea) => {
            handleChange(`buildingArea`, buildingArea);
          }}
        />
      </FormRow>
      <FormRow columns={1}>
        <AsyncSelectField
          disabled={disabled}
          label={inputLabels.energyClass}
          value={sportBaseSpace?.energyClass}
          error={errors?.energyClass}
          name="energyClass"
          onChange={(energyClass) => {
            handleChange(`energyClass`, energyClass);
          }}
          getOptionLabel={(option) => option?.name}
          loadOptions={(input, page) => getSportBaseSpaceEnergyClassList(input, page)}
        />
      </FormRow>
      <FormRow columns={1}>
        <TreeSelectField
          disabled={disabled}
          label={inputLabels.buildingPurpose}
          name={`buildingPurpose`}
          error={errors?.buildingPurpose}
          showError={false}
          options={buildingPurposesOptions}
          value={sportBaseSpace?.buildingPurpose?.id}
          onChange={(value) => {
            handleChange('buildingPurpose', value);
          }}
        />
      </FormRow>
      <FormRow columns={2}>
        <DateField
          disabled={disabled}
          name={'constructionDate'}
          label={inputLabels.constructionDate}
          value={sportBaseSpace?.constructionDate}
          maxDate={sportBaseSpace?.latestRenovationDate}
          error={errors?.constructionDate}
          onChange={(constructionDate) => handleChange(`constructionDate`, constructionDate)}
        />
        <DateField
          disabled={disabled}
          name={'latestRenovationDate'}
          label={inputLabels.latestRenovationDate}
          value={sportBaseSpace?.latestRenovationDate}
          minDate={sportBaseSpace?.constructionDate}
          error={errors?.latestRenovationDate}
          onChange={(endAt) => handleChange(`latestRenovationDate`, endAt)}
        />
      </FormRow>
    </>
  );
};

export default BuildingParametersContainer;
