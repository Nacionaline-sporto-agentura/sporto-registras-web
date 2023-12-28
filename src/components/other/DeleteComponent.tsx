import { useState } from 'react';
import styled from 'styled-components';
import { device } from '../../styles';
import { DeleteInfoProps } from '../../types';
import Button, { ButtonColors } from '../buttons/Button';
import Modal from '../layouts/Modal';
import DeleteCard from './DeleteCard';
import Icon, { IconName } from './Icons';

export const DeleteComponent = ({ deleteInfo }: { deleteInfo?: DeleteInfoProps }) => {
  const [showModal, setShowModal] = useState(false);

  if (!deleteInfo) return <></>;

  const {
    deleteDescriptionFirstPart,
    deleteDescriptionSecondPart,
    deleteName,
    deleteButtonText,
    deleteTitle,
    handleDelete,
  } = deleteInfo;

  if (!handleDelete) return <></>;

  return (
    <>
      <DeleteButtonContainer>
        <DeleteButton
          onClick={() => setShowModal(true)}
          variant={ButtonColors.TRANSPARENT}
          type="button"
          leftIcon={<StyledIcon name={IconName.deleteItem} />}
        >
          {deleteButtonText}
        </DeleteButton>
      </DeleteButtonContainer>
      <Modal onClose={() => setShowModal(false)} visible={showModal}>
        <DeleteCard
          onClose={() => setShowModal(false)}
          title={deleteTitle}
          descriptionFirstPart={deleteDescriptionFirstPart}
          descriptionSecondPart={deleteDescriptionSecondPart}
          deleteButtonText={deleteButtonText}
          name={deleteName}
          onClick={handleDelete}
        />
      </Modal>
    </>
  );
};

const DeleteButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  @media ${device.mobileL} {
    flex-direction: column;
  }
`;

const StyledIcon = styled(Icon)`
  cursor: pointer;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.danger};
`;

const DeleteButton = styled(Button)`
  border: 1px solid ${({ theme }) => theme.colors.danger};
  color: ${({ theme }) => theme.colors.danger};
`;
