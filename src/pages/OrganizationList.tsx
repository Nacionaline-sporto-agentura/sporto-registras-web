import styled from 'styled-components';
import Organizations from '../components/containers/OrganizationList';
import UnconfirmedOrganizations from '../components/containers/UnconfirmedOrganizations';
import TablePageLayout from '../components/layouts/TablePageLayout';
import NavigateTabBar from '../components/Tabs/NavigateTabBar';
import { useGetCurrentRoute } from '../utils/hooks';
import { slugs } from '../utils/routes';
import { pageTitles } from '../utils/texts';

const OrganizationList = () => {
  const tabs = [
    {
      label: 'Organizacijos',
      slug: slugs.organizations,
    },
    {
      label: 'Nepatvirtintos organizacijos',
      slug: slugs.unConfirmedOrganizations,
    },
  ];

  const containers = {
    [slugs.organizations]: <Organizations />,
    [slugs.unConfirmedOrganizations]: <UnconfirmedOrganizations />,
  };

  const currentTab = useGetCurrentRoute(tabs);

  return (
    <TablePageLayout title={pageTitles.organizations}>
      <StyledTabBar tabs={tabs} />
      {currentTab && containers[currentTab?.slug as any]}
    </TablePageLayout>
  );
};

export const StyledTabBar = styled(NavigateTabBar)`
  margin: 16px 0px;
`;

export default OrganizationList;
