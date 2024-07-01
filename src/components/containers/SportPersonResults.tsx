import styled from 'styled-components';
import { StyledInnerContainerRow } from '../../styles/CommonStyles';
import { Result } from '../../types';
import { ResultTypeTypes } from '../../utils/constants';
import { formatDate } from '../../utils/functions';
import { descriptions, inputLabels, matchTypeLabels, pageTitles } from '../../utils/texts';
import MainTable from '../tables/MainTable';

const resultsLabels = {
  name: { label: inputLabels.competitionName, show: true },
  sportType: { label: inputLabels.sportType, show: true },
  result: { label: inputLabels.place, show: true },
  participantsNumber: { label: inputLabels.membersNo, show: true },
  matchType: { label: inputLabels.matchType, show: true },
  date: { label: inputLabels.date, show: true },
};

const mapData = (results: Result[]) => {
  return results.map((item) => {
    const resultType = item?.resultType?.type;

    const result =
      resultType === ResultTypeTypes.RANGE
        ? `${item?.result?.value?.from} - ${item?.result?.value?.to}`
        : resultType === ResultTypeTypes.NUMBER
        ? item?.result?.value
        : '-';

    return {
      name: item?.competition?.name,
      result: result,
      sportType: item?.sportType?.name,
      participantsNumber: item?.participantsNumber,
      matchType: item?.matchType ? matchTypeLabels[item?.matchType] : '-',
      date: formatDate(item?.createdAt),
    };
  });
};

const SportPersonResultsContainer = ({ results = [] }: { results: Result[] }) => {
  return (
    <Container>
      <StyledInnerContainerRow title={pageTitles.results} description={descriptions.results} />
      <MainTable
        notFoundInfo={{ text: 'Nėra rezultatų' }}
        isFilterApplied={false}
        data={{ data: mapData(results) }}
        hidePagination={true}
        columns={resultsLabels}
      />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export default SportPersonResultsContainer;
