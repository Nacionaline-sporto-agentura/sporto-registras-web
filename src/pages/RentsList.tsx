import { isEmpty } from 'lodash';

import Button from '../components/buttons/Button';
import TablePageLayout from '../components/layouts/TablePageLayout';
import DynamicFilter from '../components/other/DynamicFilter';
import { FilterInputTypes } from '../components/other/DynamicFilter/Filter';
import RecursiveTable from '../components/tables/RecursiveTable';
import { actions as filterActions } from '../state/filters/reducer';
import { useAppSelector } from '../state/hooks';
import { TableButtonsInnerRow, TableButtonsRow } from '../styles/CommonStyles';
import { Bonus, NotFoundInfoProps, TableRow } from '../types';
import Api from '../utils/api';
import {
  formatDate,
  getBonusResultLabel,
  getFullName,
  getSportsPersonList,
  getSportsPersonQuery,
} from '../utils/functions';
import { useGenericTablePageHooks, useTableData } from '../utils/hooks';
import { slugs } from '../utils/routes';
import { buttonsTitles, emptyState, inputLabels, pageTitles } from '../utils/texts';

const rentsColumns = {
  sportsPerson: { label: 'Sporto asmuo', show: true },
  result: { label: 'Rezultatas', show: true },
  date: { label: 'Skyrimo data', show: true },
  amount: { label: 'Rentos dydis', show: true },
};

const mapData = (tenants: Bonus[]): TableRow[] => {
  return tenants.map((bonus: Bonus) => {
    return {
      id: bonus.id,
      sportsPerson: getFullName(bonus.sportsPerson),
      result: getBonusResultLabel(bonus?.result),
      date: formatDate(bonus.date),
      amount: bonus.amount,
    };
  });
};

const filterConfig = () => ({
  sportsPerson: {
    label: inputLabels.sportsPerson,
    key: 'sportsPerson',
    inputType: FilterInputTypes.asyncSingleSelect,
    optionsApi: getSportsPersonList,
    optionLabel: (item) => getFullName(item),
  },
});

const rowConfig = [['sportsPerson']];

const RentsList = () => {
  const { dispatch, navigate, page, pageSize } = useGenericTablePageHooks();

  const filters = useAppSelector((state) => state.filters.rentFilters);

  const { tableData, loading } = useTableData({
    name: 'rents',
    endpoint: () => Api.getRents({ page, pageSize, query: getSportsPersonQuery(filters) }),
    mapData: (list) => mapData(list),
    dependencyArray: [filters, page, pageSize],
  });

  const handleSetFilters = (filters) => {
    dispatch(filterActions.setRentFilters(filters));
  };

  const notFoundInfo: NotFoundInfoProps = {
    text: emptyState.rents,
  };

  return (
    <TablePageLayout title={pageTitles.rents}>
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
        <Button onClick={() => navigate(slugs.newRent)} disabled={loading}>
          {buttonsTitles.newRent}
        </Button>
      </TableButtonsRow>
      <RecursiveTable
        onClick={(id) => navigate(slugs.rent(id))}
        loading={loading}
        data={tableData}
        columns={rentsColumns}
        isFilterApplied={!isEmpty(filters)}
        notFoundInfo={notFoundInfo}
      />
    </TablePageLayout>
  );
};

export default RentsList;
