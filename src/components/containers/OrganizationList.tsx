import { isEmpty } from 'lodash';
import { actions as filterActions } from '../../state/filters/reducer';
import { useAppSelector } from '../../state/hooks';
import { TableButtonsInnerRow, TableButtonsRow } from '../../styles/CommonStyles';
import { NotFoundInfoProps, TableRow, Tenant } from '../../types';
import api from '../../utils/api';
import { organizationColumns } from '../../utils/columns';
import { colorsByStatus, TenantTypes } from '../../utils/constants';
import { useGenericTablePageHooks, useTableData } from '../../utils/hooks';
import { slugs } from '../../utils/routes';
import {
  buttonsTitles,
  emptyState,
  emptyStateUrl,
  inputLabels,
  requestStatusLabels,
  tenantTypeLabels,
} from '../../utils/texts';
import Button from '../buttons/Button';
import DynamicFilter from '../other/DynamicFilter';
import { FilterInputTypes } from '../other/DynamicFilter/Filter';
import StatusTag from '../other/StatusTag';
import MainTable from '../tables/MainTable';
import TableItem from '../tables/TableItem';

const filterConfig = () => ({
  name: {
    label: inputLabels.name,
    key: 'name',
    inputType: FilterInputTypes.text,
  },
  code: {
    label: inputLabels.companyCode,
    key: 'code',
    inputType: FilterInputTypes.text,
  },
  email: {
    label: inputLabels.email,
    key: 'email',
    inputType: FilterInputTypes.text,
  },
  phone: {
    label: inputLabels.phone,
    key: 'phone',
    inputType: FilterInputTypes.text,
  },
});

const rowConfig = [
  ['name', 'code'],
  ['email', 'phone'],
];

export const mapOrganizationList = (tenants: Tenant[]): TableRow[] => {
  return tenants.map((tenant: Tenant) => {
    const status = tenant?.lastRequest?.status;
    return {
      id: tenant.id,
      name: tenant.name,
      code: tenant.code,
      phone: tenant.phone,
      email: tenant.email,
      parentName: tenant?.parent && (
        <TableItem
          label={`${tenant?.parent?.name}${
            tenant?.parent?.tenantType === TenantTypes.MUNICIPALITY
              ? ` (${tenantTypeLabels.MUNICIPALITY})`
              : ''
          }`}
          url={
            tenant?.parent?.tenantType === TenantTypes.ORGANIZATION
              ? slugs.organizationUsers(tenant?.parent?.id || '')
              : slugs.institutionUsers(tenant?.parent?.id || '')
          }
        />
      ),

      ...(status && {
        status: <StatusTag label={requestStatusLabels[status]} color={colorsByStatus[status]} />,
      }),
    };
  });
};

const Organizations = () => {
  const { navigate, page, dispatch } = useGenericTablePageHooks();

  const filters = useAppSelector((state) => state.filters.organizationFilters);

  const handleSetFilters = (filters) => {
    dispatch(filterActions.setOrganizationFilters(filters));
  };

  const { tableData, loading } = useTableData({
    name: 'organizations',
    endpoint: () =>
      api.getOrganizations({
        page,
        filter: filters,
      }),
    mapData: (list) => mapOrganizationList(list),
    dependencyArray: [filters, page],
  });

  const notFoundInfo: NotFoundInfoProps = {
    text: emptyState.organizations,
    url: slugs.newOrganization,
    urlText: emptyStateUrl.organization,
  };

  return (
    <>
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
        loading={loading}
        notFoundInfo={notFoundInfo}
        isFilterApplied={!isEmpty(filters)}
        data={tableData}
        columns={organizationColumns}
        onClick={(id) => navigate(`${slugs.organization(id)}`)}
      />
    </>
  );
};

export default Organizations;
