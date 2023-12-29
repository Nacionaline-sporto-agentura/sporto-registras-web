import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { slugs } from '../../utils/routes';
import Icon, { IconName } from './Icons';

const ReturnToLogin = () => {
  const navigate = useNavigate();

  return (
    <Row onClick={() => navigate(slugs.login)}>
      <Icon name={IconName.returnArrow} />
      <BackButton> {'Grįžti į prisijungimo langą'}</BackButton>
    </Row>
  );
};

const BackButton = styled.div`
  font-size: 1.4rem;
  color: #121926;
  margin-left: 11px;
`;

const Row = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export default ReturnToLogin;
