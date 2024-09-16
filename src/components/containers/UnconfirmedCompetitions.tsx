import { applyPatch } from 'fast-json-patch';
import { actions as filterActions } from '../../state/filters/reducer';
import { useAppSelector } from '../../state/hooks';
import { TableButtonsInnerRow, TableButtonsRow } from '../../styles/CommonStyles';
import { NotFoundInfoProps, Request, TableRow } from '../../types';
import api from '../../utils/api';
import { AdminRoleType, colorsByStatus, RequestEntityTypes } from '../../utils/constants';
import { useGenericTablePageHooks, useTableData } from '../../utils/hooks';
import { slugs } from '../../utils/routes';
import { buttonsTitles, emptyState, inputLabels, requestStatusLabels } from '../../utils/texts';
import Button from '../buttons/Button';
import { getRequestStatusTypes, mapRequestFormFilters } from '../fields/utils/function';
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
    const result = applyPatch(request.entity, request.changes).newDocument;
    const status = request?.status;

    return {
      id: request.id,
      type: result?.competitionType?.name,
      year: result?.year,
      name: result.name,
      ...(status && {
        status: <StatusTag label={requestStatusLabels[status]} tagColor={colorsByStatus[status]} />,
      }),
      tenant: result?.tenant?.name,
    };
  });

const UnconfirmedCompetitions = () => {
  const { navigate, page, dispatch } = useGenericTablePageHooks();
  const user = useAppSelector((state) => state.user.userData);

  const filters = useAppSelector((state) => state.filters.unconfirmedCompetitionFilters);

  const handleSetFilters = (filters) => {
    dispatch(filterActions.setUnconfirmedCompetitionFilters(filters));
  };

  const { tableData, loading } = useTableData({
    name: 'unconfirmedResults',
    endpoint: () =>
      api.getNewRequests({
        page,
        query: { ...mapRequestFormFilters(filters), entityType: RequestEntityTypes.COMPETITIONS },
      }),
    mapData: (list) => mapRequestList(list),
    dependencyArray: [page, filters],
  });

  const notFound: NotFoundInfoProps = {
    text: emptyState.results,
  };

  const isAdmin = user.type === AdminRoleType.ADMIN;

  const labels = isAdmin ? adminResultLabels : resultLabels;

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
        {!isAdmin && (
          <Button onClick={() => navigate(slugs.newResult)}>{buttonsTitles.registerResult}</Button>
        )}
      </TableButtonsRow>
      <MainTable
        loading={loading}
        notFoundInfo={notFound}
        isFilterApplied={false}
        data={tableData}
        columns={labels}
        onClick={(id) => navigate(`${slugs.newResult}?prasymas=${id}`)}
      />
    </>
  );
};

export default UnconfirmedCompetitions;
