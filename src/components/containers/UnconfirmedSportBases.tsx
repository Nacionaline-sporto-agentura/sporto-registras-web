import { applyPatch } from 'fast-json-patch';
import { Request, TableRow } from '../../types';
import api from '../../utils/api';
import { colorsByStatus } from '../../utils/constants';
import { useGenericTablePageHooks, useTableData } from '../../utils/hooks';
import { slugs } from '../../utils/routes';
import { requestStatusLabels } from '../../utils/texts';
import StatusTag from '../other/StatusTag';
import MainTable from '../tables/MainTable';

const sportBaseLabels = {
  name: { label: 'Sporto bazė', show: true },
  type: { label: 'Sporto bazės rūšis', show: true },
  address: { label: 'Adresas', show: true },
  status: { label: 'Būsena', show: true },
};

const mapRequestList = (requests: Request[]): TableRow[] =>
  requests.map((request: Request) => {
    const data = applyPatch(request.entity, request.changes).newDocument;

    const status = request?.status;
    return {
      id: request.id,
      type: data?.type?.name,
      name: data.name,
      address: data.address,
      ...(status && {
        status: <StatusTag label={requestStatusLabels[status]} color={colorsByStatus[status]} />,
      }),
    };
  });

const UnconfirmedSportBases = () => {
  const { navigate, page } = useGenericTablePageHooks();

  const { tableData, loading } = useTableData({
    name: 'newRequests',
    endpoint: () =>
      api.getNewRequests({
        page,
      }),
    mapData: (list) => mapRequestList(list),
    dependencyArray: [page],
  });

  return (
    <MainTable
      loading={loading}
      notFoundInfo={{}}
      isFilterApplied={false}
      data={tableData}
      columns={sportBaseLabels}
      onClick={(id) => navigate(`${slugs.newSportBase}?prasymas=${id}`)}
    />
  );
};

export default UnconfirmedSportBases;
