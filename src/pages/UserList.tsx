import { isEmpty } from 'lodash';
import Cookies from 'universal-cookie';
import Button from '../components/buttons/Button';
import TablePageLayout from '../components/layouts/TablePageLayout';
import DynamicFilter from '../components/other/DynamicFilter';
import { FilterInputTypes } from '../components/other/DynamicFilter/Filter';
import MainTable from '../components/tables/MainTable';
import { actions as filterActions } from '../state/filters/reducer';
import { useAppSelector } from '../state/hooks';
import { TableButtonsInnerRow, TableButtonsRow } from '../styles/CommonStyles';
import { NotFoundInfoProps } from '../types';
import Api from '../utils/api';
import { groupUserLabels } from '../utils/columns';
import { getIlike } from '../utils/functions';
import { useGenericTablePageHooks, useIsTenantAdmin, useTableData } from '../utils/hooks';
import { mapGroupUsersList } from '../utils/mapFunctions';
import { slugs } from '../utils/routes';
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
const cookies = new Cookies();

const profileId = cookies.get('profileId');

const UserList = () => {
  const { page, navigate, dispatch, pageSize } = useGenericTablePageHooks();
  const isTenantAdmin = useIsTenantAdmin();

  const filters = useAppSelector((state) => state.filters.userFilters);

  const { tableData, loading } = useTableData({
    name: 'externalUsers',
    endpoint: () =>
      Api.getTenantUsers({
        id: profileId,
        page,
        pageSize,
        query: {
          firstName: getIlike(filters?.firstName),
          lastName: getIlike(filters?.lastName),
          email: getIlike(filters?.email),
        },
      }),
    mapData: (list) => mapGroupUsersList(list),
    dependencyArray: [filters, page, pageSize],
  });

  const handleSetFilters = (filters) => {
    dispatch(filterActions.setUserFilters(filters));
  };

  const notFoundInfo: NotFoundInfoProps = {
    text: emptyState.users,
    url: slugs.newUser,
    urlText: emptyStateUrl.user,
  };

  return (
    <TablePageLayout title={pageTitles.users}>
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
        {isTenantAdmin && (
          <Button onClick={() => navigate(slugs.newUser)}>{buttonsTitles.newUser}</Button>
        )}
      </TableButtonsRow>
      <MainTable
        loading={loading}
        notFoundInfo={notFoundInfo}
        isFilterApplied={!isEmpty(filters)}
        data={tableData}
        columns={groupUserLabels}
        onClick={(id) => navigate(slugs.user(id))}
      />
    </TablePageLayout>
  );
};

export default UserList;
