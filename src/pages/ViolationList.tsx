import { isEmpty } from 'lodash';

import Button from '../components/buttons/Button';
import TablePageLayout from '../components/layouts/TablePageLayout';
import DynamicFilter from '../components/other/DynamicFilter';
import { FilterInputTypes } from '../components/other/DynamicFilter/Filter';
import RecursiveTable from '../components/tables/RecursiveTable';
import { actions as filterActions } from '../state/filters/reducer';
import { useAppSelector } from '../state/hooks';
import { TableButtonsInnerRow, TableButtonsRow } from '../styles/CommonStyles';
import { NotFoundInfoProps, TableRow, Violation } from '../types';
import Api from '../utils/api';
import { getFullName, getSportsPersonList } from '../utils/functions';
import { useGenericTablePageHooks, useTableData } from '../utils/hooks';
import { slugs } from '../utils/routes';
import {
  buttonsTitles,
  emptyState,
  inputLabels,
  pageTitles,
  violationTypeLabels,
} from '../utils/texts';

const bonusColumns = {
  sportsPerson: { label: 'Sporto asmuo', show: true },
  type: { label: 'Tipas', show: true },
  sportType: { label: 'Sporto šaka', show: true },
};

const mapData = (violations: Violation[]): TableRow[] => {
  return violations.map((violation: Violation) => {
    return {
      id: violation.id,
      sportsPerson: getFullName(violation.sportsPerson),
      type: violationTypeLabels[violation.type],
      sportType: violation.sportType?.name,
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

const ViolationList = () => {
  const { dispatch, navigate, page } = useGenericTablePageHooks();

  const filters = useAppSelector((state) => state.filters.violationFilters);

  const { tableData, loading } = useTableData({
    name: 'violations',
    endpoint: () => Api.getViolations({ page }),
    mapData: (list) => mapData(list),
    dependencyArray: [filters, page],
  });

  const handleSetFilters = (filters) => {
    dispatch(filterActions.setViolationFilters(filters));
  };

  const notFoundInfo: NotFoundInfoProps = {
    text: emptyState.violations,
  };

  return (
    <TablePageLayout title={pageTitles.violations}>
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
        <Button onClick={() => navigate(slugs.newViolation)} disabled={loading}>
          {buttonsTitles.newViolation}
        </Button>
      </TableButtonsRow>
      <RecursiveTable
        onClick={(id) => navigate(slugs.violation(id))}
        loading={loading}
        data={tableData}
        columns={bonusColumns}
        isFilterApplied={!isEmpty(filters)}
        notFoundInfo={notFoundInfo}
      />
    </TablePageLayout>
  );
};

export default ViolationList;
