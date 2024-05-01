import { applyPatch } from 'fast-json-patch';
import { isEmpty } from 'lodash';
import { actions as filterActions } from '../../state/filters/reducer';
import { useAppSelector } from '../../state/hooks';
import { TableButtonsInnerRow, TableButtonsRow } from '../../styles/CommonStyles';
import { NotFoundInfoProps, Request, TableRow, UnconfirmedRequestFilters } from '../../types';
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
import { getRequestStatusTypes, mapRequestFormFilters } from '../fields/utils/function';
import DynamicFilter from '../other/DynamicFilter';
import { FilterInputTypes } from '../other/DynamicFilter/Filter';
import StatusTag from '../other/StatusTag';
import MainTable from '../tables/MainTable';
import TableItem from '../tables/TableItem';

const filterConfig = () => ({
  status: {
    label: inputLabels.status,
    key: 'status',
    inputType: FilterInputTypes.multiselect,
    options: getRequestStatusTypes(),
  },
});

const rowConfig = [['status']];

const mapTenantRequestList = (requests: Request[]): TableRow[] =>
  requests.map((request: Request) => {
    const data = applyPatch(request.entity, request.changes).newDocument;
    const parent = data?.parent;
    const status = request?.status;
    return {
      id: request.id,
      email: data?.email,
      name: data.name,
      code: data.code,
      parentName: parent && (
        <TableItem
          label={`${parent?.name}${
            parent?.tenantType === TenantTypes.MUNICIPALITY
              ? ` (${tenantTypeLabels.MUNICIPALITY})`
              : ''
          }`}
          url={
            parent?.tenantType === TenantTypes.MUNICIPALITY
              ? slugs.institutionUsers(parent?.id || '')
              : slugs.organizationUsers(parent?.id || '')
          }
        />
      ),

      ...(status && {
        status: <StatusTag label={requestStatusLabels[status]} color={colorsByStatus[status]} />,
      }),
    };
  });

const UnconfirmedOrganizations = () => {
  const { navigate, page, dispatch } = useGenericTablePageHooks();

  const filters = useAppSelector((state) => state.filters.unconfirmedOrganizationFilters);

  const handleSetFilters = (filters) => {
    dispatch(filterActions.setUnconfirmedOrganizationFilters(filters));
  };

  const { tableData, loading } = useTableData({
    name: 'newTenantRequests',
    endpoint: () =>
      api.getNewRequests({
        page,
        query: mapRequestFormFilters(filters),
      }),
    mapData: (list) => mapTenantRequestList(list),
    dependencyArray: [page, filters],
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
        onClick={(id) => navigate(`${slugs.newOrganization}?prasymas=${id}`)}
      />
    </>
  );
};

export default UnconfirmedOrganizations;
