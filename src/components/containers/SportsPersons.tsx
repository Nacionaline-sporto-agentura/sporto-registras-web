import { actions as filterActions } from '../../state/filters/reducer';
import { useAppSelector } from '../../state/hooks';
import { TableButtonsInnerRow, TableButtonsRow } from '../../styles/CommonStyles';
import { NotFoundInfoProps, SportsPerson, TableRow } from '../../types';
import api from '../../utils/api';
import { colorsByStatus } from '../../utils/constants';
import { getIlike } from '../../utils/functions';
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

const sportsPersonLabels = {
  firstName: { label: 'Vardas', show: true },
  lastName: { label: 'Pavardė', show: true },
  sportType: { label: 'Sporto šaka', show: true },
  status: { label: 'Būsena', show: true },
  competitionsCount: { label: 'Varžybų skaičius', show: true },
};

const filterConfig = () => ({
  firstName: {
    label: inputLabels.firstName,
    key: 'firstName',
    inputType: FilterInputTypes.text,
  },
  lastName: {
    label: inputLabels.lastName,
    key: 'lastName',
    inputType: FilterInputTypes.text,
  },
});

const rowConfig = [['firstName'], ['lastName']];

export const mapSportsPersonQuery = (filters: any) => {
  let params: any = {};

  if (filters) {
    filters.firstName && (params.firstName = getIlike(filters.firstName));
    filters.lastName && (params.lastName = getIlike(filters.lastName));
  }
  return params;
};

const mapRequestList = (requests: SportsPerson[]): TableRow[] =>
  requests.map((sportsPerson: SportsPerson) => {
    const status = sportsPerson.lastRequest?.status;

    return {
      id: sportsPerson.id,
      sportType: sportsPerson?.sportTypes?.map((sportType) => sportType.name).join(', '),
      firstName: sportsPerson.firstName,
      lastName: sportsPerson.lastName,
      competitionsCount: sportsPerson?.competitionsCount || 0,
      ...(status && {
        status: <StatusTag label={requestStatusLabels[status]} tagColor={colorsByStatus[status]} />,
      }),

      tenant: sportsPerson?.tenant?.name,
    };
  });

const SportsPersons = () => {
  const { navigate, page, dispatch, pageSize } = useGenericTablePageHooks();
  const populate = useGetPopulateFields();
  const tableColumns = useTableColumns(sportsPersonLabels);
  const isUser = useIsUser();
  const filter = useAppSelector((state) => state.filters.sportsPersonFilters);

  const handleSetFilters = (filters) => {
    dispatch(filterActions.setSportsPersonFilters(filters));
  };

  const { tableData, loading } = useTableData({
    name: 'sportsPersons',
    endpoint: () =>
      api.getSportsPersons({
        page,
        pageSize,
        query: mapSportsPersonQuery(filter),
        populate,
      }),
    mapData: (list) => mapRequestList(list),
    dependencyArray: [page, filter, pageSize],
  });

  const notFound: NotFoundInfoProps = {
    text: emptyState.sportsPersons,
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
          <Button onClick={() => navigate(slugs.newSportsPerson)}>
            {buttonsTitles.registerSportsPerson}
          </Button>
        )}
      </TableButtonsRow>
      <MainTable
        loading={loading}
        notFoundInfo={notFound}
        isFilterApplied={false}
        data={tableData}
        columns={tableColumns}
        onClick={(id) => navigate(slugs.sportsPerson(id))}
      />
    </>
  );
};

export default SportsPersons;
