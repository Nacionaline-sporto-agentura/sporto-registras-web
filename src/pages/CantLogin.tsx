import styled from 'styled-components';
import ReturnToLogin from '../components/other/ReturnToLogin';
import { Url } from '../styles/CommonStyles';
import { formLabels, url } from '../utils/texts';

export const CantLogin = () => {
  return (
    <Container>
      <Notification>
        <H1>{formLabels.notGrantedAccess}</H1>
        <Description>
          Kreipkitės į savo organizacijos atstovą, kad jis pridėtų Jus prie organizacijos.{' '}
          <StyledUrl target="_blank" href={url.readInstruction}>
            Skaityti instrukciją
          </StyledUrl>
        </Description>
        <Description>
          Jeigu kuriate naują organizaciją - kreipkitės į{' '}
          <Url target="_blank" href="mailto:info@ltusportas.lt">
            info@ltusportas.lt
          </Url>
          .
        </Description>
      </Notification>
      <ReturnToLogin />
    </Container>
  );
};

const StyledUrl = styled(Url)`
  color: ${({ theme }) => theme.colors.primary};
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Description = styled.div`
  font-size: 1.6rem;
  color: #666;
`;

const H1 = styled.h2`
  font-size: 1.5rem;
  margin: 0px;
  color: #333;
`;

const Notification = styled.div`
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
