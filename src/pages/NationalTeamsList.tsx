import styled from 'styled-components';
import NationalTeams from '../components/containers/NationalTeams';
import UnconfirmedNationalTeams from '../components/containers/UnconfirmedNationalTeams';
import TablePageLayout from '../components/layouts/TablePageLayout';
import NavigateTabBar from '../components/Tabs/NavigateTabBar';
import { useGetCurrentRoute } from '../utils/hooks';
import { slugs } from '../utils/routes';
import { pageTitles } from '../utils/texts';

const NationalTeamsList = () => {
  const tabs = [
    {
      label: 'Įregistruotos rinktinės',
      slug: slugs.nationalTeams,
    },
    {
      label: 'Laukiama tvirtinti rinktinės',
      slug: slugs.unConfirmedNationalTeams,
    },
  ];

  const containers = {
    [slugs.nationalTeams]: <NationalTeams />,
    [slugs.unConfirmedNationalTeams]: <UnconfirmedNationalTeams />,
  };

  const currentTab = useGetCurrentRoute(tabs);

  return (
    <TablePageLayout title={pageTitles.nationalTeams}>
      <StyledTabBar tabs={tabs} />
      {currentTab && containers[currentTab?.slug as any]}
    </TablePageLayout>
  );
};

export const StyledTabBar = styled(NavigateTabBar)`
  margin: 16px 0px;
`;

export default NationalTeamsList;
