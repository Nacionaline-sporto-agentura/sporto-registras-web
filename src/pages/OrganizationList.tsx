import { isEmpty } from 'lodash';
import { useParams } from 'react-router-dom';

import Button from '../components/buttons/Button';
import TablePageLayout from '../components/layouts/TablePageLayout';
import DynamicFilter from '../components/other/DynamicFilter';
import { FilterInputTypes } from '../components/other/DynamicFilter/Filter';
import RecursiveTable from '../components/tables/RecursiveTable';
import { actions as filterActions } from '../state/filters/reducer';
import { useAppSelector } from '../state/hooks';
import { TableButtonsInnerRow, TableButtonsRow } from '../styles/CommonStyles';
import { NotFoundInfoProps } from '../types';
import Api from '../utils/api';
import { groupColumns } from '../utils/columns';
import { TenantTypes } from '../utils/constants';
import { useGenericTablePageHooks, useTableData } from '../utils/hooks';
import { mapGroupList } from '../utils/mapFunctions';
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
  const { id } = useParams();

  const newGroupUrl = `${slugs.newOrganization}${id ? `?parent=${id}` : ''}`;

  const filters = useAppSelector((state) => state.filters.institutionFilters);

  const { tableData, loading } = useTableData({
    name: 'organizations',
    endpoint: () =>
      Api.getTenants({
        page,
        filter: filters,
        id,
        query: { tenantType: TenantTypes.ORGANIZATION },
      }),
    mapData: (list) => mapGroupList(list),
    dependencyArray: [id, filters, page],
  });

  const handleSetFilters = (filters) => {
    dispatch(filterActions.setInstitutionFilters(filters));
  };

  const notFoundInfo: NotFoundInfoProps = {
    text: emptyState.organizations,
    url: newGroupUrl,
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
        <Button onClick={() => navigate(newGroupUrl)} disabled={loading}>
          {buttonsTitles.newOrganization}
        </Button>
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

export default OrganizationList;
