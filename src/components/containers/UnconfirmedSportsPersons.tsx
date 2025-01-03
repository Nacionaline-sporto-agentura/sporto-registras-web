import { applyPatch } from 'fast-json-patch';
import { isEmpty } from 'lodash';
import { actions as filterActions } from '../../state/filters/reducer';
import { useAppSelector } from '../../state/hooks';
import { TableButtonsInnerRow, TableButtonsRow } from '../../styles/CommonStyles';
import { NotFoundInfoProps, Request, TableRow } from '../../types';
import api from '../../utils/api';
import { colorsByStatus, RequestEntityTypes } from '../../utils/constants';
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

const sportsPersonLabels = {
  firstName: { label: 'Vardas', show: true },
  lastName: { label: 'Pavardė', show: true },
  sportTypes: { label: 'Sporto šaka', show: true },
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
    const sportsPerson = applyPatch(request.entity, request.changes).newDocument;
    const status = request?.status;

    return {
      id: request.id,
      sportTypes: Object.values(sportsPerson?.sportTypes || {})
        ?.map((sportType) => (sportType as any)?.name)
        .join(', '),
      firstName: sportsPerson.firstName,
      lastName: sportsPerson.lastName,
      competitionCount: sportsPerson?.competitionCount || 0,
      ...(status && {
        status: <StatusTag label={requestStatusLabels[status]} tagColor={colorsByStatus[status]} />,
      }),
      tenant: request?.tenant?.name,
    };
  });

const UnconfirmedSportsPersons = () => {
  const { navigate, page, dispatch, pageSize } = useGenericTablePageHooks();
  const populate = useGetPopulateFields();
  const isUser = useIsUser();
  const tableColumns = useTableColumns(sportsPersonLabels);

  const filters = useAppSelector((state) => state.filters.unconfirmedSportsPersonFilters);

  const handleSetFilters = (filters) => {
    dispatch(filterActions.setUnconfirmedSportsPersonFilters(filters));
  };

  const { tableData, loading } = useTableData({
    name: 'sportsPersonRequests',
    endpoint: () =>
      api.getNewRequests({
        page,
        pageSize,
        query: { ...mapRequestFormFilters(filters), entityType: RequestEntityTypes.SPORTS_PERSONS },
        populate,
      }),
    mapData: (list) => mapRequestList(list),
    dependencyArray: [page, filters, pageSize],
  });

  const notFound: NotFoundInfoProps = {
    text: emptyState.sportsPersons,
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
          <Button onClick={() => navigate(slugs.newSportsPerson)}>
            {buttonsTitles.registerSportsPerson}
          </Button>
        )}
      </TableButtonsRow>
      <MainTable
        loading={loading}
        notFoundInfo={notFound}
        isFilterApplied={!isEmpty(filters)}
        data={tableData}
        columns={tableColumns}
        onClick={(id) => {
          navigate(`${slugs.newSportsPerson}?prasymas=${id}`);
        }}
      />
    </>
  );
};

export default UnconfirmedSportsPersons;
