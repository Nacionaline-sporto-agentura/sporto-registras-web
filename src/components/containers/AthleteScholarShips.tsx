import styled from 'styled-components';
import { StyledInnerContainerRow } from '../../styles/CommonStyles';
import { ScholarShip } from '../../types';
import { formatDate, getBonusResultLabel } from '../../utils/functions';
import { descriptions, inputLabels, pageTitles, scholarshipTypeLabel } from '../../utils/texts';
import MainTable from '../tables/MainTable';

const labels = {
  date: { label: inputLabels.appointmentDate, show: true },
  amount: { label: inputLabels.scholarshipAmountShort, show: true },
  result: { label: inputLabels.result, show: true },
  status: { label: inputLabels.status, show: true },
};

const mapData = (scholarship: ScholarShip[]) => {
  return scholarship.map((item) => {
    return {
      date: formatDate(item?.date),
      amount: `${item?.amount}`,
      result: getBonusResultLabel(item?.result),
      status: scholarshipTypeLabel[item.status],
    };
  });
};

const AthleteScholarShips = ({ scholarship = [] }: { scholarship: ScholarShip[] }) => {
  return (
    <Container>
      <StyledInnerContainerRow
        title={pageTitles.scholarships}
        description={descriptions.nationalTeams}
      />
      <MainTable
        notFoundInfo={{ text: 'Nėra stipendijų' }}
        isFilterApplied={false}
        data={{ data: mapData(scholarship) }}
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

export default AthleteScholarShips;
