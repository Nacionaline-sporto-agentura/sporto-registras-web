import styled from 'styled-components';
import SportBases from '../components/containers/SportBases';
import UnconfirmedSportBases from '../components/containers/UnconfirmedSportBases';
import TablePageLayout from '../components/layouts/TablePageLayout';
import NavigateTabBar from '../components/Tabs/NavigateTabBar';
import { useGetCurrentRoute } from '../utils/hooks';
import { slugs } from '../utils/routes';
import { pageTitles } from '../utils/texts';

const SportBaseList = () => {
  const tabs = [
    {
      label: 'Sporto infrastruktūra',
      slug: slugs.sportBases,
    },
    {
      label: 'Nepatvirtinta sporto infrastruktūra',
      slug: slugs.unConfirmedSportBases,
    },
  ];

  const containers = {
    [slugs.sportBases]: <SportBases />,
    [slugs.unConfirmedSportBases]: <UnconfirmedSportBases />,
  };

  const currentTab = useGetCurrentRoute(tabs);

  return (
    <TablePageLayout title={pageTitles.sportBases}>
      <StyledTabBar tabs={tabs} />
      {currentTab && containers[currentTab?.slug as any]}
    </TablePageLayout>
  );
};

export const StyledTabBar = styled(NavigateTabBar)`
  margin: 16px 0px;
`;

export default SportBaseList;
