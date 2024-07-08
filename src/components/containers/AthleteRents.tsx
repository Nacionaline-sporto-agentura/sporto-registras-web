import styled from 'styled-components';
import { StyledInnerContainerRow } from '../../styles/CommonStyles';
import { Rent } from '../../types';
import { getBonusResultLabel } from '../../utils/functions';
import { descriptions, inputLabels, pageTitles, scholarshipTypeLabel } from '../../utils/texts';
import MainTable from '../tables/MainTable';

const labels = {
  date: { label: inputLabels.sportType, show: true },
  amount: { label: inputLabels.rentAmount, show: true },
  result: { label: inputLabels.result, show: true },
  status: { label: inputLabels.status, show: true },
};

const mapData = (rent: Rent[]) => {
  return rent.map((item) => {
    return {
      date: item?.date,
      ageGroup: `${item?.amount} ${item?.unit?.name}`,
      result: getBonusResultLabel(item?.result),
      status: scholarshipTypeLabel[item.status],
    };
  });
};

const AthleteRents = ({ rents = [] }: { rents: Rent[] }) => {
  return (
    <Container>
      <StyledInnerContainerRow title={pageTitles.rents} description={descriptions.nationalTeams} />
      <MainTable
        notFoundInfo={{ text: 'Nėra rentų' }}
        isFilterApplied={false}
        data={{ data: mapData(rents) }}
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

export default AthleteRents;
