import styled from 'styled-components';
import { FormRow, StyledInnerContainerRow } from '../../styles/CommonStyles';
import { getCompetitionTypesList } from '../../utils/functions';
import { descriptions, inputLabels, pageTitles } from '../../utils/texts';
import AsyncSelectField from '../fields/AsyncSelectField';
import DragAndDropUploadField from '../fields/DragAndDropUploadField';
import NumericTextField from '../fields/NumericTextField';
import TextField from '../fields/TextField';
import UrlField from '../fields/UrlField';
import SimpleContainer from '../other/SimpleContainer';

const CompetitionInfo = ({ result, disabled, errors, handleChange }) => {
  return (
    <Container>
      <StyledInnerContainerRow
        title={pageTitles.competitionInfo}
        description={descriptions.competitionInfo}
      />
      <SimpleContainer>
        <FormRow columns={2}>
          <TextField
            disabled={disabled}
            label={inputLabels.competitionName}
            value={result?.name}
            error={errors?.name}
            name="name"
            onChange={(name) => {
              handleChange(`name`, name);
            }}
          />
          <NumericTextField
            disabled={disabled}
            label={inputLabels.year}
            value={result?.year}
            error={errors?.year}
            name="year"
            onChange={(year) => {
              if (year.length > 4) return;

              handleChange(`year`, year);
            }}
          />
          <AsyncSelectField
            disabled={disabled}
            label={inputLabels.competitionType}
            value={result.competitionType}
            error={errors?.competitionType}
            name="competitionTypes"
            getOptionLabel={(option) => option?.name}
            loadOptions={(input, page) => getCompetitionTypesList(input, page)}
            onChange={(competitionType) => {
              handleChange(`competitionType`, competitionType);
            }}
          />
          <UrlField
            disabled={disabled}
            label={inputLabels.websiteToProtocols}
            value={result?.website}
            error={errors?.website}
            onChange={(endAt) => handleChange(`website`, endAt)}
          />
        </FormRow>
        <FormRow columns={1}>
          <DragAndDropUploadField
            disabled={disabled}
            onChange={(files: any) => handleChange('protocolDocument', files[0])}
            multiple={false}
            files={[result?.protocolDocument]}
            label={descriptions.protocolDocument}
            error={errors?.protocolDocument}
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

export default CompetitionInfo;
