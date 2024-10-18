import { TableRow } from '../../types';
import { Fragment, useState } from 'react';
import Icon from '../other/Icons';
import styled from 'styled-components';
import { isEmpty } from 'lodash';
import { TableItemWidth } from '../../utils/constants';

interface MobileTableRowProps {
  row: TableRow;
  index: number;
  onClick?: (id: string) => void;
  tableRowStyle: any;
  mainLabels: any;
  columns: any;
}

const MobileTableRow = ({
  row,
  index,
  onClick = () => {},
  tableRowStyle,
  mainLabels,
  columns,
}: MobileTableRowProps) => {
  const keys = Object.keys(columns);
  const isFirstSmallColumn = columns[keys[0]].width === TableItemWidth.SMALL;
  const mainLabelsLength = isFirstSmallColumn ? 3 : 2;
  const restLabels = Object.keys(columns || {}).slice(mainLabelsLength);
  const [expand, setExpand] = useState(false);

  const handleRowClick = (row: TableRow) => {
    if (onClick && row.id) {
      onClick(`${row.id}`);
    }
  };

  return (
    <MainTR
      hasSmallColumnLabel={isFirstSmallColumn}
      expandable={true}
      $pointer={!!onClick}
      key={`tr-${index}`}
      index={index}
      onClick={() => handleRowClick(row)}
      style={tableRowStyle}
    >
      <RowTD>
        {!isEmpty(restLabels) && (
          <StyledIconContainer
            onClick={(e) => {
              e.stopPropagation();
              setExpand(!expand);
            }}
          >
            <StyledIcon expanded={expand} name={'dropdownArrow'} />
          </StyledIconContainer>
        )}
      </RowTD>
      {mainLabels?.map((label: any, i: number) => {
        return <TD key={`tr-td-${i}`}>{row?.[label] || '-'}</TD>;
      })}

      {expand &&
        restLabels.map((column: any, i: number) => {
          const expandedItem = (
            <ExpandedColumnContainer key={`tr-td-${i}`}>
              <ExpandedColumnName>{columns[column].label || ' '}</ExpandedColumnName>
              <ExpandedColumnValue>{row[column] || '-'}</ExpandedColumnValue>
            </ExpandedColumnContainer>
          );

          if (i % 2 == 0 && isFirstSmallColumn) {
            return (
              <Fragment key={`fragment-${i}`}>
                <RowTD />
                <RowTD />
                {expandedItem}
              </Fragment>
            );
          }

          if (i % 2 == 0) {
            return (
              <Fragment key={`fragment-${i}`}>
                <RowTD />
                {expandedItem}
              </Fragment>
            );
          }
          return expandedItem;
        })}
    </MainTR>
  );
};

export default MobileTableRow;

const TD = styled.td`
  text-align: left;
  font-size: 1.4rem;
  color: #121926;
  padding: 12px 0;
`;

const ExpandedColumnName = styled.div`
  font-size: 1.2rem;
  color: #697586;
`;

const ExpandedColumnValue = styled.div`
  text-align: left;
  font-size: 1.4rem;
  color: #121926;
`;

const ExpandedColumnContainer = styled.td`
  display: flex;
  flex-direction: column;
  gap: 0px;
  margin-bottom: 6px;
`;

const RowTD = styled.td`
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: left;
  width: 32px;
`;

const MainTR = styled.tr<{
  index: number;
  $hide_border?: boolean;
  hasSmallColumnLabel?: boolean;
  $pointer: boolean;
  expandable: boolean;
}>`
  width: 100%;
  border: none !important;
  display: grid;
  grid-template-columns: 32px 40px 1fr 1fr;
  align-items: center;

  ${({ expandable, hasSmallColumnLabel }) =>
    expandable &&
    `
    display: grid;
    grid-template-columns: 32px ${hasSmallColumnLabel ? '40px' : ''}  1fr 1fr;
    align-items: center;
  `}

  border-bottom: ${({ $hide_border }) => ($hide_border ? 'none' : '1px solid #cdd5df')} !important;
  cursor: ${({ $pointer }) => ($pointer ? 'pointer' : 'default')};

  ${({ index, theme }) => index % 2 !== 0 && `background-color: ${theme.colors.background};`}
`;

const StyledIcon = styled(Icon)<{ expanded: boolean }>`
  color: #cdd5df;
  font-size: 2.4rem;
  transform: ${({ expanded }) => (expanded ? 'rotate(180deg)' : 'rotate(0)')};
`;

const StyledIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
