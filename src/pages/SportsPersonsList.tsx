import styled from 'styled-components';
import SportsPersons from '../components/containers/SportsPersons';
import UnconfirmedSportsPersons from '../components/containers/UnconfirmedSportsPersons';
import TablePageLayout from '../components/layouts/TablePageLayout';
import NavigateTabBar from '../components/Tabs/NavigateTabBar';
import { useGetCurrentRoute } from '../utils/hooks';
import { slugs } from '../utils/routes';
import { pageTitles } from '../utils/texts';

const SportsPersonsList = () => {
  const tabs = [
    {
      label: 'Sporto asmenys',
      slug: slugs.sportsPersons,
    },
    {
      label: 'Nepatvirtinti sporto asmenys',
      slug: slugs.unConfirmedSportsPersons,
    },
  ];

  const containers = {
    [slugs.sportsPersons]: <SportsPersons />,
    [slugs.unConfirmedSportsPersons]: <UnconfirmedSportsPersons />,
  };

  const currentTab = useGetCurrentRoute(tabs);

  return (
    <TablePageLayout title={pageTitles.sportsPersons}>
      <StyledTabBar tabs={tabs} />
      {currentTab && containers[currentTab?.slug as any]}
    </TablePageLayout>
  );
};

export const StyledTabBar = styled(NavigateTabBar)`
  margin: 16px 0px;
`;

export default SportsPersonsList;
