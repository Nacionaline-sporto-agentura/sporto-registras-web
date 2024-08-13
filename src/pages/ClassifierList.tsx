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

  function getTab(type: ClassifierTypes, endpointFn: Function) {
    return {
      label: classifierLabels[type],
      key: type,
      route: slugs.classifiers(type),
      endpoint: () => endpointFn(query),
    };
  }

  const tabs = [
    getTab(ClassifierTypes.SPORT_TYPE, api.getSportTypes),
    getTab(ClassifierTypes.SPORTS_BASE_SPACE_GROUP, api.getSportBaseSpaceGroups),
    getTab(ClassifierTypes.SPORTS_BASE_TYPE, api.getSportBaseTypes),
    getTab(ClassifierTypes.SOURCE, api.getSportBaseSources),
    getTab(ClassifierTypes.LEVEL, api.getSportBaseLevels),
    getTab(ClassifierTypes.TECHNICAL_CONDITION, api.getSportBaseTechnicalConditions),
    getTab(ClassifierTypes.SPORT_ORGANIZATION_TYPE, api.getTenantSportOrganizationTypes),
    getTab(ClassifierTypes.LEGAL_FORMS, api.getTenantLegalForms),
    getTab(ClassifierTypes.NATIONAL_TEAM_AGE_GROUP, api.getNationalTeamAgeGroups),
    getTab(ClassifierTypes.NATIONAL_TEAM_GENDER, api.getNationalTeamGenders),
    getTab(ClassifierTypes.WORK_RELATIONS, api.getWorkRelations),
    getTab(ClassifierTypes.COMPETITION_TYPE, api.getCompetitionTypes),
    getTab(ClassifierTypes.VIOLATIONS_ANTI_DOPING, api.getViolationsAntiDopingTypes),
    getTab(ClassifierTypes.ORGANIZATION_BASIS, api.getOrganizationBasis),
    getTab(ClassifierTypes.RESULT_TYPE, api.getResultTypes),
  ];

  const tab = tabs.find((_) => _.key === classifierType) || tabs[0];

  const { tableData, loading } = useTableData({
    name: tab.route,
    endpoint: tab.endpoint,
    mapData: (list) => list,
    dependencyArray: [filter, page, sortedColumn],
  });

  const getNewUrl = () => {
    const urlMap = {
      [ClassifierTypes.SPORT_TYPE]: slugs.newSportType,
      [ClassifierTypes.SPORTS_BASE_SPACE_GROUP]: slugs.newSportsBaseSpaceGroup,
    };

    return urlMap[tab.key] || slugs.newClassifier(tab.key);
  };

  const getUrl = (id) => {
    const urlMap = {
      [ClassifierTypes.SPORT_TYPE]: slugs.sportType(id),
      [ClassifierTypes.SPORTS_BASE_SPACE_GROUP]: slugs.sportsBaseSpaceGroup(id),
    };

    return urlMap[tab.key] || slugs.classifier(tab.key, id);
  };

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
        <Button onClick={() => navigate(getNewUrl())}>{newClassifierLabels[tab.key]}</Button>
      </TableButtonsRow>
      <MainTable
        onColumnSort={(column) => {
          setSortedColumn(column);
        }}
        loading={loading}
        onClick={(id) => navigate(getUrl(id))}
        isFilterApplied={false}
        notFoundInfo={notFound}
        data={tableData}
        columns={classifierColumns[tab.key]}
      />
    </TablePageLayout>
  );
};

export default ClassifierList;
