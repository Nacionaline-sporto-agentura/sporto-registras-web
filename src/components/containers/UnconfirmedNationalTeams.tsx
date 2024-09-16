import { useStorage } from '@aplinkosministerija/design-system';
import { applyPatch } from 'fast-json-patch';
import { useAppSelector } from '../../state/hooks';
import { TableButtonsInnerRow, TableButtonsRow } from '../../styles/CommonStyles';
import { NotFoundInfoProps, Request, TableRow } from '../../types';
import api from '../../utils/api';
import { AdminRoleType, colorsByStatus, RequestEntityTypes } from '../../utils/constants';
import { formatDate } from '../../utils/functions';
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
  name: { label: 'Rinktinės pavadinimas', show: true },
  ageGroup: { label: 'Amžiaus grupė', show: true },
  startAt: { label: 'Pradžia', show: true },
  endAt: { label: 'Pabaiga', show: true },
  athleteCount: { label: 'Sportininkų skaičius', show: true },
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
    const status = request?.status;
    return {
      id: request.id,
      name: data.name,
      ageGroup: data?.ageGroup?.name,
      startAt: formatDate(data?.startAt),
      endAt: formatDate(data?.endAt),
      athleteCount: Object.values(data?.athletes)?.length,
      ...(status && {
        status: <StatusTag label={requestStatusLabels[status]} tagColor={colorsByStatus[status]} />,
      }),
    };
  });

const UnconfirmedNationalTeams = () => {
  const { navigate, page } = useGenericTablePageHooks();
  const user = useAppSelector((state) => state.user.userData);

  const { value: filter, setValue: setFilters } = useStorage<any>(
    'unconfirmedNationalTeamsFIlter',
    {},
    true,
  );

  const { tableData, loading } = useTableData({
    name: 'nationalTeamsRequests',
    endpoint: () =>
      api.getNewRequests({
        page,
        query: { ...mapRequestFormFilters(filter), entityType: RequestEntityTypes.NATIONAL_TEAMS },
      }),
    mapData: (list) => mapRequestList(list),
    dependencyArray: [page, filter],
  });

  const notFound: NotFoundInfoProps = {
    text: emptyState.unConfirmedSportBases,
  };

  return (
    <>
      <TableButtonsRow>
        <TableButtonsInnerRow>
          <DynamicFilter
            filters={filter}
            filterConfig={filterConfig()}
            rowConfig={rowConfig}
            onSetFilters={setFilters}
            disabled={loading}
          />
        </TableButtonsInnerRow>
        {user.type !== AdminRoleType.USER && (
          <Button onClick={() => navigate(slugs.newNationalTeam)}>
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
        onClick={(id) => navigate(`${slugs.newNationalTeam}?prasymas=${id}`)}
      />
    </>
  );
};

export default UnconfirmedNationalTeams;
