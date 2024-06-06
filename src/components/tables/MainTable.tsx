import { device } from '../../styles';
import { Columns, NotFoundInfoProps, TableData } from '../../types';
import { useWindowSize } from '../../utils/hooks';
import FullscreenLoader from '../other/FullscreenLoader';
import TableLayout from './components/TableLayout';
import DesktopTable from './DesktopTable';
import MobileTable from './MobileTable';

export interface LoginLayoutProps {
  data?: TableData;
  columns: Columns;
  notFoundInfo: NotFoundInfoProps;
  onClick?: (id: string) => void;
  tableRowStyle?: any;
  pageName?: string;
  isFilterApplied?: boolean;
  loading?: boolean;
  hidePagination?: boolean;
  onColumnSort?: ({ key, direction }: { key: string; direction?: 'asc' | 'desc' }) => void;
}

const MainTable = ({
  data,
  columns,
  notFoundInfo,
  onClick,
  tableRowStyle,
  pageName,
  loading,
  isFilterApplied = false,
  hidePagination = false,
  onColumnSort,
}: LoginLayoutProps) => {
  const isMobile = useWindowSize(device.mobileL);

  return (
    <TableLayout hidePagination={hidePagination} data={data} pageName={pageName} loading={loading}>
      {isMobile ? (
        <MobileTable
          data={data?.data}
          columns={columns}
          onClick={onClick}
          tableRowStyle={tableRowStyle}
          notFoundInfo={notFoundInfo}
          isFilterApplied={isFilterApplied}
          onColumnSort={onColumnSort}
          loading={loading}
        />
      ) : (
        <DesktopTable
          data={data?.data}
          columns={columns}
          onClick={onClick}
          tableRowStyle={tableRowStyle}
          notFoundInfo={notFoundInfo}
          isFilterApplied={isFilterApplied}
          onColumnSort={onColumnSort}
          loading={loading}
        />
      )}
    </TableLayout>
  );
};

export default MainTable;
