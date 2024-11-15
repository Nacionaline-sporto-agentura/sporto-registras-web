import { isEmpty } from 'lodash';
import { useParams } from 'react-router-dom';

import Button from '../components/buttons/Button';
import TablePageLayout from '../components/layouts/TablePageLayout';
import DynamicFilter from '../components/other/DynamicFilter';
import { FilterInputTypes } from '../components/other/DynamicFilter/Filter';
import RecursiveTable from '../components/tables/RecursiveTable';
import NavigateTabBar from '../components/Tabs/NavigateTabBar';
import { actions as filterActions } from '../state/filters/reducer';
import { useAppSelector } from '../state/hooks';
import { TableButtonsInnerRow, TableButtonsRow } from '../styles/CommonStyles';
import { NotFoundInfoProps, User } from '../types';
import Api from '../utils/api';
import { groupColumns } from '../utils/columns';
import { getSimpleFilter, isSuperAdmin } from '../utils/functions';
import { useGenericTablePageHooks, useTableData } from '../utils/hooks';
import { mapGroupList } from '../utils/mapFunctions';
import { slugs } from '../utils/routes';
import { getInternalTabs } from '../utils/tabs';
import { buttonsTitles, emptyState, emptyStateUrl, inputLabels, pageTitles } from '../utils/texts';

const filterConfig = () => ({
  name: {
    label: inputLabels.name,
    key: 'name',
    inputType: FilterInputTypes.text,
  },
});

const rowConfig = [['name']];

const GroupsList = () => {
  const { dispatch, navigate, page, pageSize } = useGenericTablePageHooks();
  const { id } = useParams();
  const currentUser: User = useAppSelector((state) => state.user.userData);

  const tabs = getInternalTabs(currentUser.authType);

  const showButton = isSuperAdmin(currentUser.type);

  const newGroupUrl = `${slugs.newGroup}${id ? `?parent=${id}` : ''}`;

  const filters = useAppSelector((state) => state.filters.groupFilters);

  const { tableData, loading } = useTableData({
    name: 'groups',
    endpoint: () => Api.getGroups({...getSimpleFilter(filters.name, page, { parent: id }), pageSize}),
    mapData: (list) => mapGroupList(list),
    dependencyArray: [id, filters, page, pageSize],
  });

  const handleSetFilters = (filters) => {
    dispatch(filterActions.setGroupFilters(filters));
  };

  const notFoundInfo: NotFoundInfoProps = {
    text: emptyState.groups,
    url: newGroupUrl,
    urlText: emptyStateUrl.group,
  };

  return (
    <TablePageLayout title={pageTitles.groups}>
      <NavigateTabBar tabs={tabs} />
      <TableButtonsRow>
        <TableButtonsInnerRow>
          <DynamicFilter
            filters={filters}
            filterConfig={filterConfig()}
            rowConfig={rowConfig}
            onSetFilters={(filters) => handleSetFilters(filters)}
            disabled={loading}
          />
        </TableButtonsInnerRow>
        {showButton && (
          <Button onClick={() => navigate(newGroupUrl)} disabled={loading}>
            {buttonsTitles.newGroups}
          </Button>
        )}
      </TableButtonsRow>
      <RecursiveTable
        onClick={(id) => navigate(slugs.groupUsers(id))}
        loading={loading}
        data={tableData}
        columns={groupColumns}
        isFilterApplied={!isEmpty(filters)}
        notFoundInfo={notFoundInfo}
      />
    </TablePageLayout>
  );
};

export default GroupsList;
