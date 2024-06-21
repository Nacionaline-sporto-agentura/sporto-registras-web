import styled from 'styled-components';
import { device } from '../../styles';
import { StatusTypes } from '../../utils/constants';
import { buttonsTitles } from '../../utils/texts';
import Button, { ButtonColors } from './Button';

interface ButtonProps {
  handleChange: any;
  hideReturnButton?: boolean;
  disabled?: boolean;
}

const AdditionalButtons = ({ handleChange, disabled = false }: ButtonProps) => {
  return (
    <ButtonsRow>
      <ActionButton
        variant={ButtonColors.SUCCESS}
        height={32}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && handleChange(StatusTypes.APPROVED)}
      >
        {buttonsTitles.approve}
      </ActionButton>
      <ActionButton
        variant={ButtonColors.PRIMARY}
        height={32}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && handleChange(StatusTypes.RETURNED)}
      >
        {buttonsTitles.returnToCorrect}
      </ActionButton>
      <ActionButton
        variant={ButtonColors.DANGER}
        height={32}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && handleChange(StatusTypes.REJECTED)}
      >
        {buttonsTitles.reject}
      </ActionButton>
    </ButtonsRow>
  );
};

const ButtonsRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 5px;
  @media ${device.mobileM} {
    flex: 1;
    flex-direction: column;
    width: 100%;
  }
`;

const ActionButton = styled(Button)`
  @media ${device.mobileM} {
    width: 100%;
  }
`;

export default AdditionalButtons;
