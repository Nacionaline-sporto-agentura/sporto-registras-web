import { TableButtonsInnerRow, TableButtonsRow } from '../../styles/CommonStyles';
import { NotFoundInfoProps } from '../../types';
import api from '../../utils/api';
import { useGenericTablePageHooks, useTableData } from '../../utils/hooks';
import { mapGroupUsersList } from '../../utils/mapFunctions';
import { slugs } from '../../utils/routes';
import { buttonsTitles, emptyState, emptyStateUrl } from '../../utils/texts';
import Button from '../buttons/Button';
import MainTable from '../tables/MainTable';

export const columns = {
  name: { label: 'Naudotojas', show: true },
  phone: { label: 'Telefonas', show: true },
  email: { label: 'El. paštas', show: true },
};

const OrganizationUsers = () => {
  const { navigate, page, id = '' } = useGenericTablePageHooks();
  const newUrl = slugs.newUser(id);

  const { tableData, loading } = useTableData({
    name: 'organizationTenantUsers',
    endpoint: () =>
      api.getTenantUsers({
        page,
        id,
      }),
    mapData: (list) => mapGroupUsersList(list),
    dependencyArray: [page, id],
  });

  const notFound: NotFoundInfoProps = {
    text: emptyState.groupUsers,
    url: newUrl,
    urlText: emptyStateUrl.groupUser,
  };

  return (
    <>
      <TableButtonsRow>
        <TableButtonsInnerRow />
        <Button
          onClick={() => {
            navigate(newUrl);
          }}
        >
          {buttonsTitles.newUser}
        </Button>
      </TableButtonsRow>
      <MainTable
        loading={loading}
        onClick={(userId) => navigate(slugs.organizationUser(id, userId))}
        isFilterApplied={false}
        notFoundInfo={notFound}
        data={tableData}
        columns={columns}
      />
    </>
  );
};

export default OrganizationUsers;
