import { isEmpty } from 'lodash';
import { useParams } from 'react-router-dom';

import Button from '../components/buttons/Button';
import TablePageLayout from '../components/layouts/TablePageLayout';
import DynamicFilter from '../components/other/DynamicFilter';
import { FilterInputTypes } from '../components/other/DynamicFilter/Filter';
import RecursiveTable from '../components/tables/RecursiveTable';
import { actions as filterActions } from '../state/filters/reducer';
import { useAppSelector } from '../state/hooks';
import { TableButtonsInnerRow, TableButtonsRow } from '../styles/CommonStyles';
import { NotFoundInfoProps } from '../types';
import Api from '../utils/api';
import { institutionColumns } from '../utils/columns';
import { getSimpleFilter } from '../utils/functions';
import { useGenericTablePageHooks, useTableData } from '../utils/hooks';
import { mapInstitutionList } from '../utils/mapFunctions';
import { slugs } from '../utils/routes';
import { buttonsTitles, emptyState, emptyStateUrl, inputLabels, pageTitles } from '../utils/texts';

const filterConfig = () => ({
  name: {
    label: inputLabels.name,
    key: 'name',
    inputType: FilterInputTypes.text,
  },
});

const rowConfig = [['name']];

const InstitutionList = () => {
  const { dispatch, navigate, page } = useGenericTablePageHooks();
  const { id } = useParams();

  const newGroupUrl = `${slugs.newInstitutions}${id ? `?parent=${id}` : ''}`;

  const filters = useAppSelector((state) => state.filters.institutionFilters);

  const { tableData, loading } = useTableData({
    name: 'institutions',
    endpoint: () => Api.getInstitutions(getSimpleFilter(filters.name, page)),
    mapData: (list) => mapInstitutionList(list),
    dependencyArray: [id, filters, page],
  });

  const handleSetFilters = (filters) => {
    dispatch(filterActions.setInstitutionFilters(filters));
  };

  const notFoundInfo: NotFoundInfoProps = {
    text: emptyState.institutions,
    url: newGroupUrl,
    urlText: emptyStateUrl.institution,
  };

  return (
    <TablePageLayout title={pageTitles.institutions}>
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
        <Button onClick={() => navigate(newGroupUrl)} disabled={loading}>
          {buttonsTitles.newInstitution}
        </Button>
      </TableButtonsRow>
      <RecursiveTable
        onClick={(id) => navigate(slugs.institutionUsers(id))}
        loading={loading}
        data={tableData}
        columns={institutionColumns}
        isFilterApplied={!isEmpty(filters)}
        notFoundInfo={notFoundInfo}
      />
    </TablePageLayout>
  );
};

export default InstitutionList;
