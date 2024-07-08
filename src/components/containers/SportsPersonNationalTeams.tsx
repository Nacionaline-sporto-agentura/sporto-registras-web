import styled from 'styled-components';
import { StyledInnerContainerRow } from '../../styles/CommonStyles';
import { NationalTeam } from '../../types';
import { formatDate } from '../../utils/functions';
import { descriptions, inputLabels, pageTitles } from '../../utils/texts';
import MainTable from '../tables/MainTable';

const labels = {
  sportType: { label: inputLabels.sportType, show: true },
  ageGroup: { label: inputLabels.ageGroup, show: true },
  gender: { label: inputLabels.gender, show: true },
  startAt: { label: inputLabels.startAt, show: true },
  endAt: { label: inputLabels.endAt, show: true },
};

const mapData = (nationalTeams: NationalTeam[]) => {
  return nationalTeams.map((item) => {
    return {
      sportType: item?.sportType?.name,
      ageGroup: item?.ageGroup?.name,
      gender: item?.gender?.name,
      startAt: formatDate(item?.startAt),
      endAt: formatDate(item.endAt),
    };
  });
};

const SportsPersonNationalTeams = ({ nationalTeams = [] }: { nationalTeams: NationalTeam[] }) => {
  return (
    <Container>
      <StyledInnerContainerRow
        title={pageTitles.nationalTeams}
        description={descriptions.nationalTeams}
      />
      <MainTable
        notFoundInfo={{ text: 'Nėra nacionalinių rinktinių' }}
        isFilterApplied={false}
        data={{ data: mapData(nationalTeams) }}
        hidePagination={true}
        columns={labels}
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

export default SportsPersonNationalTeams;
