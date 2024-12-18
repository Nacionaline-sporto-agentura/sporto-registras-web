import { isEmpty } from 'lodash';
import { actions as filterActions } from '../../state/filters/reducer';
import { useAppSelector } from '../../state/hooks';
import { TableButtonsInnerRow, TableButtonsRow } from '../../styles/CommonStyles';
import { NotFoundInfoProps, TableRow, Tenant } from '../../types';
import api from '../../utils/api';
import { TenantTypes } from '../../utils/constants';
import { getIlike } from '../../utils/functions';
import { useGenericTablePageHooks, useIsTenantUser, useTableData } from '../../utils/hooks';
import { slugs } from '../../utils/routes';
import {
  buttonsTitles,
  emptyState,
  emptyStateUrl,
  inputLabels,
  tenantTypeLabels,
} from '../../utils/texts';
import Button from '../buttons/Button';
import DynamicFilter from '../other/DynamicFilter';
import { FilterInputTypes } from '../other/DynamicFilter/Filter';
import MainTable from '../tables/MainTable';
import TableItem from '../tables/TableItem';

const organizationColumns = {
  name: { label: 'Sporto organizacijos pavadinimas', show: true },
  code: { label: 'Kodas', show: true },
  email: { label: 'El. paštas', show: true },
  phone: { label: 'Telefonas', show: true },
  parentName: { label: 'Tėvinė organizacija', show: true },
};

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
    };
  });
};

const Organizations = () => {
  const { navigate, page, dispatch, pageSize } = useGenericTablePageHooks();
  const isTenantUser = useIsTenantUser();

  const filters = useAppSelector((state) => state.filters.organizationFilters);

  const handleSetFilters = (filters) => {
    dispatch(filterActions.setOrganizationFilters(filters));
  };
  const { tableData, loading } = useTableData({
    name: 'organizations',
    endpoint: () =>
      api.getOrganizations({
        page,
        pageSize,
        query: {
          name: getIlike(filters?.name),
          code: getIlike(filters?.code),
          email: getIlike(filters?.email),
          phone: getIlike(filters?.phone),
        },
      }),
    mapData: (list) => mapOrganizationList(list),
    dependencyArray: [filters, page, pageSize],
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
        {!isTenantUser && (
          <Button onClick={() => navigate(slugs.newOrganization)} disabled={loading}>
            {buttonsTitles.newOrganization}
          </Button>
        )}
      </TableButtonsRow>

      <MainTable
        loading={loading}
        notFoundInfo={notFoundInfo}
        isFilterApplied={!isEmpty(filters)}
        data={tableData}
        columns={organizationColumns}
        onClick={(id) => navigate(slugs.organizationUsers(id))}
      />
    </>
  );
};

export default Organizations;
