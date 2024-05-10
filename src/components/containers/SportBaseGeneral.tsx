import { FormRow } from '../../styles/CommonStyles';
import { SportBase, SportsBasesCondition, SportsBasesLevel, SportsBasesType } from '../../types';
import {
  getSportBaseLevelsList,
  getSportBaseTechnicalConditionList,
  getSportBaseTypesList,
} from '../../utils/functions';
import { descriptions, formLabels, inputLabels, pageTitles } from '../../utils/texts';
import AsyncSelectField from '../fields/AsyncSelectField';
import TextField from '../fields/TextField';
import UrlField from '../fields/UrlField';
import InnerContainerRow from '../other/InnerContainerRow';
import MapField from '../other/MapField';
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
  const address = sportBase?.address;

  const formattedAddress =
    address?.street && address?.house && address?.city && address?.municipality
      ? `${address.street} ${address.house}, ${address.city}`
      : '';

  return (
    <>
      <InnerContainerRow title={pageTitles.info} description={descriptions.sportBaseGeneral} />
      <SimpleContainer title={formLabels.sportBaseInfo}>
        <FormRow columns={3}>
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
            label={inputLabels.technicalBaseCondition}
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
        <FormRow columns={5}>
          <TextField
            disabled={disabled}
            label={inputLabels.municipality}
            value={sportBase?.address?.municipality}
            error={errors?.address?.municipality}
            name="address.municipality"
            onChange={(name) => {
              handleChange(`address.municipality`, name);
            }}
          />
          <TextField
            disabled={disabled}
            label={inputLabels.town}
            value={sportBase?.address?.city}
            error={errors?.address?.city}
            name="address.city"
            onChange={(name) => {
              handleChange(`address.city`, name);
            }}
          />

          <TextField
            disabled={disabled}
            label={inputLabels.street}
            value={sportBase?.address?.street}
            error={errors?.address?.street}
            name="address.street"
            onChange={(name) => {
              handleChange(`address.street`, name);
            }}
          />
          <TextField
            disabled={disabled}
            label={inputLabels.houseNo}
            value={sportBase?.address?.house}
            error={errors?.address?.house}
            name="address.house"
            onChange={(name) => {
              handleChange(`address.house`, name);
            }}
          />
          <TextField
            disabled={disabled}
            label={inputLabels.apartmentNo}
            value={sportBase?.address?.apartment}
            error={errors?.address?.apartment}
            name="address.apartment"
            onChange={(name) => {
              handleChange(`address.apartment`, name);
            }}
          />
        </FormRow>
        <FormRow columns={1}>
          <MapField
            address={formattedAddress}
            onChange={(address) => {
              const coordinates = address?.features?.[0]?.geometry?.coordinates;
              handleChange('coordinates', { x: coordinates[0], y: coordinates[1] });
            }}
            disabled={disabled}
          />
        </FormRow>
      </SimpleContainer>
    </>
  );
};

export default SportBaseGeneralContainer;
