import { FormRow } from '../../styles/CommonStyles';
import { SportBase } from '../../types';
import { descriptions, formLabels, inputLabels } from '../../utils/texts';
import CheckBox from '../fields/CheckBox';
import DragAndDropUploadField from '../fields/DragAndDropUploadField';
import NumericTextField from '../fields/NumericTextField';
import TextField from '../fields/TextField';
import SimpleContainer from '../other/SimpleContainer';

const SpecificationContainer = ({
  sportBase,
  errors,
  handleChange,
  setCounter,
  counter,
  disabled,
}: {
  sportBase: SportBase;
  disabled: boolean;
  errors: any;
  handleChange: any;
  setCounter: any;
  counter: any;
}) => {
  const plans = sportBase?.plans || {};
  const planValues = Object.values(plans);

  return (
    <SimpleContainer title={formLabels.technicalSportBaseParameters}>
      <FormRow columns={2}>
        <TextField
          disabled={disabled}
          label={inputLabels.plotNumber}
          value={sportBase?.plotNumber}
          error={errors?.plotNumber}
          name="plotNumber"
          onChange={(plotNumber) => {
            handleChange(`plotNumber`, plotNumber);
          }}
        />
        <NumericTextField
          disabled={disabled}
          label={inputLabels.plotArea}
          value={sportBase?.plotArea}
          digitsAfterComma={3}
          error={errors?.plotArea}
          name="plotArea"
          onChange={(plotArea) => {
            handleChange(`plotArea`, plotArea);
          }}
        />
      </FormRow>
      <FormRow columns={1}>
        <NumericTextField
          disabled={disabled}
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
          label={inputLabels.dressingRooms}
          value={sportBase?.dressingRooms}
          error={errors?.dressingRooms}
          name="dressingRooms"
          onChange={(dressingRooms) => {
            handleChange(`dressingRooms`, dressingRooms);
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
      <FormRow>
        <NumericTextField
          disabled={disabled}
          label={inputLabels.diningPlaces}
          value={sportBase?.diningPlaces}
          error={errors?.diningPlaces}
          name="diningPlaces"
          onChange={(diningPlaces) => {
            handleChange(`diningPlaces`, diningPlaces);
          }}
        />
        <NumericTextField
          disabled={disabled}
          label={inputLabels.accommodationPlaces}
          value={sportBase?.accommodationPlaces}
          error={errors?.accommodationPlaces}
          name="accommodationPlaces"
          onChange={(accommodationPlaces) => {
            handleChange(`accommodationPlaces`, accommodationPlaces);
          }}
        />
        <NumericTextField
          disabled={disabled}
          label={inputLabels.audienceSeats}
          value={sportBase?.audienceSeats}
          error={errors?.audienceSeats}
          name="audienceSeats"
          onChange={(audienceSeats) => {
            handleChange(`audienceSeats`, audienceSeats);
          }}
        />
      </FormRow>
      <FormRow columns={1}>
        <CheckBox
          disabled={disabled}
          label={descriptions.disabledAccessible}
          value={sportBase?.disabledAccessible}
          onChange={(disabledAccessible) => handleChange('disabledAccessible', disabledAccessible)}
        />
        <CheckBox
          disabled={disabled}
          label={descriptions.blindAccessible}
          value={sportBase?.blindAccessible}
          onChange={(blindAccessible) => handleChange('blindAccessible', blindAccessible)}
        />
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
            let tempCounter = counter;

            Object.entries(plans).forEach(([key, type]) => {
              const found = value.find((c) => c.url === (type as any)?.url);

              if (found) {
                filteredPlans[key] = found;
              }
            });

            value.forEach((type) => {
              if (planValues.every((sportValue: any) => sportValue.url !== type.url)) {
                filteredPlans[tempCounter] = type;
                tempCounter++;
              }
            });
            setCounter(tempCounter);
            handleChange('plans', filteredPlans);
          }}
          files={planValues}
          error={errors?.plans}
          label={descriptions.plans}
        />
      </FormRow>
    </SimpleContainer>
  );
};

export default SpecificationContainer;
