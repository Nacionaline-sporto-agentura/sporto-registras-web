import styled from 'styled-components';
import { FormRow, StyledInnerContainerRow } from '../../styles/CommonStyles';
import { NationalTeam } from '../../types';
import {
  getNationalTeamAgeGroups,
  getNationalTeamGenders,
  getSportTypesList,
} from '../../utils/functions';
import { descriptions, inputLabels, pageTitles } from '../../utils/texts';
import AsyncSelectField from '../fields/AsyncSelectField';
import DateField from '../fields/DateField';
import TextField from '../fields/TextField';
import SimpleContainer from '../other/SimpleContainer';

const NationalTeamGeneral = ({
  nationalTeam,
  errors,
  handleChange,
  disabled,
}: {
  disabled: boolean;
  nationalTeam: NationalTeam;
  errors: any;
  handleChange: any;
}) => {
  return (
    <Container>
      <StyledInnerContainerRow title={pageTitles.teamInfo} description={descriptions.teamInfo} />
      <SimpleContainer>
        <FormRow columns={2}>
          <TextField
            disabled={disabled}
            label={inputLabels.nationalTeamName}
            value={nationalTeam?.name}
            error={errors?.name}
            name="name"
            onChange={(name) => {
              handleChange(`name`, name);
            }}
          />
          <AsyncSelectField
            disabled={disabled}
            label={inputLabels.ageGroup}
            value={nationalTeam.ageGroup}
            error={errors?.ageGroup}
            name="ageGroup"
            onChange={(ageGroup) => {
              handleChange('ageGroup', ageGroup);
            }}
            getOptionLabel={(option) => option?.name}
            loadOptions={(input, page) => getNationalTeamAgeGroups(input, page)}
          />

          <AsyncSelectField
            disabled={disabled}
            label={inputLabels.sportPersonSportType}
            value={nationalTeam.sportType}
            error={errors?.sportTypes}
            name="sportTypes"
            onChange={(sportType) => {
              handleChange('sportType', sportType);
            }}
            getOptionLabel={(option) => option?.name}
            loadOptions={(input, page) => getSportTypesList(input, page)}
          />

          <AsyncSelectField
            disabled={disabled}
            label={inputLabels.nationalTeamGender}
            value={nationalTeam.gender}
            error={errors?.gender}
            name="gender"
            onChange={(gender) => {
              handleChange('gender', gender);
            }}
            getOptionLabel={(option) => option?.name}
            loadOptions={(input, page) => getNationalTeamGenders(input, page)}
          />

          <DateField
            disabled={disabled}
            name={'startAt'}
            label={inputLabels.startAt}
            value={nationalTeam?.startAt}
            error={errors?.startAt}
            onChange={(startAt) => handleChange(`startAt`, startAt)}
          />
          <DateField
            disabled={disabled}
            name={'endAt'}
            label={inputLabels.endAt}
            value={nationalTeam?.endAt}
            minDate={nationalTeam?.startAt}
            error={errors?.endAt}
            onChange={(endAt) => handleChange(`endAt`, endAt)}
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

export default NationalTeamGeneral;
