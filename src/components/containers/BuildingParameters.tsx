import { useMutation } from 'react-query';
import { FormRow } from '../../styles/CommonStyles';
import { SportBaseSpace, SportsBase } from '../../types';
import api from '../../utils/api';
import { getRcObjects, handleErrorToastFromServer } from '../../utils/functions';
import { inputLabels } from '../../utils/texts';
import AsyncSelectField from '../fields/AsyncSelectField';
import NumericTextField from '../fields/NumericTextField';
import TextField from '../fields/TextField';

const BuildingParametersContainer = ({
  sportBaseSpace,
  sportBase,
  errors,
  handleChange,
  disabled,
}: {
  sportBaseSpace: SportBaseSpace;
  sportBase: SportsBase;
  errors: any;
  handleChange: any;
  disabled: boolean;
}) => {
  const currentYearPlaceholder = new Date().getFullYear().toString();

  const buildingMutation = useMutation(
    async (building: any) =>
      api.getRcObjectInfo(
        building.registrationNumber,
        building.registrationServiceNumber,
        building.uniqueNumber,
      ),
    {
      onError: ({ response }) => {
        handleErrorToastFromServer(response);
      },
      onSuccess: (data) => {
        handleChange(`buildingArea`, data?.buildingArea?.value);
        handleChange(`constructionDate`, data?.constructionDate?.value);
        handleChange(`latestRenovationDate`, data?.latestRenovationDate?.value);
        handleChange(`energyClass`, data?.energyClass?.value);
      },
    },
  );

  return (
    <>
      <FormRow columns={2}>
        <AsyncSelectField
          disabled={disabled || !sportBase.address?.house?.plot_or_building_number}
          label={inputLabels.buildingNumber}
          value={sportBaseSpace?.buildingNumber}
          error={errors?.buildingNumber}
          name="buildingNumber"
          onChange={(building) => {
            handleChange(`buildingNumber`, building.uniqueNumber);
            handleChange(`buildingPurpose`, building.buildingPurpose);
            buildingMutation.mutateAsync(building);
          }}
          getInputLabel={(option) => option}
          getOptionLabel={(option) => option?.uniqueNumber}
          getOptionDescription={(option) => option?.buildingPurpose}
          loadOptions={(input, page) =>
            getRcObjects(input, page, {
              streetCode: sportBase.address?.street?.code,
              plotOrBuildingNumber: sportBase.address?.house?.plot_or_building_number,
              roomNumber: sportBase.address?.apartment?.room_number,
            })
          }
        />
        <NumericTextField
          loading={buildingMutation.isLoading}
          label={inputLabels.buildingArea}
          disabled={true}
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
          loading={buildingMutation.isLoading}
          label={inputLabels.energyClass}
          value={sportBaseSpace?.energyClass}
          name="energyClass"
          disabled={true}
        />
      </FormRow>
      <FormRow columns={1}>
        <TextField
          loading={buildingMutation.isLoading}
          label={inputLabels.buildingPurpose}
          value={sportBaseSpace?.buildingPurpose}
          name="buildingPurpose"
          disabled={true}
        />
      </FormRow>
      <FormRow columns={2}>
        <TextField
          loading={buildingMutation.isLoading}
          disabled={true}
          label={inputLabels.year}
          value={sportBaseSpace?.constructionDate}
          name="constructionDate"
        />

        <TextField
          loading={buildingMutation.isLoading}
          disabled={true}
          placeholder={currentYearPlaceholder}
          name="latestRenovationDate"
          label={inputLabels.latestRenovationDate}
          value={sportBaseSpace?.latestRenovationDate}
        />
      </FormRow>
    </>
  );
};

export default BuildingParametersContainer;
