import styled from 'styled-components';
import Organizations from '../components/containers/OrganizationList';
import OrganizationRequests from '../components/containers/UnconfirmedOrganizations';
import TablePageLayout from '../components/layouts/TablePageLayout';
import NavigateTabBar from '../components/Tabs/NavigateTabBar';
import { useGetCurrentRoute } from '../utils/hooks';
import { slugs } from '../utils/routes';
import { pageTitles } from '../utils/texts';

const OrganizationList = () => {
  const tabs = [
    {
      label: 'Sporto organizacijos',
      slug: slugs.organizations,
      container: <Organizations />,
    },
    {
      label: 'Prašymai',
      slug: slugs.organizationRequests,
      container: <OrganizationRequests />,
    },
  ];

  const currentTab = useGetCurrentRoute(tabs);

  return (
    <TablePageLayout title={pageTitles.organizations}>
      <StyledTabBar tabs={tabs} />
      {currentTab?.container}
    </TablePageLayout>
  );
};

export default OrganizationList;

export const StyledTabBar = styled(NavigateTabBar)`
  margin: 16px 0px;
`;
