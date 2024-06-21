import { useState } from 'react';
import styled from 'styled-components';
import { device } from '../../styles';
import {
  actionButtonLabels,
  buttonColors,
  buttonsTitles,
  formActionLabels,
  inputLabels,
} from '../../utils/texts';
import Button, { ButtonColors } from '../buttons/Button';
import TextAreaField from '../fields/TextAreaField';
import Modal from '../layouts/Modal';
import Icon, { IconName } from './Icons';

interface FormPopupProps {
  status?: string;
  onClose: () => void;
  onSubmit: (props: any) => void;
  loading: boolean;
}

const FormPopUp = ({ status, onClose, onSubmit, loading }: FormPopupProps) => {
  const [comment, setComment] = useState('');

  const visible = !!status;
  return (
    <Modal onClose={onClose} visible={visible}>
      <Container>
        <IconContainer onClick={onClose}>
          <StyledCloseButton name={IconName.close} />
        </IconContainer>
        <Title>{formActionLabels[status!]}</Title>

        <TextAreaField
          label={inputLabels.comment}
          value={comment}
          rows={2}
          name={'comment'}
          onChange={(comment) => setComment(comment)}
        />

        <BottomRow>
          <Button
            disabled={loading}
            onClick={onClose}
            variant={ButtonColors.TRANSPARENT}
            height={32}
          >
            {buttonsTitles.cancel}
          </Button>
          <Button
            disabled={loading}
            loading={loading}
            onClick={() => onSubmit({ comment, status })}
            variant={buttonColors[status!]}
            height={32}
          >
            {actionButtonLabels[status!]}
          </Button>
        </BottomRow>
      </Container>
    </Modal>
  );
};

const Container = styled.div`
  background-color: white;
  border: 1px solid #dfdfdf;
  border-radius: 4px;
  padding: 20px;
  position: relative;
  height: fit-content;
  min-width: 600px;
  background-color: white;
  flex-basis: auto;
  margin: auto;

  @media ${device.mobileL} {
    min-width: 100%;
    min-height: 100%;
    border-radius: 0px;
  }

  @media ${device.mobileXL} {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

const StyledCloseButton = styled(Icon)`
  color: rgb(122, 126, 159);
  font-size: 2rem;
  @media ${device.mobileL} {
    display: none;
  }
`;

const IconContainer = styled.div`
  cursor: pointer;
  position: absolute;
  right: 9px;
  top: 9px;
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  gap: 16px;
`;

const Title = styled.div`
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #231f20;
`;

export default FormPopUp;
