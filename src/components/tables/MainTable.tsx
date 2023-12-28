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
}: LoginLayoutProps) => {
  const isMobile = useWindowSize(device.mobileL);

  if (loading) return <FullscreenLoader />;

  return (
    <TableLayout data={data} pageName={pageName} loading={loading}>
      {isMobile ? (
        <MobileTable
          data={data?.data}
          columns={columns}
          onClick={onClick}
          tableRowStyle={tableRowStyle}
          notFoundInfo={notFoundInfo}
          isFilterApplied={isFilterApplied}
        />
      ) : (
        <DesktopTable
          data={data?.data}
          columns={columns}
          onClick={onClick}
          tableRowStyle={tableRowStyle}
          notFoundInfo={notFoundInfo}
          isFilterApplied={isFilterApplied}
        />
      )}
    </TableLayout>
  );
};

export default MainTable;
