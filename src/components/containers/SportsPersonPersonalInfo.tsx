import styled from 'styled-components';
import { FormRow, StyledInnerContainerRow } from '../../styles/CommonStyles';
import { SportsPerson } from '../../types';
import { filterAndUpdateTypes, getSportTypesList } from '../../utils/functions';
import { descriptions, formLabels, inputLabels, pageTitles } from '../../utils/texts';
import AsyncMultiSelect from '../fields/AsyncMultiSelect';
import NumericTextField from '../fields/NumericTextField';
import TextField from '../fields/TextField';
import SimpleContainer from '../other/SimpleContainer';

const SportsPersonPersonalInfo = ({
  sportsPerson,
  errors,
  handleChange,
  disabled,
}: {
  disabled: boolean;
  sportsPerson: SportsPerson;
  errors: any;
  handleChange: any;
}) => {
  const sportTypes = sportsPerson?.sportTypes || {};
  const sportValues = Object.values(sportTypes || {});
  return (
    <Container>
      <StyledInnerContainerRow
        title={pageTitles.personalInfo}
        description={descriptions.sportsPersonGeneral}
      />
      <SimpleContainer title={formLabels.userInfo}>
        <FormRow columns={2}>
          <TextField
            disabled={disabled}
            label={inputLabels.firstName}
            value={sportsPerson?.firstName}
            error={errors?.firstName}
            name="firstName"
            onChange={(firstName) => {
              handleChange(`firstName`, firstName);
            }}
          />
          <TextField
            disabled={disabled}
            label={inputLabels.lastName}
            value={sportsPerson?.lastName}
            error={errors?.lastName}
            name="lastName"
            onChange={(lastName) => {
              handleChange(`lastName`, lastName);
            }}
          />
          <NumericTextField
            label={inputLabels.personalCode}
            value={sportsPerson.personalCode}
            disabled={disabled}
            error={errors.personalCode}
            onChange={(personalCode) => handleChange('personalCode', personalCode)}
          />
          <AsyncMultiSelect
            disabled={disabled}
            label={inputLabels.sportPersonSportType}
            values={sportValues}
            error={errors?.sportTypes}
            name="sportTypes"
            onChange={(types) => {
              filterAndUpdateTypes(sportTypes, types, sportValues, (filteredSportTypes) => {
                handleChange('sportTypes', filteredSportTypes);
              });
            }}
            getOptionLabel={(option) => option?.name}
            loadOptions={(input, page) => getSportTypesList(input, page)}
          />
        </FormRow>
        <FormRow columns={1}>
          <TextField
            disabled={disabled}
            label={inputLabels.citizenship}
            value={sportsPerson?.nationality}
            error={errors?.nationality}
            name="nationality"
            onChange={(nationality) => {
              handleChange(`nationality`, nationality);
            }}
          />
        </FormRow>
      </SimpleContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export default SportsPersonPersonalInfo;
