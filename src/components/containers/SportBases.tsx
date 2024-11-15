import { applyPatch } from 'fast-json-patch';
import { actions as filterActions } from '../../state/filters/reducer';
import { useAppSelector } from '../../state/hooks';
import { TableButtonsInnerRow, TableButtonsRow } from '../../styles/CommonStyles';
import { NotFoundInfoProps, SportsBase, TableRow } from '../../types';
import api from '../../utils/api';
import { colorsByStatus, StatusTypes } from '../../utils/constants';
import { getFormattedAddress, getIlike, getSportBaseTypeList } from '../../utils/functions';
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
    label: inputLabels.sportBaseType,
    key: 'type',
    inputType: FilterInputTypes.asyncSingleSelect,
    optionsApi: getSportBaseTypeList,
    optionLabel: (item) => `${item?.name}`,
  },
});

const rowConfig = [['name'], ['type']];

export const mapSportBaseQuery = (filters: any) => {
  let params: any = {};

  if (filters) {
    filters.type && (params.type = filters.type.id);
    filters.name && (params.name = getIlike(filters.name));
  }
  return params;
};

const mapRequestList = (requests: SportsBase[]): TableRow[] =>
  requests.map((sportsBase: SportsBase) => {
    const status = sportsBase.lastRequest?.status;
    const address = sportsBase.address;

    const lastRequestIsNotApprovalOrRejection =
      sportsBase?.lastRequest &&
      ![StatusTypes.APPROVED, StatusTypes.REJECTED].includes(sportsBase?.lastRequest?.status);

    const sportsBaseRequest = lastRequestIsNotApprovalOrRejection
      ? applyPatch(
          sportsBase,
          sportsBase.lastRequest?.changes.filter((change) => {
            return !['spaces', 'investments', 'owners', 'tenants'].some((item) =>
              change.path.includes(item),
            );
          }),
        ).newDocument
      : sportsBase;

    return {
      id: sportsBaseRequest.id,
      type: sportsBaseRequest?.type?.name,
      name: sportsBaseRequest.name,
      address: getFormattedAddress(address),
      ...(status && {
        status: <StatusTag label={requestStatusLabels[status]} tagColor={colorsByStatus[status]} />,
      }),
      tenant: sportsBase?.tenant?.name,
    };
  });

const SportBases = () => {
  const { navigate, page, dispatch, pageSize } = useGenericTablePageHooks();
  const populate = useGetPopulateFields();
  const tableColumns = useTableColumns(sportBaseLabels);
  const isUser = useIsUser();
  const filter = useAppSelector((state) => state.filters.sportBaseFilters);

  const handleSetFilters = (filters) => {
    dispatch(filterActions.setSportBaseFilters(filters));
  };

  const { tableData, loading } = useTableData({
    name: 'sportBases',
    endpoint: () =>
      api.getSportsBases({
        page,
        pageSize,
        query: mapSportBaseQuery(filter),
        populate,
      }),
    mapData: (list) => mapRequestList(list),
    dependencyArray: [page, filter, pageSize],
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
        onClick={(id) => navigate(slugs.sportsBase(id))}
      />
    </>
  );
};

export default SportBases;
function dispatch(arg0: any) {
  throw new Error('Function not implemented.');
}
