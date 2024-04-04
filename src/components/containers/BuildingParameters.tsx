import { FormRow } from '../../styles/CommonStyles';
import { SportBaseSpace, SportsBasesType } from '../../types';
import { getSportBaseSpaceBuildingTypesList } from '../../utils/functions';
import { descriptions, inputLabels } from '../../utils/texts';
import AsyncSelectField from '../fields/AsyncSelectField';
import DateField from '../fields/DateField';
import DragAndDropUploadField from '../fields/DragAndDropUploadField';
import NumericTextField from '../fields/NumericTextField';
import TextField from '../fields/TextField';

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
        <TextField
          disabled={disabled}
          label={inputLabels.energyClass}
          value={sportBaseSpace?.energyClass}
          error={errors?.energyClass}
          name="energyClass"
          onChange={(energyClass) => {
            handleChange(`energyClass`, energyClass);
          }}
        />
        <DragAndDropUploadField
          disabled={disabled}
          onChange={(files: any) => handleChange('energyClassCertificate', files[0])}
          multiple={false}
          files={[sportBaseSpace?.energyClassCertificate]}
          label={descriptions.energyClassCertificate}
          error={errors?.energyClassCertificate}
        />
      </FormRow>
      <FormRow columns={2}>
        <AsyncSelectField
          disabled={disabled}
          label={inputLabels.buildingType}
          value={sportBaseSpace?.buildingType}
          error={errors?.buildingType}
          name="type"
          onChange={(type: SportsBasesType) => {
            handleChange(`buildingType`, type);
          }}
          getOptionLabel={(option) => option?.name}
          loadOptions={(input, page) => getSportBaseSpaceBuildingTypesList(input, page)}
        />
        <TextField
          label={inputLabels.buildingPurpose}
          value={sportBaseSpace?.buildingPurpose}
          error={errors?.buildingPurpose}
          name="buildingPurpose"
          onChange={(buildingPurpose) => {
            handleChange(`buildingPurpose`, buildingPurpose);
          }}
        />

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
