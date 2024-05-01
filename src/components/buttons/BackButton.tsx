import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { buttonsTitles } from '../../utils/texts';
import Icon, { IconName } from '../other/Icons';
import Button, { ButtonColors } from './Button';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <StyledButton
      onClick={() => {
        navigate(-1);
      }}
      leftIcon={<StyledBackIcon name={IconName.back} />}
      variant={ButtonColors.TRANSPARENT}
      type="button"
      height={32}
    >
      {buttonsTitles.goToBack}
    </StyledButton>
  );
};

const StyledButton = styled(Button)`
  width: fit-content;
  padding: 0;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
`;

const StyledBackIcon = styled(Icon)`
  cursor: pointer;
  margin-right: 4px;
  font-size: 1.6rem;
  align-self: center;
  color: ${({ theme }) => theme.colors.primary};
`;

export default BackButton;
