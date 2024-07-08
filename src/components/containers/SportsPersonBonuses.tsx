import styled from 'styled-components';
import { StyledInnerContainerRow } from '../../styles/CommonStyles';
import { Bonus } from '../../types';
import { formatDate, getBonusResultLabel } from '../../utils/functions';
import { bonusTypeLabels, descriptions, inputLabels, pageTitles } from '../../utils/texts';
import MainTable from '../tables/MainTable';

const labels = {
  date: { label: inputLabels.appointmentDate, show: true },
  amount: { label: inputLabels.bonusAmount, show: true },
  result: { label: inputLabels.result, show: true },
  type: { label: inputLabels.type, show: true },
};

const mapData = (bonuses: Bonus[]) => {
  return bonuses.map((item) => {
    return {
      type: bonusTypeLabels[item.type],
      result: getBonusResultLabel(item?.result),
      amount: item.amount,
      date: formatDate(item?.date),
    };
  });
};

const SportPersonBonuses = ({ bonuses = [] }: { bonuses: Bonus[] }) => {
  return (
    <Container>
      <StyledInnerContainerRow title={pageTitles.bonuses} description={descriptions.bonuses} />
      <MainTable
        notFoundInfo={{ text: 'Nėra premijų' }}
        isFilterApplied={false}
        data={{ data: mapData(bonuses) }}
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

export default SportPersonBonuses;
