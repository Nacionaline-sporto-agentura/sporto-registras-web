import { isEmpty } from 'lodash';

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
import { organizationColumns } from '../utils/columns';
import { useGenericTablePageHooks, useTableData } from '../utils/hooks';
import { mapOrganizationList } from '../utils/mapFunctions';
import { slugs } from '../utils/routes';
import { buttonsTitles, emptyState, emptyStateUrl, inputLabels, pageTitles } from '../utils/texts';

const filterConfig = () => ({
  name: {
    label: inputLabels.name,
    key: 'name',
    inputType: FilterInputTypes.text,
  },
});

const rowConfig = [['name']];

const OrganizationList = () => {
  const { dispatch, navigate, page } = useGenericTablePageHooks();

  const filters = useAppSelector((state) => state.filters.institutionFilters);

  const { tableData, loading } = useTableData({
    name: 'organizations',
    endpoint: () =>
      Api.getOrganizations({
        page,
        filter: filters,
      }),
    mapData: (list) => mapOrganizationList(list),
    dependencyArray: [filters, page],
  });

  const handleSetFilters = (filters) => {
    dispatch(filterActions.setInstitutionFilters(filters));
  };

  const notFoundInfo: NotFoundInfoProps = {
    text: emptyState.organizations,
    url: slugs.newOrganization,
    urlText: emptyStateUrl.organization,
  };

  return (
    <TablePageLayout title={pageTitles.organizations}>
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
        <Button onClick={() => navigate(slugs.newOrganization)} disabled={loading}>
          {buttonsTitles.newOrganization}
        </Button>
      </TableButtonsRow>
      <MainTable
        onClick={(id) => navigate(slugs.organizationUsers(id))}
        loading={loading}
        data={tableData}
        columns={organizationColumns}
        isFilterApplied={!isEmpty(filters)}
        notFoundInfo={notFoundInfo}
      />
    </TablePageLayout>
  );
};

export default OrganizationList;
