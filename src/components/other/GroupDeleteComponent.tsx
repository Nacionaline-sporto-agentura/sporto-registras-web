import { isEmpty } from 'lodash';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { device } from '../../styles';
import { Group } from '../../types';
import api from '../../utils/api';
import { filterOutGroup, handleErrorToastFromServer } from '../../utils/functions';
import { slugs } from '../../utils/routes';
import {
  buttonsTitles,
  deleteDescriptionFirstPart,
  deleteDescriptionSecondPart,
  deleteTitles,
  descriptions,
  validationTexts,
} from '../../utils/texts';
import Button, { ButtonColors } from '../buttons/Button';
import DeleteButton from '../buttons/DeleteButton';
import RadioOptions from '../fields/RadioOptions';
import TreeSelectField from '../fields/TreeSelect';
import Modal from '../layouts/Modal';
import CloseIcon from './CloseIcon';
import FullscreenLoader from './FullscreenLoader';

interface AdditionalDeleteGroupComponentInterface {
  group?: Group;
}

const GroupDeleteComponent = ({ group }: AdditionalDeleteGroupComponentInterface) => {
  const { id, name } = group!;
  const [groupId, setGroupId] = useState();
  const [error, setError] = useState('');
  const [deleteWithUsers, setDeleteWithUsers] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleDeleteGroup = useMutation(
    () =>
      api.deleteGroup({
        id,
        ...(!!deleteWithUsers && { params: { moveToGroup: groupId } }),
      }),
    {
      onError: ({ response }) => {
        handleErrorToastFromServer(response);
      },
      onSuccess: () => {
        navigate(slugs.groups);
      },
    },
  );

  const isGroupWithUsers = group?.usersCount! > 0;

  const { isLoading, data: groups = [] } = useQuery(
    ['groupsForGroup', isGroupWithUsers],
    async () => filterOutGroup((await api.getGroupsOptions()).rows, id),
    {
      onError: ({ response }) => {
        handleErrorToastFromServer(response);
      },
      enabled: isGroupWithUsers,
    },
  );

  const renderAdditionalInfo = () => {
    if (isLoading) return <FullscreenLoader />;

    if (isEmpty(groups)) return <></>;

    return (
      <>
        <SmallDescription>{descriptions.deleteUsersWithGroup}</SmallDescription>
        <Row>
          <StyledRadioOptions
            options={[false, true]}
            getOptionLabel={(option) =>
              !!option ? 'Ištrinti visus narius' : 'Narius priskirti grupei'
            }
            value={deleteWithUsers}
            onChange={(option: boolean) => setDeleteWithUsers(option)}
          />
          {deleteWithUsers && (
            <StyledTreeSelectField
              name={`group`}
              options={groups}
              value={groupId}
              showError={false}
              error={error}
              onChange={(group) => setGroupId(group.id)}
            />
          )}
        </Row>
      </>
    );
  };

  const handleSubmit = async () => {
    if (deleteWithUsers && !groupId) return setError(validationTexts.error);

    await handleDeleteGroup.mutateAsync();
    setOpen(false);
  };

  return (
    <>
      <DeleteButton onClick={() => setOpen(true)} />
      <Modal onClose={setOpen} visible={open}>
        <Container tabIndex={0}>
          <CloseIcon onClick={() => setOpen(false)} />
          <Title>{deleteTitles.group}</Title>
          <Description>
            {deleteDescriptionFirstPart.delete} <Name>{name}</Name>{' '}
            {deleteDescriptionSecondPart.group}
          </Description>
          {renderAdditionalInfo()}
          <BottomRow>
            <Button
              onClick={() => setOpen(false)}
              variant={ButtonColors.TRANSPARENT}
              type="button"
              disabled={handleDeleteGroup.isLoading}
            >
              {buttonsTitles.cancel}
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              loading={handleDeleteGroup.isLoading}
              disabled={handleDeleteGroup.isLoading}
              variant={ButtonColors.DANGER}
            >
              {buttonsTitles.delete}
            </Button>
          </BottomRow>
        </Container>
      </Modal>
    </>
  );
};

const StyledTreeSelectField = styled(TreeSelectField)`
  width: 100%;
`;

const StyledRadioOptions = styled(RadioOptions)`
  padding-top: 0;
  div {
    margin: 0 0 8px 0;
  }
`;

const SmallDescription = styled.span`
  margin-top: 20px;
  font-size: 1.4rem;
  color: #4b5565;
  width: 100%;
  text-align: center;
  white-space: pre-line;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  background-color: #ffffff;
  box-shadow: 0px 18px 41px #121a5529;
  border-radius: 10px;
  padding: 40px 32px 32px 32px;
  display: flex;
  flex-direction: column;
  position: relative;

  @media ${device.mobileL} {
    padding: 40px 16px 32px 16px;
    width: 100%;
    height: 100%;
    justify-content: center;
    border-radius: 0px;
  }
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 22px;
  gap: 16px;
  width: 100%;
`;

const Title = styled.div`
  font-size: 2.4rem;
  text-align: center;
  font-weight: bold;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.error};
  width: 100%;
`;

const Description = styled.span`
  font-size: 1.6rem;
  color: #4b5565;
  width: 100%;
  text-align: center;
  white-space: pre-line;
`;

const Name = styled.span`
  font-size: 1.6rem;
  font-weight: bold;
  width: 100%;
  color: #4b5565;
`;

export default GroupDeleteComponent;
