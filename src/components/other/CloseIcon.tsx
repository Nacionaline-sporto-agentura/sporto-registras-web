import styled from 'styled-components';
import Icon, { IconName } from './Icons';

const CloseIcon = ({ onClick }) => (
  <IconContainer onClick={onClick}>
    <StyledIcon name={IconName.close} />
  </IconContainer>
);
const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  cursor: pointer;
  position: absolute;
  right: 9px;
  top: 9px;
  z-index: 5;
`;

const StyledIcon = styled(Icon)`
  font-size: 2.4rem;
  color: #697586;
`;
export default CloseIcon;
