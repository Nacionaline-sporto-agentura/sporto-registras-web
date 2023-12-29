import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Logo = ({ className }: any) => {
  const navigate = useNavigate();

  return (
    <Container onClick={() => navigate('/')} className={className}>
      <Title>Sporto registras</Title>
    </Container>
  );
};
const Container = styled.div`
  display: flex;
  gap: 4px;
  flex-direction: column;
  margin-bottom: 20px;
`;

const Title = styled.div`
  font-size: 3.2rem;
  font-weight: bold;
  color: white;
`;

export default Logo;
