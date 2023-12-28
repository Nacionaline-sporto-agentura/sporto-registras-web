import { useEffect, useState } from 'react';
import { TableButtonsInnerRow, TableButtonsRow } from '../../styles/CommonStyles';
import { Group, NotFoundInfoProps, TableData } from '../../types';
import { groupColumns } from '../../utils/columns';
import { handlePagination } from '../../utils/functions';
import { useGenericTablePageHooks } from '../../utils/hooks';
import { mapGroupList } from '../../utils/mapFunctions';
import { slugs } from '../../utils/routes';
import { buttonsTitles, emptyState, emptyStateUrl } from '../../utils/texts';
import Button from '../buttons/Button';
import RecursiveTable from '../tables/RecursiveTable';

const GroupGroups = ({ groups = [] }: { groups: Group[] }) => {
  const { navigate, page, id } = useGenericTablePageHooks();
  const [tableData, setTableData] = useState<TableData>();
  const newUrl = `${slugs.newGroup}${id ? `?parent=${id}` : ''}`;
  useEffect(() => {
    const pageData = handlePagination({
      data: groups,
      page: page,
      pageSize: 10,
    });
    setTableData({
      data: mapGroupList(pageData.slicedData),
      totalPages: pageData.totalPages,
    });
  }, [page, groups]);

  const notFound: NotFoundInfoProps = {
    text: emptyState.groups,
    url: newUrl,
    urlText: emptyStateUrl.group,
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
          {buttonsTitles.newGroups}
        </Button>
      </TableButtonsRow>
      <RecursiveTable
        loading={false}
        onClick={(id) => navigate(slugs.groupUsers(id))}
        notFoundInfo={notFound}
        data={tableData}
        columns={groupColumns}
      />
    </>
  );
};

export default GroupGroups;
