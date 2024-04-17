import { format } from 'date-fns';
import { get, isEmpty } from 'lodash';
import React, { useRef, useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { sportBaseTabTitles } from '../../pages/SportBase';
import { FormHistory } from '../../types';
import api from '../../utils/api';
import { colorsByStatus } from '../../utils/constants';
import { formatDateAndTime } from '../../utils/functions';
import { useInfinityLoad } from '../../utils/hooks';
import {
  descriptions,
  inputLabels,
  requestFormHistoryDescriptions,
  requestStatusLabels,
} from '../../utils/texts';
import Button, { ButtonColors } from '../buttons/Button';
import { sportBaseSpaceTabTitles } from '../containers/SportBaseSpace';
import FullscreenLoader from './FullscreenLoader';
import Icon, { IconName } from './Icons';
import StatusTag from './StatusTag';

const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

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
      label = [...label, <BoldText>{arr[i]}</BoldText>, ` eilutėje `];
      continue;
    }
    const currentTitlesObject = tempTitles?.[item];

    dynamicFields = item === 'additionalValues';

    label = [...label, <BoldText>{`${currentTitlesObject?.name} `}</BoldText>];
    tempTitles = currentTitlesObject?.children;

    labelField = currentTitlesObject?.labelField;
  }

  const areAllKeysNumbers = (obj = {}) =>
    Object.keys(obj).every((key) => !isNaN(parseFloat(key)) && isFinite(key as any));

  const extractValue = (obj, labelField = '') => {
    if (labelField) return get(obj, labelField);

    if (dateTimeRegex.test(obj) && new Date(obj).toString() !== 'Invalid Date') {
      return format(new Date(obj), 'yyyy-MM-dd');
    }

    if (typeof obj === 'object') {
      return JSON.stringify(obj);
    }

    return obj;
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
  open,
  requestId,
  handleClear,
}: {
  spaceTypeIds: number[];
  disabled: boolean;
  diff: Diff[];
  handleChange: any;
  data: any;
  open: boolean;
  requestId: any;
  handleClear: () => void;
}) => {
  const observerRef = useRef(null);
  const { data: additionalFieldLabels } = useQuery(
    ['spaceTypeIds', spaceTypeIds],
    async () =>
      (await api.getFields({ query: { type: { $in: spaceTypeIds } } })).reduce(
        (obj, curr) => ({ ...obj, [curr.id]: { name: curr.field.title } }),
        {},
      ),
    { enabled: !isEmpty(spaceTypeIds) },
  );

  const { data: history, isFetching } = useInfinityLoad(
    'subscriptions',
    (data) => api.getRequestHistory({ ...data, id: requestId }),
    observerRef,
    {},
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
        companyCode: { name: inputLabels.code },
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

  const [isOpen, setIsOpen] = useState(open);

  if (!isOpen) {
    return (
      <SideBar $padding={'16px 8px'} $width={'40px'}>
        <IconContainer onClick={() => setIsOpen(true)}>
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
        <IconContainer onClick={() => setIsOpen(false)}>
          <ArrowIcon name={IconName.arrowRight} />
        </IconContainer>
      </Row>
      {!isEmpty(diff) && (
        <>
          <SubTitleRow>
            <SubTitle>{'Naujausia veikla'}</SubTitle>
            <Line />
          </SubTitleRow>
          {!disabled && (
            <StyledBUtton onClick={handleClear} variant={ButtonColors.TRANSPARENT}>
              Anuliuoti visus pakeitimus
            </StyledBUtton>
          )}
          <Container>
            {diff.map((item, index) => {
              return (
                <Column key={`changes-${index}`}>
                  <Text>{getLabel(item, titles)}</Text>
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
          </Container>
        </>
      )}
      <SubTitleRow>
        <SubTitle>{'Istorija'}</SubTitle>
        <Line />
      </SubTitleRow>
      <Container>
        {history?.pages.map((page: { data: FormHistory[] }, pageIndex: number) => {
          return (
            <React.Fragment key={pageIndex}>
              {page?.data.map((history, index) => {
                const createdBy = `${history?.createdBy?.firstName?.[0]}. ${history?.createdBy?.lastName}`;
                return (
                  <Column key={`history-${index}`}>
                    <HistoryRow>
                      <DateContainer>{formatDateAndTime(history.createdAt)}</DateContainer>
                      <StatusTag
                        label={requestStatusLabels[history.type]}
                        color={colorsByStatus[history.type]}
                      />
                    </HistoryRow>
                    <Text>
                      <BoldText>{createdBy}</BoldText>
                      {requestFormHistoryDescriptions[history.type]}
                    </Text>
                    {history?.comment && (
                      <Comment>
                        <Text>{history?.comment}</Text>
                      </Comment>
                    )}
                    <Line />
                  </Column>
                );
              })}
            </React.Fragment>
          );
        })}

        {isFetching && <FullscreenLoader />}
        {observerRef && <div ref={observerRef} />}
      </Container>
    </SideBar>
  );
};

const HistoryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledBUtton = styled(Button)`
  margin: 16px 0;
  border-color: ${({ theme }) => theme.colors.primary};
`;

const DateContainer = styled.div`
  font-size: 1.2rem;
  color: #697586;
`;

const Container = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

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
  min-width ${({ $width }) => $width};
  width ${({ $width }) => $width};
  background-color: white;
  overflow-y: auto;
  padding: ${({ $padding }) => $padding};
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  line-height: 24px;
`;
const SubTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 20px;
  white-space: nowrap;
  color: #697586;
`;

const SubTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 16px 0 8px 0;
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  background-color: #eaeaef;
`;

const Text = styled.div`
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 20px;
  color: #4b5565;
`;

const BoldText = styled.span`
  font-weight: 500;
  color: black;
  margin-right: 2px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin: 16px 0;
  gap: 15px;
`;

const Comment = styled.div`
  padding: 8px;
  border-radius: 4px 0px 0px 0px;
  background-color: #f8fafc;
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
