import { get, isEmpty } from 'lodash';
import { useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { sportBaseTabTitles } from '../../pages/SportBase';
import api from '../../utils/api';
import { descriptions, inputLabels } from '../../utils/texts';
import { sportBaseSpaceTabTitles } from '../containers/SportBaseSpace';
import Icon, { IconName } from './Icons';

export enum ActionTypes {
  REPLACE = 'replace',
  ADD = 'add',
  REMOVE = 'remove',
  TEST = 'test',
}

export interface Diff {
  op: ActionTypes;
  path: string;
  value: any;
  oldValue: any;
}

const getLabel = (diff: Diff, titles) => {
  let arr = diff.path.split('/').slice(1);
  if (diff.op == ActionTypes.REMOVE) {
    arr = arr.slice(0, -1);
  }

  let label: any[] = [];
  let tempTitles = { ...titles };
  let labelField = '';
  let dynamicFields = false;

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];

    if (!dynamicFields && !isNaN(parseFloat(item)) && isFinite(item as any)) {
      label = [...label, <strong>{arr[i]}</strong>, ` eilutėje `];
      continue;
    }
    const currentTitlesObject = tempTitles?.[item];

    dynamicFields = item === 'additionalValues';

    label = [...label, <strong>{`${currentTitlesObject?.name} `}</strong>];
    tempTitles = currentTitlesObject?.children;

    labelField = currentTitlesObject?.labelField;
  }

  const areAllKeysNumbers = (obj = {}) =>
    Object.keys(obj).every((key) => !isNaN(parseFloat(key)) && isFinite(key as any));

  const extractValue = (obj, labelField = '') => {
    return get(obj, labelField) || JSON.stringify(obj);
  };

  const extractValues = (obj = {}, labelField) => {
    if (Array.isArray(obj)) {
      return obj.map((item) => extractValue(item, labelField)).toString();
    } else if (typeof obj === 'object' && obj !== null) {
      return Object.values(obj)
        .map((item) => extractValue(item, labelField))
        .toString();
    } else {
      return extractValue(obj, labelField);
    }
  };

  const oldValue = dynamicFields
    ? extractValue(diff.oldValue, labelField)
    : areAllKeysNumbers(diff.oldValue)
    ? extractValues(diff.oldValue, labelField)
    : extractValue(diff.oldValue, labelField);

  const value = dynamicFields
    ? extractValue(diff.value, labelField)
    : areAllKeysNumbers(diff.value)
    ? extractValues(diff.value, labelField)
    : extractValue(diff.value, labelField);

  if (diff.op == ActionTypes.REPLACE) {
    label = [...label, ` pasikeitė iš ${oldValue} į ${value}`];
  }

  if (diff.op == ActionTypes.REMOVE) {
    label = [...label, ` pašalino `, oldValue];
  }

  if (diff.op == ActionTypes.ADD) {
    label = [...label, ` pridėjo `, value];
  }

  return label;
};

const HistoryContainer = ({
  diff,
  handleChange,
  data,
  spaceTypeIds,
  disabled,
}: {
  spaceTypeIds: number[];
  disabled: boolean;
  diff: Diff[];
  handleChange: any;
  data: any;
}) => {
  const { data: additionalFieldLabels } = useQuery(
    ['spaceTypeIds', spaceTypeIds],
    async () =>
      (await api.getFields({ query: { type: { $in: spaceTypeIds } } })).reduce(
        (obj, curr) => ({ ...obj, [curr.id]: { name: curr.field.title } }),
        {},
      ),
    { enabled: !isEmpty(spaceTypeIds) },
  );

  const titles = {
    name: { name: inputLabels.sportBaseName },
    photos: {
      name: inputLabels.photos,
      labelField: 'description',
      children: {
        representative: { name: inputLabels.representative },
        public: { name: inputLabels.public },
      },
    },
    address: { name: inputLabels.address },
    type: { name: inputLabels.type, labelField: 'name' },
    technicalCondition: { name: inputLabels.technicalCondition, labelField: 'name' },
    level: { name: inputLabels.level, labelField: 'name' },
    coordinates: {
      name: inputLabels.coordinates,
      children: {
        x: { name: inputLabels.coordinateX },
        y: { name: inputLabels.coordinateY },
      },
    },
    webPage: { name: inputLabels.website },
    plotNumber: { name: inputLabels.plotNumber },
    plotArea: { name: inputLabels.plotArea },
    builtPlotArea: { name: inputLabels.builtPlotArea },
    parkingPlaces: { name: inputLabels.parkingPlaces },
    dressingRooms: { name: inputLabels.dressingRooms },
    methodicalClasses: { name: inputLabels.methodicalClasses },
    saunas: { name: inputLabels.saunas },
    diningPlaces: { name: inputLabels.diningPlaces },
    accommodationPlaces: { name: inputLabels.accommodationPlaces },
    audienceSeats: { name: inputLabels.audienceSeats },
    disabledAccessible: { name: descriptions.disabledAccessible },
    blindAccessible: { name: descriptions.blindAccessible },
    publicWifi: { name: descriptions.publicWifi },
    plans: { labelField: 'name', name: descriptions.plans },
    owners: {
      labelField: 'name',
      name: sportBaseTabTitles.owners,
      children: {
        name: { name: inputLabels.jarName },
        code: { name: inputLabels.code },
        website: { name: inputLabels.website },
      },
    },
    investments: {
      labelField: 'source.name',
      name: sportBaseTabTitles.investments,
      children: {
        source: { name: inputLabels.source, labelField: 'name' },
        fundsAmount: { name: inputLabels.fundsAmount },
        appointedAt: { name: inputLabels.appointedAt },
      },
    },
    organizations: {
      labelField: 'name',
      name: sportBaseTabTitles.organizations,
      children: {
        name: { name: inputLabels.name },
        startAt: { name: inputLabels.startAt },
        endAt: { name: inputLabels.endAt },
      },
    },
    spaces: {
      labelField: 'name',
      name: sportBaseTabTitles.spaces,
      children: {
        name: { name: inputLabels.name },
        type: { name: inputLabels.type },
        sportTypes: { name: inputLabels.sportTypes, labelField: 'name' },
        photos: {
          name: inputLabels.photos,
          labelField: 'description',
          children: {
            representative: { name: inputLabels.representative },
            public: { name: inputLabels.public },
          },
        },
        technicalCondition: { name: inputLabels.technicalCondition, labelField: 'name' },
        buildingNumber: { name: inputLabels.buildingNumber },
        buildingArea: { name: inputLabels.buildingArea },
        energyClass: { name: inputLabels.energyClass },
        energyClassCertificate: { name: descriptions.energyClassCertificate },
        buildingType: { name: inputLabels.buildingType },
        buildingPurpose: { name: inputLabels.buildingPurpose },
        constructionDate: { name: inputLabels.constructionDate },
        latestRenovationDate: { name: inputLabels.latestRenovationDate },
        additionalValues: {
          name: sportBaseSpaceTabTitles.additionalFields,
          children: additionalFieldLabels,
        },
      },
    },
  };

  const [spreadOut, setSpreadOut] = useState(false);

  if (!spreadOut) {
    return (
      <SideBar $padding={'16px 8px'} $width={'40px'}>
        <IconContainer onClick={() => setSpreadOut(true)}>
          <ArrowIcon name={IconName.info} />
        </IconContainer>
      </SideBar>
    );
  }

  const handleAction = (currentItem: Diff) => {
    const formikPath = currentItem.path.replaceAll('/', '.').slice(1);

    if (currentItem.op == ActionTypes.REPLACE) {
      handleChange(formikPath, currentItem.oldValue);
    }
    const objectPath = formikPath.slice(0, -2);

    const index = formikPath.slice(-1)[0];

    if (currentItem.op == ActionTypes.REMOVE) {
      handleChange(objectPath, {
        ...get(data, objectPath),
        [index]: currentItem.oldValue,
      });
    }

    if (currentItem.op == ActionTypes.ADD) {
      handleChange(formikPath, undefined);
    }
  };

  return (
    <SideBar $padding={'16px'} $width={'320px'}>
      <Row>
        <Title>Veikla</Title>
        <IconContainer onClick={() => setSpreadOut(false)}>
          <ArrowIcon name={IconName.arrowRight} />
        </IconContainer>
      </Row>
      {diff.map((item, index) => {
        return (
          <Column key={`history-${index}`}>
            <Action>{getLabel(item, titles)}</Action>
            {!disabled && (
              <ContentRow onClick={() => handleAction(item)}>
                <StyledIcon name={IconName.close} />
                <div>Anuliuoti pakeitimą</div>
              </ContentRow>
            )}
            <Line />
          </Column>
        );
      })}
    </SideBar>
  );
};

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const ArrowIcon = styled(Icon)`
  font-size: 1.7rem;
  color: black;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const SideBar = styled.div<{ $width: string; $padding: string }>`
  position: absolute;
  width ${({ $width }) => $width};
  height: 100%;
  right: 0;
  top: 0;
  background-color: white;
  overflow-y: auto;
  padding: ${({ $padding }) => $padding};
`;

const Action = styled.div`
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 20px;
`;

const Title = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  line-height: 24px;
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  background-color: #eaeaef;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin: 16px 0;
  gap: 15px;
`;

const StyledIcon = styled(Icon)`
  font-size: 2rem;
`;

const ContentRow = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  display: grid;
  cursor: pointer;
  grid-template-columns: 20px 1fr;
`;

export default HistoryContainer;
