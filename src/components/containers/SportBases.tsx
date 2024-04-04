import { NotFoundInfoProps, SportBase, TableRow } from '../../types';
import api from '../../utils/api';
import { colorsByStatus } from '../../utils/constants';
import { useGenericTablePageHooks, useTableData } from '../../utils/hooks';
import { slugs } from '../../utils/routes';
import { emptyState, requestStatusLabels } from '../../utils/texts';
import StatusTag from '../other/StatusTag';
import MainTable from '../tables/MainTable';

const sportBaseLabels = {
  name: { label: 'Sporto bazė', show: true },
  type: { label: 'Sporto bazės rūšis', show: true },
  address: { label: 'Adresas', show: true },
  status: { label: 'Būsena', show: true },
};

const mapRequestList = (requests: SportBase[]): TableRow[] =>
  requests.map((request: SportBase) => {
    const status = request.lastRequest?.status;
    return {
      id: request.id,
      type: request?.type?.name,
      name: request.name,
      address: request.address,
      ...(status && {
        status: <StatusTag label={requestStatusLabels[status]} color={colorsByStatus[status]} />,
      }),
    };
  });

const SportBases = () => {
  const { navigate, page } = useGenericTablePageHooks();

  const { tableData, loading } = useTableData({
    name: 'sportBases',
    endpoint: () =>
      api.getSportBases({
        page,
      }),
    mapData: (list) => mapRequestList(list),
    dependencyArray: [page],
  });

  const notFound: NotFoundInfoProps = {
    text: emptyState.sportBases,
  };

  return (
    <MainTable
      loading={loading}
      notFoundInfo={notFound}
      isFilterApplied={false}
      data={tableData}
      columns={sportBaseLabels}
      onClick={(id) => navigate(slugs.sportBase(id))}
    />
  );
};

export default SportBases;
