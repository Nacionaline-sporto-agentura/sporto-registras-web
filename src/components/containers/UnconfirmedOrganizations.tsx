import { useStorage } from '@aplinkosministerija/design-system';
import { applyPatch } from 'fast-json-patch';
import { TableButtonsInnerRow, TableButtonsRow } from '../../styles/CommonStyles';
import { NotFoundInfoProps, Request, TableRow, Tenant } from '../../types';
import api from '../../utils/api';
import { colorsByStatus, RequestEntityTypes } from '../../utils/constants';
import { useGenericTablePageHooks, useIsTenantUser, useTableData } from '../../utils/hooks';
import { slugs } from '../../utils/routes';
import { buttonsTitles, emptyState, inputLabels, requestStatusLabels } from '../../utils/texts';
import Button from '../buttons/Button';
import { getRequestStatusTypes, mapRequestFormFilters } from '../fields/utils/function';
import DynamicFilter from '../other/DynamicFilter';
import { FilterInputTypes } from '../other/DynamicFilter/Filter';
import StatusTag from '../other/StatusTag';
import MainTable from '../tables/MainTable';

const OrganizationLabels = {
  name: { label: 'Sporto organizacijos pavadinimas', show: true },
  code: { label: 'Kodas', show: true },
  email: { label: 'El. paštas', show: true },
  phone: { label: 'Telefonas', show: true },
  status: { label: 'Būsena', show: true },
};

const filterConfig = () => ({
  status: {
    label: inputLabels.status,
    key: 'status',
    inputType: FilterInputTypes.multiselect,
    options: getRequestStatusTypes(),
  },
});

const rowConfig = [['status']];

const mapRequestList = (requests: Request[]): TableRow[] =>
  requests.map((request: Request) => {
    const data: Tenant = applyPatch(request.entity, request.changes).newDocument;
    const status = request?.status;

    return {
      id: data.id,
      name: data.name,
      code: data?.code,
      phone: data?.phone,
      email: data.email,
      ...(status && {
        status: <StatusTag label={requestStatusLabels[status]} tagColor={colorsByStatus[status]} />,
      }),
    };
  });

const OrganizationRequests = () => {
  const { navigate, page, pageSize } = useGenericTablePageHooks();
  const isTenantUser = useIsTenantUser();

  const { value: filter, setValue: setFilters } = useStorage<any>('organizationRequests', {}, true);

  const { tableData, loading } = useTableData({
    name: 'organizationRequests',
    endpoint: () =>
      api.getRequests({
        page,
        pageSize,
        query: { ...mapRequestFormFilters(filter), entityType: RequestEntityTypes.TENANTS },
      }),
    mapData: (list) => mapRequestList(list),
    dependencyArray: [page, filter, pageSize],
  });

  const notFound: NotFoundInfoProps = {
    text: emptyState.organizationRequests,
  };

  return (
    <>
      <TableButtonsRow>
        <TableButtonsInnerRow>
          <DynamicFilter
            filters={filter}
            filterConfig={filterConfig()}
            rowConfig={rowConfig}
            onSetFilters={setFilters}
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
        notFoundInfo={notFound}
        isFilterApplied={false}
        data={tableData}
        columns={OrganizationLabels}
        onClick={(id) => navigate(`${slugs.organizationUsers(id)}?showRequest=1`)}
      />
    </>
  );
};

export default OrganizationRequests;
