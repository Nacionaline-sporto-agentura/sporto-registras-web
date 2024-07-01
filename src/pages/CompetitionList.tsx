import styled from 'styled-components';
import Competitions from '../components/containers/Competitions';
import UnconfirmedCompetitions from '../components/containers/UnconfirmedCompetitions';
import TablePageLayout from '../components/layouts/TablePageLayout';
import NavigateTabBar from '../components/Tabs/NavigateTabBar';
import { useGetCurrentRoute } from '../utils/hooks';
import { slugs } from '../utils/routes';
import { pageTitles } from '../utils/texts';

const CompetitionList = () => {
  const tabs = [
    {
      label: 'Įregistruoti rezultatai',
      slug: slugs.results,
    },
    {
      label: 'Laukiama tvirtinti rezultatai',
      slug: slugs.unconfirmedResults,
    },
  ];

  const containers = {
    [slugs.results]: <Competitions />,
    [slugs.unconfirmedResults]: <UnconfirmedCompetitions />,
  };

  const currentTab = useGetCurrentRoute(tabs);

  return (
    <TablePageLayout title={pageTitles.results}>
      <StyledTabBar tabs={tabs} />
      {currentTab && containers[currentTab?.slug || '']}
    </TablePageLayout>
  );
};

export const StyledTabBar = styled(NavigateTabBar)`
  margin: 16px 0px;
`;

export default CompetitionList;
