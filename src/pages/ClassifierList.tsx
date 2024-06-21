import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../components/buttons/Button';
import TablePageLayout from '../components/layouts/TablePageLayout';
import DynamicFilter from '../components/other/DynamicFilter';
import { FilterInputTypes } from '../components/other/DynamicFilter/Filter';
import MainTable from '../components/tables/MainTable';
import TabBar from '../components/Tabs/TabBar';
import { actions as filterActions } from '../state/filters/reducer';
import { useAppSelector } from '../state/hooks';
import { TableButtonsInnerRow, TableButtonsRow } from '../styles/CommonStyles';
import { NotFoundInfoProps } from '../types';
import api from '../utils/api';
import { classifierColumns } from '../utils/columns';
import { ClassifierTypes } from '../utils/constants';
import { getSimpleFilter } from '../utils/functions';
import { useGenericTablePageHooks, useTableData } from '../utils/hooks';
import { slugs } from '../utils/routes';
import { classifierLabels, newClassifierLabels } from '../utils/texts';

const notFound: NotFoundInfoProps = {
  text: 'Nėra sukurtų klasifikatorių',
  url: '',
  urlText: 'Sukurkite',
};

const filterConfig = (columns) => ({
  name: {
    label: columns['name'].label,
    key: 'name',
    inputType: FilterInputTypes.text,
  },
});

const rowConfig = [['name']];

const ClassifierList = () => {
  const { page, navigate, dispatch } = useGenericTablePageHooks();
  const { dynamic: classifierType } = useParams<{ dynamic: string }>();

  const filter = useAppSelector((state) =>
    classifierType ? state.filters.classifierFilters?.[classifierType] : {},
  );
  const [sortedColumn, setSortedColumn] = useState<{
    key?: string;
    direction?: 'asc' | 'desc';
  }>({});

  const query = {
    ...getSimpleFilter(filter?.name, page),
    ...(sortedColumn.key && {
      sort: [`${sortedColumn.direction === 'asc' ? '' : '-'}` + sortedColumn.key],
    }),
  };

  const handleSetFilters = (filters) => {
    if (classifierType) dispatch(filterActions.seClassifierFilters({ [classifierType]: filters }));
  };

  const tabs = [
    {
      label: classifierLabels[ClassifierTypes.SPORT_TYPE],
      key: ClassifierTypes.SPORT_TYPE,
      route: slugs.classifiers(ClassifierTypes.SPORT_TYPE),
      endpoint: () => api.getSportTypes(query),
    },

    {
      label: classifierLabels[ClassifierTypes.SPORTS_BASE_TYPE],
      key: ClassifierTypes.SPORTS_BASE_TYPE,
      route: slugs.classifiers(ClassifierTypes.SPORTS_BASE_TYPE),
      endpoint: () => api.getSportBaseTypes(query),
    },
    {
      label: classifierLabels[ClassifierTypes.SOURCE],
      key: ClassifierTypes.SOURCE,
      route: slugs.classifiers(ClassifierTypes.SOURCE),
      endpoint: () => api.getSportBaseSources(query),
    },
    {
      label: classifierLabels[ClassifierTypes.LEVEL],
      key: ClassifierTypes.LEVEL,
      route: slugs.classifiers(ClassifierTypes.LEVEL),
      endpoint: () => api.getSportBaseLevels(query),
    },
    {
      label: classifierLabels[ClassifierTypes.TECHNICAL_CONDITION],
      key: ClassifierTypes.TECHNICAL_CONDITION,
      route: slugs.classifiers(ClassifierTypes.TECHNICAL_CONDITION),
      endpoint: () => api.getSportBaseTechnicalConditions(query),
    },
    {
      label: classifierLabels[ClassifierTypes.SPACE_TYPE],
      key: ClassifierTypes.SPACE_TYPE,
      route: slugs.classifiers(ClassifierTypes.SPACE_TYPE),
      endpoint: () => api.getSportBaseSpaceTypes(query),
    },
    {
      label: classifierLabels[ClassifierTypes.SPORT_ORGANIZATION_TYPE],
      key: ClassifierTypes.SPORT_ORGANIZATION_TYPE,
      route: slugs.classifiers(ClassifierTypes.SPORT_ORGANIZATION_TYPE),
      endpoint: () => api.getTenantSportOrganizationTypes(query),
    },
    {
      label: classifierLabels[ClassifierTypes.LEGAL_FORMS],
      key: ClassifierTypes.LEGAL_FORMS,
      route: slugs.classifiers(ClassifierTypes.LEGAL_FORMS),
      endpoint: () => api.getTenantLegalForms(query),
    },
  ];

  const tab = tabs.find((_) => _.key === classifierType) || tabs[0];

  const { tableData, loading } = useTableData({
    name: tab.route,
    endpoint: tab.endpoint,
    mapData: (list) => list,
    dependencyArray: [filter, page, sortedColumn],
  });

  return (
    <TablePageLayout title={'Klasifikatoriai'}>
      <TabBar
        tabs={tabs}
        onClick={(tab: any) => {
          navigate(tab.route);
        }}
        isActive={(_: any) => _.key == tab.key}
      />
      <TableButtonsRow>
        <TableButtonsInnerRow>
          <DynamicFilter
            filters={filter}
            filterConfig={filterConfig(classifierColumns[tab.key])}
            rowConfig={rowConfig}
            onSetFilters={handleSetFilters}
            disabled={loading}
          />
        </TableButtonsInnerRow>
        <Button
          onClick={() =>
            navigate(
              tab.key === ClassifierTypes.SPORT_TYPE
                ? slugs.newSportType
                : slugs.newClassifier(tab.key),
            )
          }
        >
          {newClassifierLabels[tab.key]}
        </Button>
      </TableButtonsRow>
      <MainTable
        onColumnSort={(column) => {
          setSortedColumn(column);
        }}
        loading={loading}
        onClick={(id) =>
          navigate(
            tab.key === ClassifierTypes.SPORT_TYPE
              ? slugs.sportType(id)
              : slugs.classifier(tab.key, id),
          )
        }
        isFilterApplied={false}
        notFoundInfo={notFound}
        data={tableData}
        columns={classifierColumns[tab.key]}
      />
    </TablePageLayout>
  );
};

export default ClassifierList;
