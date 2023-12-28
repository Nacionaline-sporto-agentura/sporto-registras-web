import { isEmpty } from 'lodash';
import { useParams } from 'react-router-dom';

import Button from '../components/buttons/Button';
import TablePageLayout from '../components/layouts/TablePageLayout';
import DynamicFilter from '../components/other/DynamicFilter';
import { FilterInputTypes } from '../components/other/DynamicFilter/Filter';
import TabBar from '../components/other/TabBar';
import RecursiveTable from '../components/tables/RecursiveTable';
import { actions as filterActions } from '../state/filters/reducer';
import { useAppSelector } from '../state/hooks';
import { TableButtonsInnerRow, TableButtonsRow } from '../styles/CommonStyles';
import { NotFoundInfoProps } from '../types';
import Api from '../utils/api';
import { groupColumns } from '../utils/columns';
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
  const { dispatch, navigate, page } = useGenericTablePageHooks();
  const { id } = useParams();

  const tabs = getInternalTabs();

  const showButton = true;

  const newGroupUrl = `${slugs.newGroup}${id ? `?parent=${id}` : ''}`;

  const filters = useAppSelector((state) => state.filters.groupFilters);

  const { tableData, loading } = useTableData({
    name: 'groups',
    endpoint: () => Api.getGroups({ page, filter: filters, id }),
    mapData: (list) => mapGroupList(list),
    dependencyArray: [id, filters, page],
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
      <TabBar tabs={tabs} />
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
