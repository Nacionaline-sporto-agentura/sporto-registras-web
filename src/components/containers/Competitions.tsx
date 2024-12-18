import { actions as filterActions } from '../../state/filters/reducer';
import { useAppSelector } from '../../state/hooks';
import { TableButtonsInnerRow, TableButtonsRow } from '../../styles/CommonStyles';
import { Competition, NotFoundInfoProps, TableRow } from '../../types';
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

const competitionLabels = {
  name: { label: 'Varžybų pavadinimas', show: true },
  year: { label: 'Metai', show: true },
  type: { label: 'Tipas', show: true },
  status: { label: 'Būsena', show: true },
};

const filterConfig = () => ({
  name: {
    label: inputLabels.matchName,
    key: 'name',
    inputType: FilterInputTypes.text,
  },
});

const rowConfig = [['name']];

export const mapCompetitionQuery = (filters: any) => {
  let params: any = {};

  if (filters) {
    filters.name && (params.name = getIlike(filters.name));
  }
  return params;
};

const mapResultList = (results: Competition[]): TableRow[] =>
  results.map((result: Competition) => {
    const status = result.lastRequest?.status;

    return {
      id: result.id,
      type: result?.competitionType?.name,
      year: result?.year,
      name: result.name,
      ...(status && {
        status: <StatusTag label={requestStatusLabels[status]} tagColor={colorsByStatus[status]} />,
      }),
      tenant: result?.tenant?.name,
    };
  });

const Competitions = () => {
  const { navigate, page, dispatch, pageSize } = useGenericTablePageHooks();
  const tableColumns = useTableColumns(competitionLabels);
  const populate = useGetPopulateFields();
  const isUser = useIsUser();

  const filter = useAppSelector((state) => state.filters.competitionFilters);

  const handleSetFilters = (filters) => {
    dispatch(filterActions.setCompetitionFilters(filters));
  };

  const { tableData, loading } = useTableData({
    name: 'competitions',
    endpoint: () =>
      api.getCompetitions({
        page,
        pageSize,
        query: mapCompetitionQuery(filter),
        populate,
      }),
    mapData: (list) => mapResultList(list),
    dependencyArray: [page, filter, pageSize],
  });

  const notFound: NotFoundInfoProps = {
    text: emptyState.results,
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
          <Button onClick={() => navigate(slugs.newResult)}>{buttonsTitles.registerResult}</Button>
        )}
      </TableButtonsRow>
      <MainTable
        loading={loading}
        notFoundInfo={notFound}
        isFilterApplied={false}
        data={tableData}
        columns={tableColumns}
        onClick={(id) => navigate(slugs.result(id))}
      />
    </>
  );
};

export default Competitions;
