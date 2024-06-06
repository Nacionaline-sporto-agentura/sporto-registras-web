import { isEmpty, map } from 'lodash';
import { useState } from 'react';
import styled from 'styled-components';
import { Columns, NotFoundInfoProps, TableRow } from '../../types';
import { TableItemWidth } from '../../utils/constants';
import { descriptions } from '../../utils/texts';
import FullscreenLoader from '../other/FullscreenLoader';
import Icon, { IconName } from '../other/Icons';
import NotFoundInfo from '../other/NotFoundInfo';

export interface DesktopTableProps {
  data?: TableRow[];
  columns: Columns;
  notFoundInfo: NotFoundInfoProps;
  tableRowStyle?: any;
  customPageName?: string;
  isFilterApplied?: boolean;
  onClick?: (id: string) => void;
  onColumnSort?: ({ key, direction }: { key: string; direction?: 'asc' | 'desc' }) => void;
  loading?: boolean;
}

const DesktopTable = ({
  data,
  columns,
  notFoundInfo,
  tableRowStyle,
  isFilterApplied = false,
  onColumnSort,
  onClick,
  loading,
}: DesktopTableProps) => {
  const keys = Object.keys(columns);
  const [sortedColumn, setSortedColumn] = useState<{
    key?: string;
    direction?: 'asc' | 'desc';
  }>({});

  const handleRowClick = (row: TableRow) => {
    if (onClick && row.id) {
      onClick(`${row.id}`);
    }
  };
  const handleColumnClick = (key) => {
    if (!onColumnSort) return;

    const direction =
      sortedColumn.key === key ? (sortedColumn?.direction === 'asc' ? 'desc' : 'asc') : 'asc';

    onColumnSort({ key, direction });

    setSortedColumn({
      key,
      direction,
    });
  };

  const GenerateTableContent = ({ data }) => {
    if (!isEmpty(data)) {
      return (
        <>
          {map(data, (row: TableRow, index: number) => (
            <TR
              $pointer={!!onClick}
              key={`tr-${index}`}
              onClick={() => handleRowClick(row)}
              style={tableRowStyle}
            >
              {keys.map((label, i: number) => {
                const item = row[label] || '-';
                const width = columns[label]?.width || TableItemWidth.LARGE;
                return (
                  <TD width={width} key={`tr-td-${i}`}>
                    {item}
                  </TD>
                );
              })}
            </TR>
          ))}
        </>
      );
    } else if (isFilterApplied) {
      return (
        <TR $pointer={false} $hide_border={true}>
          <TdSecond colSpan={keys.length}>{descriptions.tableNotFound}</TdSecond>
        </TR>
      );
    } else {
      return (
        <TR $pointer={false} $hide_border={true}>
          <TdSecond colSpan={keys.length}>
            <NotFoundInfo {...notFoundInfo} />
          </TdSecond>
        </TR>
      );
    }
  };

  return (
    <TableContainer>
      <Table>
        <THEAD>
          <TR $pointer={false}>
            {keys.map((key: any, i: number) => {
              const column = columns[key];
              const label = column?.label;
              const isSelectedKey = key === sortedColumn.key;
              const isSelectedUp = isSelectedKey && sortedColumn?.direction === 'asc';
              const isSelectedDown = isSelectedKey && sortedColumn?.direction === 'desc';

              return (
                <TH
                  $pointer={!!onColumnSort}
                  onClick={() => {
                    handleColumnClick(key);
                  }}
                  key={`large-th-${i}`}
                >
                  <LabelContainer>
                    {label}
                    {!!onColumnSort && (
                      <IconContainer>
                        <ArrowIconUp $isActive={isSelectedUp} name={IconName.tableArrowUp} />
                        <ArrowIconDown $isActive={isSelectedDown} name={IconName.tableArrowDown} />
                      </IconContainer>
                    )}
                  </LabelContainer>
                </TH>
              );
            })}
          </TR>
        </THEAD>

        <StyledTbody>
          {loading ? <FullscreenLoader /> : <GenerateTableContent data={data} />}
        </StyledTbody>
      </Table>
    </TableContainer>
  );
};

const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ArrowIconUp = styled(Icon)<{ $isActive: boolean }>`
  opacity: ${({ $isActive }) => ($isActive ? '1' : '0.4')};
`;

const ArrowIconDown = styled(Icon)<{ $isActive: boolean }>`
  margin-top: -6px;
  opacity: ${({ $isActive }) => ($isActive ? '1' : '0.4')};
`;

const LabelContainer = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const StyledTbody = styled.tbody``;

const TableContainer = styled.div`
  width: 100%;
`;

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
`;

const TD = styled.td<{ width: string }>`
  padding: 6px 22px;
  height: 44px;
  text-align: left;
  font-size: 1.4rem;
  color: #121926;
`;

const TH = styled.th<{
  $pointer: boolean;
}>`
  padding: 18px 22px;
  height: 44px;
  text-align: left;
  font-size: 1.2rem;
  font-weight: bold;
  letter-spacing: 0.29px;
  color: #9aa4b2;
  cursor: ${({ $pointer }) => ($pointer ? 'pointer' : 'default')};
`;

const TdSecond = styled.td`
  padding: 13px 12px;
  text-align: left;
  font-size: 1.4rem;
  color: #121926;
`;

const THEAD = styled.thead`
  width: 100%;
`;

const TR = styled.tr<{
  $hide_border?: boolean;
  $pointer: boolean;
}>`
  border: none;
  border-bottom: ${({ $hide_border }) => ($hide_border ? 'none' : '1px solid #cdd5df')};
  cursor: ${({ $pointer }) => ($pointer ? 'pointer' : 'default')};
  white-space: nowrap;
  &:nth-child(even) {
    background-color: #f8fafc;
  }
`;

export default DesktopTable;
