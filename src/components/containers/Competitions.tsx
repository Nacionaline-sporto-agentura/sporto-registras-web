import { actions as filterActions } from '../../state/filters/reducer';
import { useAppSelector } from '../../state/hooks';
import { TableButtonsInnerRow, TableButtonsRow } from '../../styles/CommonStyles';
import { Competition, NotFoundInfoProps, TableRow } from '../../types';
import api from '../../utils/api';
import { AdminRoleType, colorsByStatus } from '../../utils/constants';
import { getIlike } from '../../utils/functions';
import { useGenericTablePageHooks, useTableData } from '../../utils/hooks';
import { slugs } from '../../utils/routes';
import { buttonsTitles, emptyState, inputLabels, requestStatusLabels } from '../../utils/texts';
import Button from '../buttons/Button';
import DynamicFilter from '../other/DynamicFilter';
import { FilterInputTypes } from '../other/DynamicFilter/Filter';
import StatusTag from '../other/StatusTag';
import MainTable from '../tables/MainTable';

const resultLabels = {
  name: { label: 'Varžybų pavadinimas', show: true },
  year: { label: 'Metai', show: true },
  type: { label: 'Tipas', show: true },
  status: { label: 'Būsena', show: true },
};

const adminResultLabels = {
  ...resultLabels,
  tenant: { label: 'Pateikė', show: true },
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
  const { navigate, page, dispatch } = useGenericTablePageHooks();
  const user = useAppSelector((state) => state.user.userData);

  const filter = useAppSelector((state) => state.filters.competitionFilters);

  const handleSetFilters = (filters) => {
    dispatch(filterActions.setCompetitionFilters(filters));
  };

  const { tableData, loading } = useTableData({
    name: 'competitions',
    endpoint: () =>
      api.getCompetitions({
        page,
        query: mapCompetitionQuery(filter),
      }),
    mapData: (list) => mapResultList(list),
    dependencyArray: [page, filter],
  });

  const notFound: NotFoundInfoProps = {
    text: emptyState.results,
  };
  const isAdmin = user.type === AdminRoleType.USER;

  const labels = isAdmin ? adminResultLabels : resultLabels;

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
        {isAdmin && (
          <Button onClick={() => navigate(slugs.newResult)}>{buttonsTitles.registerResult}</Button>
        )}
      </TableButtonsRow>
      <MainTable
        loading={loading}
        notFoundInfo={notFound}
        isFilterApplied={false}
        data={tableData}
        columns={labels}
        onClick={(id) => navigate(slugs.result(id))}
      />
    </>
  );
};

export default Competitions;
