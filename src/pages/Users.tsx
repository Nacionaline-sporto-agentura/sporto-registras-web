import { isEmpty } from 'lodash';
import Button from '../components/buttons/Button';
import TablePageLayout from '../components/layouts/TablePageLayout';
import DynamicFilter from '../components/other/DynamicFilter';
import { FilterInputTypes } from '../components/other/DynamicFilter/Filter';
import TabBar from '../components/other/TabBar';
import MainTable from '../components/tables/MainTable';
import { actions as filterActions } from '../state/filters/reducer';
import { useAppSelector } from '../state/hooks';
import { TableButtonsInnerRow, TableButtonsRow } from '../styles/CommonStyles';
import { NotFoundInfoProps } from '../types';
import Api from '../utils/api';
import { groupUserLabels } from '../utils/columns';
import { useGenericTablePageHooks, useTableData } from '../utils/hooks';
import { mapGroupUsersList } from '../utils/mapFunctions';
import { slugs } from '../utils/routes';
import { getInternalTabs } from '../utils/tabs';
import { buttonsTitles, emptyState, emptyStateUrl, inputLabels, pageTitles } from '../utils/texts';

const filterConfig = () => ({
  firstName: {
    label: inputLabels.firstName,
    key: 'firstName',
    inputType: FilterInputTypes.text,
  },
  lastName: {
    label: inputLabels.lastName,
    key: 'lastName',
    inputType: FilterInputTypes.text,
  },
  email: {
    label: inputLabels.email,
    key: 'email',
    inputType: FilterInputTypes.text,
  },
});

const rowConfig = [['firstName', 'lastName'], ['email']];

const Users = () => {
  const { page, navigate, dispatch } = useGenericTablePageHooks();

  const filters = useAppSelector((state) => state.filters.userFilters);

  const { tableData, loading } = useTableData({
    name: 'users',
    endpoint: () =>
      Api.getAdminUsers({
        page,
        filter: filters,
      }),
    mapData: (list) => mapGroupUsersList(list),
    dependencyArray: [filters, page],
  });

  const handleSetFilters = (filters) => {
    dispatch(filterActions.setUserFilters(filters));
  };

  const tabs = getInternalTabs();

  const notFoundInfo: NotFoundInfoProps = {
    text: emptyState.users,
    url: slugs.newAdminUser,
    urlText: emptyStateUrl.user,
  };

  return (
    <TablePageLayout title={pageTitles.users}>
      <TabBar tabs={tabs} />
      <TableButtonsRow>
        <TableButtonsInnerRow>
          <DynamicFilter
            filters={filters}
            filterConfig={filterConfig()}
            rowConfig={rowConfig}
            onSetFilters={handleSetFilters}
            disabled={loading}
          />
        </TableButtonsInnerRow>
        <Button onClick={() => navigate(slugs.newAdminUser)}>{buttonsTitles.newUser}</Button>
      </TableButtonsRow>
      <MainTable
        loading={loading}
        notFoundInfo={notFoundInfo}
        isFilterApplied={!isEmpty(filters)}
        data={tableData}
        columns={groupUserLabels}
        onClick={(id) => navigate(slugs.adminUser(id))}
      />
    </TablePageLayout>
  );
};

export default Users;
