import { applyPatch } from 'fast-json-patch';
import { actions as filterActions } from '../../state/filters/reducer';
import { useAppSelector } from '../../state/hooks';
import { TableButtonsInnerRow, TableButtonsRow } from '../../styles/CommonStyles';
import { NotFoundInfoProps, Request, TableRow } from '../../types';
import api from '../../utils/api';
import { colorsByStatus, RequestEntityTypes } from '../../utils/constants';
import { getFormattedAddress } from '../../utils/functions';
import {
  useGenericTablePageHooks,
  useGetPopulateFields,
  useIsUser,
  useTableColumns,
  useTableData,
} from '../../utils/hooks';
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

    const status = request?.status;
    return {
      id: request.id,
      type: data?.type?.name,
      name: data.name,
      address: getFormattedAddress(address),
      ...(status && {
        status: <StatusTag label={requestStatusLabels[status]} tagColor={colorsByStatus[status]} />,
      }),
      tenant: request?.tenant?.name,
    };
  });

const UnconfirmedSportBases = () => {
  const { navigate, page, dispatch, pageSize } = useGenericTablePageHooks();
  const filters = useAppSelector((state) => state.filters.unconfirmedSportBaseFilters);
  const populate = useGetPopulateFields();
  const tableColumns = useTableColumns(sportBaseLabels);
  const isUser = useIsUser();

  const handleSetFilters = (filters) => {
    dispatch(filterActions.setUnconfirmedSportBaseFilters(filters));
  };

  const { tableData, loading } = useTableData({
    name: 'sportBasesRequests',
    endpoint: () =>
      api.getNewRequests({
        page,
        pageSize,
        query: { ...mapRequestFormFilters(filters), entityType: RequestEntityTypes.SPORTS_BASES },
        populate,
      }),
    mapData: (list) => mapRequestList(list),
    dependencyArray: [page, filters, pageSize],
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
        {isUser && (
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
        columns={tableColumns}
        onClick={(id) => navigate(`${slugs.newSportBase}?prasymas=${id}`)}
      />
    </>
  );
};

export default UnconfirmedSportBases;
