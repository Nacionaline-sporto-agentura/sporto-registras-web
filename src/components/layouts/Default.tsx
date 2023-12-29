import { ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import { device } from '../../styles';
import { useWindowSize } from '../../utils/hooks';
import MobileNavbar from '../other/MobileNavBar';
import SideBar from '../other/SideBar';

export interface DefaultLayoutProps {
  children?: JSX.Element;
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  const isTablet = useWindowSize(device.mobileXL);

  return (
    <Container>
      {isTablet ? <MobileNavbar /> : <SideBar />}

      <ToastContainer />
      <Content>{children}</Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  @media ${device.mobileXL} {
    flex-direction: column;
  }
  @media ${device.mobileL} {
    overflow-y: auto;
    height: 100svh; //fixes iOS Safari floating address bar problem
  }
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

export default DefaultLayout;
