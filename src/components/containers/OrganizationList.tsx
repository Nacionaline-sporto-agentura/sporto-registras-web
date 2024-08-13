import { applyPatch } from 'fast-json-patch';
import { isEmpty } from 'lodash';
import { actions as filterActions } from '../../state/filters/reducer';
import { useAppSelector } from '../../state/hooks';
import { TableButtonsInnerRow, TableButtonsRow } from '../../styles/CommonStyles';
import { NotFoundInfoProps, TableRow, Tenant } from '../../types';
import api from '../../utils/api';
import { organizationColumns } from '../../utils/columns';
import { colorsByStatus, StatusTypes, TenantTypes } from '../../utils/constants';
import { getIlike } from '../../utils/functions';
import { useGenericTablePageHooks, useIsTenantUser, useTableData } from '../../utils/hooks';
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

    const lastRequestApprovalOrRejection =
      tenant?.lastRequest &&
      ![StatusTypes.APPROVED, StatusTypes.REJECTED].includes(tenant?.lastRequest?.status);

    const tenantRequest = lastRequestApprovalOrRejection
      ? applyPatch(tenant, tenant.lastRequest?.changes).newDocument
      : tenant;

    return {
      id: tenantRequest.id,
      name: tenantRequest.name,
      code: tenantRequest.code,
      phone: tenantRequest.phone,
      email: tenantRequest.email,
      parentName: tenantRequest?.parent && (
        <TableItem
          label={`${tenantRequest?.parent?.name}${
            tenantRequest?.parent?.tenantType === TenantTypes.MUNICIPALITY
              ? ` (${tenantTypeLabels.MUNICIPALITY})`
              : ''
          }`}
          url={
            tenantRequest?.parent?.tenantType === TenantTypes.ORGANIZATION
              ? slugs.organizationUsers(tenantRequest?.parent?.id || '')
              : slugs.institutionUsers(tenantRequest?.parent?.id || '')
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
        query: {
          name: getIlike(filters?.name),
          code: getIlike(filters?.code),
          email: getIlike(filters?.email),
          phone: getIlike(filters?.phone),
        },
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
        onClick={(id) => navigate(`${slugs.organizationUsers(id)}`)}
      />
    </>
  );
};

export default Organizations;
