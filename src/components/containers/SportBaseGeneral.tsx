import { FormRow } from '../../styles/CommonStyles';
import { SportBase, SportsBasesCondition, SportsBasesLevel, SportsBasesType } from '../../types';
import {
  getSportBaseLevelsList,
  getSportBaseTechnicalConditionList,
  getSportBaseTypesList,
} from '../../utils/functions';
import { formLabels, inputLabels } from '../../utils/texts';
import AsyncSelectField from '../fields/AsyncSelectField';
import NumericTextField from '../fields/NumericTextField';
import PhotoUploadField from '../fields/PhotoUploadField';
import TextField from '../fields/TextField';
import UrlField from '../fields/UrlField';
import SimpleContainer from '../other/SimpleContainer';

const SportBaseGeneralContainer = ({
  sportBase,
  errors,
  handleChange,
  disabled,
}: {
  disabled: boolean;
  sportBase: SportBase;
  errors: any;
  handleChange: any;
}) => {
  const photos: any = sportBase?.photos || {};

  return (
    <>
      <SimpleContainer title={formLabels.sportBaseInfo}>
        <FormRow columns={2}>
          <TextField
            disabled={disabled}
            label={inputLabels.sportBaseName}
            value={sportBase?.name}
            error={errors?.name}
            name="name"
            onChange={(name) => {
              handleChange(`name`, name);
            }}
          />
          <TextField
            disabled={disabled}
            label={inputLabels.address}
            value={sportBase?.address}
            error={errors?.address}
            name="address"
            onChange={(name) => {
              handleChange(`address`, name);
            }}
          />

          <AsyncSelectField
            disabled={disabled}
            label={inputLabels.type}
            value={sportBase?.type}
            error={errors?.type}
            name="type"
            onChange={(type: SportsBasesType) => {
              handleChange(`type`, type);
            }}
            getOptionLabel={(option) => option?.name}
            loadOptions={(input, page) => getSportBaseTypesList(input, page)}
          />
          <AsyncSelectField
            disabled={disabled}
            label={inputLabels.technicalCondition}
            value={sportBase?.technicalCondition}
            error={errors?.technicalCondition}
            name="technicalCondition"
            onChange={(source: SportsBasesCondition) => {
              handleChange(`technicalCondition`, source);
            }}
            getOptionLabel={(option) => option?.name}
            loadOptions={(input, page) => getSportBaseTechnicalConditionList(input, page)}
          />
        </FormRow>
        <FormRow columns={2}>
          <AsyncSelectField
            disabled={disabled}
            label={inputLabels.level}
            value={sportBase?.level}
            error={errors?.level}
            name="level"
            onChange={(source: SportsBasesLevel) => {
              handleChange(`level`, source);
            }}
            getOptionLabel={(option) => option?.name}
            loadOptions={(input, page) => getSportBaseLevelsList(input, page)}
          />
          <UrlField
            disabled={disabled}
            label={inputLabels.website}
            value={sportBase?.webPage}
            error={errors?.webPage}
            onChange={(endAt) => handleChange(`webPage`, endAt)}
          />
        </FormRow>
        <FormRow columns={2}>
          <NumericTextField
            digitsAfterComma={12}
            disabled={disabled}
            label={inputLabels.coordinateX}
            value={sportBase?.coordinates?.x || ''}
            error={errors?.coordinates?.x}
            name="coordinates.x"
            onChange={(coordinateX) => {
              handleChange(`coordinates.x`, coordinateX);
            }}
          />
          <NumericTextField
            digitsAfterComma={12}
            disabled={disabled}
            label={inputLabels.coordinateY}
            value={sportBase?.coordinates?.y || ''}
            error={errors?.coordinates?.y}
            name="coordinates.y"
            onChange={(coordinateY) => {
              handleChange(`coordinates.y`, coordinateY);
            }}
          />
        </FormRow>
      </SimpleContainer>
      <SimpleContainer>
        <PhotoUploadField
          disabled={disabled}
          name={'photos'}
          error={errors?.photos}
          photos={photos}
          onChange={handleChange}
        />
      </SimpleContainer>
    </>
  );
};

export default SportBaseGeneralContainer;
