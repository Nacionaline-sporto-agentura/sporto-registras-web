import { TableButtonsInnerRow, TableButtonsRow } from '../../styles/CommonStyles';
import { NotFoundInfoProps } from '../../types';
import api from '../../utils/api';
import { groupUserLabels } from '../../utils/columns';
import { useGenericTablePageHooks, useTableData } from '../../utils/hooks';
import { mapGroupUsersList } from '../../utils/mapFunctions';
import { slugs } from '../../utils/routes';
import { buttonsTitles, emptyState, emptyStateUrl } from '../../utils/texts';
import Button from '../buttons/Button';
import MainTable from '../tables/MainTable';

const GroupUser = () => {
  const { navigate, page, id, pageSize } = useGenericTablePageHooks();
  const newUrl = `${slugs.newAdminUser}?group=${id}`;

  const { tableData, loading } = useTableData({
    name: 'groupUsers',
    endpoint: () =>
      api.getGroupUsers({
        page,
        pageSize,
        id,
      }),
    mapData: (list) => mapGroupUsersList(list),
    dependencyArray: [page, pageSize],
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
        onClick={(id) => navigate(slugs.adminUser(id))}
        isFilterApplied={false}
        notFoundInfo={notFound}
        data={tableData}
        columns={groupUserLabels}
      />
    </>
  );
};

export default GroupUser;
