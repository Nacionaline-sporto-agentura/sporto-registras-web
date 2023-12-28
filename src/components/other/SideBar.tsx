import { Link, matchPath, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import { device } from '../../styles';
import { useLogoutMutation } from '../../utils/hooks';
import { routes } from '../../utils/routes';
import Avatar from './Avatar';
import Icon, { IconName } from './Icons';
import Logo from './Logo';

interface ModuleMenuProps {
  className?: string;
}

const SideBar = ({ className }: ModuleMenuProps) => {
  const user = useAppSelector((state) => state.user.userData);
  const { mutateAsync } = useLogoutMutation();
  const currentLocation = useLocation();

  const renderTabs = () => {
    return (routes || [])
      .filter((route) => route.sidebar)
      .map((route) => {
        return (
          <Link to={route.slug} key={route.slug}>
            <Tab isActive={!!matchPath({ path: route.slug, end: false }, currentLocation.pathname)}>
              {route.name}
            </Tab>
          </Link>
        );
      });
  };
  return (
    <Header className={className}>
      <div>
        <TitleRow>
          <Logo />
        </TitleRow>

        {renderTabs()}
      </div>
      <BottomRow>
        <ProfileRow>
          <Link to={`/profilis`}>
            <InnerRow>
              <Avatar name={user?.firstName || ''} surname={user?.lastName || ''} />
              <UserInfo>
                <FullName>{`${user?.firstName} ${user?.lastName}`}</FullName>
                <Email>{user?.email}</Email>
              </UserInfo>
            </InnerRow>
          </Link>
          <div onClick={() => mutateAsync()}>
            <StyledLogoutIcon name={IconName.logout} />
          </div>
        </ProfileRow>
      </BottomRow>
    </Header>
  );
};

export default SideBar;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  top: 0;
  width: 300px;
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 18px 16px;
  height: 100%;
`;

const StyledLogoutIcon = styled(Icon)`
  color: rgb(255, 255, 255, 0.64);
  font-size: 2.5rem;
`;

const StyledCloseIcon = styled(Icon)`
  display: none;
  color: #bab2b0;
  font-size: 2.5rem;
  @media ${device.mobileXL} {
    display: block;
  }
`;

const UserInfo = styled.div`
  margin: 0 20px 0 8px;
`;

const FullName = styled.div`
  font-size: 1.4rem;
  max-width: 110px;
  font-weight: bold;
  color: #f7f8fa;
`;

const Email = styled.div`
  font-size: 1.2rem;
  color: rgb(255, 255, 255, 0.64);
`;

const InnerRow = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const ProfileRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  cursor: pointer;
`;

const BottomRow = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
`;

const TitleRow = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 30px;
`;

const Tab = styled.div<{ isActive: boolean }>`
  padding: 9px;
  color: #f7f8fa;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
  background-color: ${({ isActive }) => isActive && '#FFFFFF1F'};
  display: flex;
  justify-content: space-between;
  &:hover {
    background: #ffffff1f 0% 0% no-repeat padding-box;
  }
`;
