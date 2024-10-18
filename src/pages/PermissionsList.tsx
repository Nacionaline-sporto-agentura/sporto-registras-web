import { useNavigate, useSearchParams } from 'react-router-dom';
import { NotFoundInfoProps } from '@aplinkosministerija/design-system';
import Api from '../utils/api';
import { slugs } from '../utils/routes';
import {
  buttonsTitles,
  emptyState,
  emptyStateUrl,
  featureLabels,
  pageTitles,
  roleLabels,
} from '../utils/texts';
import TablePageLayout from '../components/layouts/TablePageLayout';
import { useTableData } from '../utils/hooks';
import { Group, Permission, TableRow } from '../types';
import MainTable from '../components/tables/MainTable';
import { permissionColumns } from '../utils/columns';
import NavigateTabBar from '../components/Tabs/NavigateTabBar';
import { getInternalTabs } from '../utils/tabs';
import { TableButtonsInnerRow, TableButtonsRow } from '../styles/CommonStyles';
import Button from '../components/buttons/Button';
import { useAppSelector } from '../state/hooks';

export const mapPermissionsList = (permissions: Permission<Group>[]): TableRow[] => {
  const rows = permissions.map((permission) => {
    const role = !!permission.role ? roleLabels[permission.role] : '';
    const features = (
      permission.features?.includes('*')
        ? Object.values(featureLabels)
        : permission.features?.map((feature) => featureLabels[feature])
    )?.join(', ');
    return {
      id: permission.id,
      role: role,
      group: permission.group?.name,
      features,
    };
  });
  return rows;
};

const PermissionsList = () => {
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries([...Array.from(searchParams)]);
  const { page } = params;
  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state.user.userData);

  const tabs = getInternalTabs(currentUser.authType);

  const { tableData, loading } = useTableData({
    name: 'permissions',
    endpoint: () => Api.getPermissions({ page }),
    mapData: (list) => mapPermissionsList(list),
    dependencyArray: [searchParams, page],
  });

  const notFoundInfo: NotFoundInfoProps = {
    text: emptyState.permissions,
    url: slugs.newPermission,
    urlText: emptyStateUrl.permission,
    onClick: () => navigate(slugs.newPermission),
  };

  return (
    <TablePageLayout title={pageTitles.organizations}>
      <NavigateTabBar tabs={tabs} />
      <TableButtonsRow>
        <TableButtonsInnerRow />
        <Button onClick={() => navigate(slugs.newPermission)}>{buttonsTitles.newPermission}</Button>
      </TableButtonsRow>
      <MainTable
        notFoundInfo={notFoundInfo}
        isFilterApplied={false}
        data={tableData}
        columns={permissionColumns}
        onClick={(id) => navigate(`${slugs.permission(id)}`)}
        loading={loading}
      />
    </TablePageLayout>
  );
};

export default PermissionsList;
