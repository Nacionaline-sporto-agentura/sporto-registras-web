import { FormRow } from '../../styles/CommonStyles';
import { SportsBase } from '../../types';
import { AreaUnits } from '../../utils/constants';
import {
  areUnitLabels,
  descriptions,
  formLabels,
  inputLabels,
  pageTitles,
} from '../../utils/texts';
import CheckBox from '../fields/CheckBox';
import DragAndDropUploadField from '../fields/DragAndDropUploadField';
import NumericTextField from '../fields/NumericTextField';
import SelectField from '../fields/SelectField';
import TextField from '../fields/TextField';
import { generateUniqueString } from '../fields/utils/function';
import InnerContainerRow from '../other/InnerContainerRow';
import SimpleContainer from '../other/SimpleContainer';

const SpecificationContainer = ({
  sportBase,
  errors,
  handleChange,
  disabled,
}: {
  sportBase: SportsBase;
  disabled: boolean;
  errors: any;
  handleChange: any;
}) => {
  const plans = sportBase?.plans || {};
  const planValues = Object.values(plans);

  return (
    <>
      <InnerContainerRow
        title={pageTitles.sportBaseSpecification}
        description={descriptions.sportBaseSpecification}
      />
      <SimpleContainer title={formLabels.technicalSportBaseParameters}>
        <FormRow columns={3}>
          <TextField
            disabled={true}
            label={inputLabels.plotNumber}
            value={sportBase?.plotNumber}
            error={errors?.plotNumber}
            name="plotNumber"
            onChange={(plotNumber) => {
              handleChange(`plotNumber`, plotNumber);
            }}
          />
          <NumericTextField
            disabled={true}
            label={inputLabels.plotArea}
            value={sportBase?.plotArea}
            digitsAfterComma={4}
            error={errors?.plotArea}
            name="plotArea"
            onChange={(plotArea) => {
              handleChange(`plotArea`, plotArea);
            }}
          />
          <SelectField
            disabled={true}
            label={inputLabels.areaUnits}
            error={errors?.areaUnits}
            options={Object.values(AreaUnits)}
            value={sportBase.areaUnits}
            onChange={(units) => handleChange(`areaUnits`, units)}
            getOptionLabel={(option) => areUnitLabels[option]}
          />
        </FormRow>
        <FormRow columns={1}>
          <NumericTextField
            disabled={true}
            label={inputLabels.builtPlotArea}
            value={sportBase?.builtPlotArea}
            digitsAfterComma={3}
            error={errors?.builtPlotArea}
            name="builtPlotArea"
            onChange={(builtPlotArea) => {
              handleChange(`builtPlotArea`, builtPlotArea);
            }}
          />
        </FormRow>
        <FormRow columns={2}>
          <NumericTextField
            disabled={disabled}
            label={inputLabels.parkingPlaces}
            value={sportBase?.parkingPlaces}
            error={errors?.parkingPlaces}
            name="parkingPlaces"
            onChange={(parkingPlaces) => {
              handleChange(`parkingPlaces`, parkingPlaces);
            }}
          />
          <NumericTextField
            disabled={disabled}
            label={inputLabels.methodicalClasses}
            value={sportBase?.methodicalClasses}
            error={errors?.methodicalClasses}
            name="methodicalClasses"
            onChange={(methodicalClasses) => {
              handleChange(`methodicalClasses`, methodicalClasses);
            }}
          />
          <NumericTextField
            disabled={disabled}
            label={inputLabels.saunas}
            value={sportBase?.saunas}
            error={errors?.saunas}
            name="saunas"
            onChange={(saunas) => {
              handleChange(`saunas`, saunas);
            }}
          />
        </FormRow>
        <FormRow columns={1}>
          <CheckBox
            disabled={disabled}
            label={descriptions.publicWifi}
            value={sportBase?.publicWifi}
            onChange={(publicWifi) => handleChange('publicWifi', publicWifi)}
          />
          <DragAndDropUploadField
            disabled={disabled}
            onChange={(value: any) => {
              const filteredPlans = {};

              Object.entries(plans).forEach(([key, type]) => {
                const found = value.find((c) => c.url === (type as any)?.url);

                if (found) {
                  filteredPlans[key] = found;
                }
              });

              value.forEach((type) => {
                if (planValues.every((sportValue: any) => sportValue.url !== type.url)) {
                  filteredPlans[generateUniqueString()] = type;
                }
              });
              handleChange('plans', filteredPlans);
            }}
            files={planValues}
            error={errors?.plans}
            label={descriptions.plans}
          />
        </FormRow>
      </SimpleContainer>
    </>
  );
};

export default SpecificationContainer;
