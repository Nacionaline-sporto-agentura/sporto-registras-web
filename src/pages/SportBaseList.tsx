import styled from 'styled-components';
import Button from '../components/buttons/Button';
import SportBases from '../components/containers/SportBases';
import UnconfirmedSportBases from '../components/containers/UnconfirmedSportBases';
import TablePageLayout from '../components/layouts/TablePageLayout';
import NavigateTabBar from '../components/Tabs/NavigateTabBar';
import { useAppSelector } from '../state/hooks';
import { TableButtonsInnerRow, TableButtonsRow } from '../styles/CommonStyles';
import { AdminRoleType } from '../utils/constants';
import { useGenericTablePageHooks, useGetCurrentRoute } from '../utils/hooks';
import { slugs } from '../utils/routes';
import { buttonsTitles, pageTitles } from '../utils/texts';

const SportBaseList = () => {
  const { navigate } = useGenericTablePageHooks();

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

  const user = useAppSelector((state) => state.user.userData);

  const currentTab = useGetCurrentRoute(tabs);

  return (
    <TablePageLayout title={pageTitles.sportBases}>
      {user.type === AdminRoleType.USER && (
        <TableButtonsRow>
          <TableButtonsInnerRow />
          <Button onClick={() => navigate(slugs.newSportBase)}>
            {buttonsTitles.registerSportBase}
          </Button>
        </TableButtonsRow>
      )}
      <StyledTabBar tabs={tabs} />
      {currentTab && containers[currentTab?.slug as any]}
    </TablePageLayout>
  );
};

export const StyledTabBar = styled(NavigateTabBar)`
  margin: 16px 0px;
`;

export default SportBaseList;
