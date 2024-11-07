import { useStorage } from '@aplinkosministerija/design-system';
import { TableButtonsInnerRow, TableButtonsRow } from '../../styles/CommonStyles';
import { NationalTeam, NotFoundInfoProps, TableRow } from '../../types';
import api from '../../utils/api';
import { colorsByStatus } from '../../utils/constants';
import { formatDate, getIlike } from '../../utils/functions';
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

const nationalTeamsLabels = {
  name: { label: 'Rinktinės pavadinimas', show: true },
  ageGroup: { label: 'Amžiaus grupė', show: true },
  startAt: { label: 'Pradžia', show: true },
  endAt: { label: 'Pabaiga', show: true },
  athleteCount: { label: 'Sportininkų skaičius', show: true },
  status: { label: 'Būsena', show: true },
};

const filterConfig = () => ({
  name: {
    label: inputLabels.name,
    key: 'name',
    inputType: FilterInputTypes.text,
  },
});

const rowConfig = [['name']];

export const mapQuery = (filters: any) => {
  let params: any = {};

  if (filters) {
    filters.name && (params.name = getIlike(filters.name));
  }
  return params;
};

const mapList = (requests: NationalTeam[]): TableRow[] =>
  requests.map((nationalTeam: NationalTeam) => {
    const status = nationalTeam.lastRequest?.status;

    return {
      id: nationalTeam.id,
      name: nationalTeam.name,
      ageGroup: nationalTeam?.ageGroup?.name,
      startAt: formatDate(nationalTeam?.startAt),
      endAt: formatDate(nationalTeam?.endAt),
      athleteCount: nationalTeam?.athletes?.length,
      ...(status && {
        status: <StatusTag label={requestStatusLabels[status]} tagColor={colorsByStatus[status]} />,
      }),
      tenant: nationalTeam?.tenant?.name,
    };
  });

const NationalTeams = () => {
  const { navigate, page } = useGenericTablePageHooks();
  const { value: filter, setValue: setFilters } = useStorage<any>('nationalTeamsFIlter', {}, true);
  const tableColumns = useTableColumns(nationalTeamsLabels);
  const populate = useGetPopulateFields();
  const isUser = useIsUser();

  const { tableData, loading } = useTableData({
    name: 'nationalTeams',
    endpoint: () =>
      api.getNationalTeams({
        page,
        query: mapQuery(filter),
        populate,
      }),
    mapData: (list) => mapList(list),
    dependencyArray: [page, filter],
  });

  const notFound: NotFoundInfoProps = {
    text: emptyState.nationalTeams,
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
        {isUser && (
          <Button onClick={() => navigate(slugs.newNationalTeam)}>
            {buttonsTitles.registerNationalTeam}
          </Button>
        )}
      </TableButtonsRow>
      <MainTable
        loading={loading}
        notFoundInfo={notFound}
        isFilterApplied={false}
        data={tableData}
        columns={tableColumns}
        onClick={(id) => navigate(slugs.nationalTeam(id))}
      />
    </>
  );
};

export default NationalTeams;
