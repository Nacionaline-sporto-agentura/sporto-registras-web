import styled from 'styled-components';
import { device } from '../../styles';
import Icon, { IconName } from '../other/Icons';
import Modal from './Modal';

const Popup = ({ children, onClose, visible = true, title }: any) => {
  return (
    <Modal visible={visible} onClose={onClose}>
      <Container>
        <Row>
          {title && <Title>{title}</Title>}
          <IconContainer onClick={onClose}>
            <StyledIcon name={IconName.close} />
          </IconContainer>
        </Row>
        <div>{children}</div>
      </Container>
    </Modal>
  );
};

const StyledIcon = styled(Icon)`
  cursor: pointer;
  font-size: 2rem;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Container = styled.div<{ width?: string }>`
  background-color: white;
  border: 1px solid #dfdfdf;
  border-radius: 4px;
  position: relative;
  height: fit-content;
  min-width: 440px;
  padding: 24px;
  width: ${({ width }) => width};

  background-color: white;
  flex-basis: auto;
  margin: auto;

  @media ${device.mobileL} {
    min-width: 100%;
    min-height: 100%;
    border-radius: 0px;
  }
`;

const IconContainer = styled.div`
  width: fit-content;
  margin-left: auto;
`;
const Title = styled.div`
  font-size: 2rem;
  font-weight: 600;
  line-height: 24.2px;
`;

export default Popup;
