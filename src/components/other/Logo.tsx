import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Icon, { IconName } from './Icons';

const AppLogo = ({ className, isWhite = false }: any) => {
  const navigate = useNavigate();

  const logo = isWhite ? IconName.logoWhite : IconName.logoGreen;

  return (
    <LogoContainer className={className} onClick={() => navigate('/')}>
      <Logo name={logo} />
    </LogoContainer>
  );
};
const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  cursor: pointer;
  font-size: 2rem;
  font-weight: bold;
`;

const Logo = styled(Icon)`
  width: 100px;
`;

export default AppLogo;
