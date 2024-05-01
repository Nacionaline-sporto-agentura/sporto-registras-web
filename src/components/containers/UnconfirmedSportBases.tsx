import { applyPatch } from 'fast-json-patch';
import { actions as filterActions } from '../../state/filters/reducer';
import { useAppSelector } from '../../state/hooks';
import { TableButtonsInnerRow, TableButtonsRow } from '../../styles/CommonStyles';
import { NotFoundInfoProps, Request, TableRow } from '../../types';
import api from '../../utils/api';
import { AdminRoleType, colorsByStatus } from '../../utils/constants';
import { useGenericTablePageHooks, useTableData } from '../../utils/hooks';
import { slugs } from '../../utils/routes';
import { buttonsTitles, emptyState, inputLabels, requestStatusLabels } from '../../utils/texts';
import Button from '../buttons/Button';
import { getRequestStatusTypes, mapRequestFormFilters } from '../fields/utils/function';
import DynamicFilter from '../other/DynamicFilter';
import { FilterInputTypes } from '../other/DynamicFilter/Filter';
import StatusTag from '../other/StatusTag';
import MainTable from '../tables/MainTable';

const sportBaseLabels = {
  name: { label: 'Sporto bazė', show: true },
  type: { label: 'Sporto bazės rūšis', show: true },
  address: { label: 'Adresas', show: true },
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
    const data = applyPatch(request.entity, request.changes).newDocument;

    const address = data?.address;

    const formattedAddress =
      address?.street && address?.house && address?.city && address?.municipality
        ? `${address.street} ${address.house} ${
            address.apartment ? `-${address.apartment}` : ''
          }, ${address.city} ${address.municipality}`
        : '-';

    const status = request?.status;
    return {
      id: request.id,
      type: data?.type?.name,
      name: data.name,
      address: formattedAddress,
      ...(status && {
        status: <StatusTag label={requestStatusLabels[status]} color={colorsByStatus[status]} />,
      }),
    };
  });

const UnconfirmedSportBases = () => {
  const { navigate, page, dispatch } = useGenericTablePageHooks();
  const user = useAppSelector((state) => state.user.userData);

  const filters = useAppSelector((state) => state.filters.unconfirmedSportBaseFilters);

  const handleSetFilters = (filters) => {
    dispatch(filterActions.setUnconfirmedSportBaseFilters(filters));
  };

  const { tableData, loading } = useTableData({
    name: 'newRequests',
    endpoint: () =>
      api.getNewRequests({
        page,
        query: mapRequestFormFilters(filters),
      }),
    mapData: (list) => mapRequestList(list),
    dependencyArray: [page, filters],
  });

  const notFound: NotFoundInfoProps = {
    text: emptyState.unConfirmedSportBases,
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
        {user.type === AdminRoleType.USER && (
          <Button onClick={() => navigate(slugs.newSportBase)}>
            {buttonsTitles.registerSportBase}
          </Button>
        )}
      </TableButtonsRow>
      <MainTable
        loading={loading}
        notFoundInfo={notFound}
        isFilterApplied={false}
        data={tableData}
        columns={sportBaseLabels}
        onClick={(id) => navigate(`${slugs.newSportBase}?prasymas=${id}`)}
      />
    </>
  );
};

export default UnconfirmedSportBases;
