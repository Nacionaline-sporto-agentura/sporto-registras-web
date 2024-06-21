import { format } from 'date-fns';
import { get, isEmpty } from 'lodash';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { FormHistory } from '../../types';
import api from '../../utils/api';
import { colorsByStatus } from '../../utils/constants';
import { formatDateAndTime } from '../../utils/functions';
import { useInfinityLoad } from '../../utils/hooks';
import { requestFormHistoryDescriptions, requestStatusLabels } from '../../utils/texts';
import Button, { ButtonColors } from '../buttons/Button';
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

const getLabel = (diff: Diff, titles, oldData) => {
  let arr = diff.path.split('/').slice(1);

  if (diff.op == ActionTypes.REMOVE) {
    arr = arr.slice(0, -1);
  }

  let label: any[] = [];
  let tempTitles = { ...titles };
  let labelField = '';
  let key = '';

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    key += arr[i] + '.';

    const currentTitlesObject = tempTitles?.[item];

    if (!currentTitlesObject) {
      label = [...label, get(oldData, key + labelField), ' '];
      continue;
    }

    label = [...label, <BoldText key={key}>{`${currentTitlesObject?.name} `}</BoldText>];
    tempTitles = currentTitlesObject?.children;
    labelField = currentTitlesObject?.labelField;
  }

  const extractValue = (obj, labelField = '') => {
    if (labelField) {
      const labelFields = labelField.split(' ');
      const value = get(obj, labelFields[0]);

      if (typeof value === 'object') {
        return Object.values(value).map((val) => get(val, labelFields[1]));
      }

      return value;
    }

    if (dateTimeRegex.test(obj) && new Date(obj).toString() !== 'Invalid Date') {
      return format(new Date(obj), 'yyyy-MM-dd');
    }

    if (typeof obj === 'object') {
      return JSON.stringify(obj);
    }

    return obj.toString();
  };

  const extractValues = (obj = {}, labelField) => {
    const mapValue = (value, index, arr) =>
      `${extractValue(value, labelField)}${index < arr.length - 1 ? ', ' : ''}`;

    if (Array.isArray(obj)) {
      return obj.map(mapValue).join('');
    } else if (typeof obj === 'object' && obj !== null) {
      return Object.values(obj).map(mapValue);
    } else {
      return extractValue(obj, labelField);
    }
  };

  const areAllKeysObjects = (obj = {}) =>
    Object.values(obj).every((val) => typeof val === 'object');

  const extractAndFormat = (diff, labelField) => {
    const extractFunc = areAllKeysObjects(diff) ? extractValues : extractValue;
    return extractFunc(diff, labelField);
  };

  const oldValue = extractAndFormat(diff?.oldValue || '', labelField);
  const value = extractAndFormat(diff.value || '', labelField);

  if (diff.op == ActionTypes.REPLACE) {
    label = [...label, ` pasikeitė iš ${oldValue} į ${value}`];
  }

  if (diff.op == ActionTypes.REMOVE) {
    label = [...label, ` pašalino `, oldValue];
  }

  if (diff.op == ActionTypes.ADD) {
    label = [...label, ` pridėjo `, <BreakWord key={`break-word-${key}`}>{value}</BreakWord>];
  }

  return label;
};

const HistoryContainer = ({
  diff,
  handleChange,
  data,
  oldData,
  titles,
  disabled,
  open,
  requestId,
  handleClear,
}: {
  titles: { [key: string]: any };
  disabled: boolean;
  diff: Diff[][];
  handleChange: any;
  data: any;
  oldData?: any;
  open: boolean;
  requestId: any;
  handleClear: () => void;
}) => {
  const observerRef = useRef(null);

  const { data: history, isFetching } = useInfinityLoad(
    `requestHistory-${requestId}`,
    (data) => api.getRequestHistory({ ...data, id: requestId }),
    observerRef,
    {},
    !!requestId,
  );

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

    const formikPathArray = formikPath.split('.');
    const objectPath = formikPathArray.slice(0, -1).join('.');

    const index = formikPathArray.slice(-1)[0];

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
              const lastItemIndex = item.length - 1;

              console.log(item[lastItemIndex], 'item[lastItemIndex]');
              return (
                <Column key={`history-changes-${index}`}>
                  <Text> {getLabel(item[lastItemIndex], titles, oldData)}</Text>
                  {!disabled && (
                    <ContentRow onClick={() => handleAction(item[lastItemIndex])}>
                      <StyledIcon name={IconName.close} />
                      <div>{lastItemIndex ? 'Atstatyti' : 'Atstatyti į pradinę būseną'}</div>
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
            <React.Fragment key={`history-${pageIndex}`}>
              {page?.data.map((history, index) => {
                const createdBy = `${history?.createdBy?.firstName?.[0]}. ${history?.createdBy?.lastName}`;
                return (
                  <Column key={`inner-history-${index}`}>
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

const BreakWord = styled.div`
  word-break: break-word;
`;

export default HistoryContainer;
