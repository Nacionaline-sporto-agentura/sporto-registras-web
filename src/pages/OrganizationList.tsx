import Organizations from '../components/containers/OrganizationList';
import TablePageLayout from '../components/layouts/TablePageLayout';
import { pageTitles } from '../utils/texts';

const OrganizationList = () => {
  return (
    <TablePageLayout title={pageTitles.organizations}>
      <Organizations />,
    </TablePageLayout>
  );
};

export default OrganizationList;
