import React from 'react';
import { useParams } from 'react-router-dom';
import MainTable from '../components/tables/MainTable';
import { NotFoundInfoProps } from '../types';
import TablePageLayout from '../components/layouts/TablePageLayout';
import TabBar from '../components/Tabs/TabBar';
import { slugs } from '../utils/routes';
import api from '../utils/api';
import { TableButtonsInnerRow, TableButtonsRow } from '../styles/CommonStyles';
import DynamicFilter from '../components/other/DynamicFilter';
import { FilterInputTypes } from '../components/other/DynamicFilter/Filter';
import Button from '../components/buttons/Button';
import { ClassifierTypes } from '../utils/constants';
import { classifierLabels, newClassifierLabels } from '../utils/texts';
import { classifierColumns } from '../utils/columns';
import { useAppSelector } from '../state/hooks';
import { actions as filterActions } from '../state/filters/reducer';
import { useGenericTablePageHooks, useTableData } from '../utils/hooks';

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

  const handleSetFilters = (filters) => {
    if (classifierType) dispatch(filterActions.seClassifierFilters({ [classifierType]: filters }));
  };

  const tabs = [
    {
      label: classifierLabels[ClassifierTypes.SPORT_TYPE],
      key: ClassifierTypes.SPORT_TYPE,
      route: slugs.classifiers(ClassifierTypes.SPORT_TYPE),
      endpoint: () => api.getSportBaseSpaceSportTypes({ filter, page }),
    },
    {
      label: classifierLabels[ClassifierTypes.BUILDING_TYPE],
      key: ClassifierTypes.BUILDING_TYPE,
      route: slugs.classifiers(ClassifierTypes.BUILDING_TYPE),
      endpoint: () => api.getSportBaseSpaceBuildingTypes({ filter, page }),
    },
    {
      label: classifierLabels[ClassifierTypes.SPORTS_BASE_TYPE],
      key: ClassifierTypes.SPORTS_BASE_TYPE,
      route: slugs.classifiers(ClassifierTypes.SPORTS_BASE_TYPE),
      endpoint: () => api.getSportBaseTypes({ filter, page }),
    },
    {
      label: classifierLabels[ClassifierTypes.SOURCE],
      key: ClassifierTypes.SOURCE,
      route: slugs.classifiers(ClassifierTypes.SOURCE),
      endpoint: () => api.getSportBaseSources({ filter, page, query: {} }),
    },
    {
      label: classifierLabels[ClassifierTypes.LEVEL],
      key: ClassifierTypes.LEVEL,
      route: slugs.classifiers(ClassifierTypes.LEVEL),
      endpoint: () => api.getSportBaseLevels({ filter, page }),
    },
    {
      label: classifierLabels[ClassifierTypes.TECHNICAL_CONDITION],
      key: ClassifierTypes.TECHNICAL_CONDITION,
      route: slugs.classifiers(ClassifierTypes.TECHNICAL_CONDITION),
      endpoint: () => api.getSportBaseTechnicalConditions({ filter, page }),
    },
    {
      label: classifierLabels[ClassifierTypes.SPACE_TYPE],
      key: ClassifierTypes.SPACE_TYPE,
      route: slugs.classifiers(ClassifierTypes.SPACE_TYPE),
      endpoint: () => api.getSportBaseSpaceTypes({ filter, page, query: {} }),
    },
  ];

  const tab = tabs.find((_) => _.key === classifierType) || tabs[0];

  const { tableData, loading } = useTableData({
    name: tab.route,
    endpoint: tab.endpoint,
    mapData: (list) => list,
    dependencyArray: [filter, page],
  });

  return (
    <TablePageLayout title={'Klasifikatoriai'}>
      <TabBar
        tabs={tabs}
        onClick={(tab: any, index) => {
          navigate(tab.route);
        }}
        isActive={(_: any, index) => _.key == tab.key}
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
        <Button onClick={() => navigate(slugs.newClassifier(tab.key))}>
          {newClassifierLabels[tab.key]}
        </Button>
      </TableButtonsRow>
      <MainTable
        loading={loading}
        onClick={(id) => navigate(slugs.classifier(tab.key, id))}
        isFilterApplied={false}
        notFoundInfo={notFound}
        data={tableData}
        columns={classifierColumns[tab.key]}
      />
    </TablePageLayout>
  );
};

export default ClassifierList;
