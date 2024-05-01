import { actions as filterActions } from '../../state/filters/reducer';
import { useAppSelector } from '../../state/hooks';
import { TableButtonsInnerRow, TableButtonsRow } from '../../styles/CommonStyles';
import { NotFoundInfoProps, SportBase, TableRow } from '../../types';
import api from '../../utils/api';
import { AdminRoleType, colorsByStatus } from '../../utils/constants';
import { useGenericTablePageHooks, useTableData } from '../../utils/hooks';
import { slugs } from '../../utils/routes';
import { buttonsTitles, emptyState, inputLabels, requestStatusLabels } from '../../utils/texts';
import Button from '../buttons/Button';
import { getSportBaseTypeList } from '../fields/utils/function';
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
  name: {
    label: inputLabels.name,
    key: 'name',
    inputType: FilterInputTypes.text,
  },
  type: {
    label: inputLabels.type,
    key: 'type',
    inputType: FilterInputTypes.asyncSingleSelect,
    optionsApi: getSportBaseTypeList,
    optionLabel: (item) => `${item?.name}`,
  },
});

const rowConfig = [['name'], ['type']];

export const mapSportBaseFilters = (filters: any): any => {
  let params: any = {};

  if (filters) {
    filters.name && (params.name = filters.name);
  }
  return params;
};

export const mapSportBaseQuery = (filters: any) => {
  let params: any = {};

  if (filters) {
    filters.type && (params.type = filters.type.id);
  }
  return params;
};

const mapRequestList = (requests: SportBase[]): TableRow[] =>
  requests.map((request: SportBase) => {
    const status = request.lastRequest?.status;
    const address = request.address;

    const formattedAddress =
      address?.street && address?.house && address?.city && address?.municipality
        ? `${address.street} ${address.house} ${address.apartment}, ${address.city} ${address.municipality}`
        : '-';

    return {
      id: request.id,
      type: request?.type?.name,
      name: request.name,
      address: formattedAddress,
      ...(status && {
        status: <StatusTag label={requestStatusLabels[status]} color={colorsByStatus[status]} />,
      }),
    };
  });

const SportBases = () => {
  const { navigate, page, dispatch } = useGenericTablePageHooks();
  const user = useAppSelector((state) => state.user.userData);

  const filter = useAppSelector((state) => state.filters.sportBaseFilters);

  const handleSetFilters = (filters) => {
    dispatch(filterActions.setSportBaseFilters(filters));
  };

  const { tableData, loading } = useTableData({
    name: 'sportBases',
    endpoint: () =>
      api.getSportBases({
        page,
        filter: mapSportBaseFilters(filter),
        query: mapSportBaseQuery(filter),
      }),
    mapData: (list) => mapRequestList(list),
    dependencyArray: [page, filter],
  });

  const notFound: NotFoundInfoProps = {
    text: emptyState.sportBases,
  };

  return (
    <>
      <TableButtonsRow>
        <TableButtonsInnerRow>
          <DynamicFilter
            filters={filter}
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
        onClick={(id) => navigate(slugs.sportBase(id))}
      />
    </>
  );
};

export default SportBases;
function dispatch(arg0: any) {
  throw new Error('Function not implemented.');
}
