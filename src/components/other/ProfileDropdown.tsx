import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import { useGetCurrentProfile, useLogoutMutation } from '../../utils/hooks';
import { handleSelectProfile } from '../../utils/loginFunctions';
import { slugs } from '../../utils/routes';
import { buttonsTitles } from '../../utils/texts';
import Icon, { IconName } from './Icons';

const ProfilesDropdown = () => {
  const user = useAppSelector((state) => state.user.userData);
  const currentProfile = useGetCurrentProfile();
  const navigate = useNavigate();
  const [showSelect, setShowSelect] = useState(false);
  const { mutateAsync } = useLogoutMutation();

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setShowSelect(false);
    }
  };

  const handleProfileChange = (profileId) => {
    window.location.href = `/app/profiliai/${profileId}`;
    handleSelectProfile(profileId);
  };

  return (
    <Container tabIndex={1} onBlur={handleBlur}>
      <Select onClick={() => setShowSelect(!showSelect)}>
        <SelectContainer>
          <CurrentProfileName>{currentProfile?.name || '-'}</CurrentProfileName>
          <CurrentProfileEmail>{currentProfile?.email || user?.email}</CurrentProfileEmail>
        </SelectContainer>
        <DropdownIcon name={IconName.unfoldMore} />
      </Select>
      {showSelect && (
        <ProfilesContainer>
          <Profiles>{buttonsTitles.profiles}</Profiles>

          {user?.profiles?.map((profile, index) => {
            const selected = profile.id === currentProfile?.id;

            return (
              <ProfileContainer
                key={`profile-${index}`}
                onClick={() => {
                  handleProfileChange(profile.id);
                }}
                selected={selected}
              >
                <InnerProfileContainer>
                  <Name>{profile?.name || '-'}</Name>
                  <Email>{profile?.email || user?.email}</Email>
                </InnerProfileContainer>
                {selected && <SelectedIcon name={IconName.checkmark} />}
              </ProfileContainer>
            );
          })}
          <Hr />
          <Tab onClick={() => navigate(slugs.profile)}>
            <TabIconContainer>
              <TabIcon name={IconName.person} />
            </TabIconContainer>
            <Name>{buttonsTitles?.profile}</Name>
          </Tab>
          <Hr />
          <BottomRow onClick={() => mutateAsync()}>
            <StyledLogoutIcon name={IconName.exit} />
            <Name>{buttonsTitles.logout}</Name>
          </BottomRow>
        </ProfilesContainer>
      )}
    </Container>
  );
};

const StyledLogoutIcon = styled(Icon)`
  color: #121926;
  font-size: 2rem;
`;

const TabIconContainer = styled.div`
  margin: 0px 11px 0px 5px;
  display: flex;
  align-items: center;
`;

const InnerProfileContainer = styled.div`
  width: 100%;
`;

const TabIcon = styled(Icon)`
  color: #9aa4b2;
  font-size: 1.7rem;
`;

const BottomRow = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 9px;
`;

const Hr = styled.div`
  border-bottom: 1px solid #121a553d;
  opacity: 1;
  margin: 16px -16px;
`;

const Container = styled.div`
  position: relative;
  &:focus {
    outline: none;
  }
`;

const DropdownIcon = styled(Icon)`
  cursor: pointer;
  color: white;
  font-size: 2.5rem;
`;

const SelectedIcon = styled(Icon)`
  color: ${({ theme }) => theme.colors.primary};
`;

const Select = styled.div`
  cursor: pointer;
  min-width: 100%;
  height: 31px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SelectContainer = styled.div``;

const Name = styled.div`
  font-size: 1.4rem;
  color: #121926;
  line-height: 17px;
`;

const CurrentProfileName = styled.div`
  font-size: 1.4rem;
  line-height: 17px;
  letter-spacing: 0.28px;
  color: #f7f8fa;
`;

const CurrentProfileEmail = styled.div`
  font-size: 1.2rem;
  color: #bab2b0;
`;

const Email = styled.div`
  font-size: 1.2rem;
  color: #4b5565;
`;

const Profiles = styled.div`
  font-size: 1.2rem;
  color: #4b5565;
  margin-bottom: 16px;
`;

const ProfilesContainer = styled.div`
  z-index: 3;
  position: absolute;
  padding: 12px 16px;
  bottom: 40px;
  background-color: white;
  box-shadow: 0px 4px 15px #12192614;
  border: 1px solid #cdd5df;
  border-radius: 4px;
`;

const ProfileContainer = styled.div<{ selected: boolean }>`
  padding: 9px 12px;
  width: 100%;
  border-radius: 2px;
  border: 1px solid ${({ theme, selected }) => (selected ? theme.colors.primary : 'none')};
  display: flex;
  justify-content: space-between;
  :hover {
    background-color: ${({ theme }) => theme.colors.background};
    cursor: pointer;
  }
`;

const Tab = styled.div`
  padding: 9px 0px;
  margin: -12px 0px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  :hover {
    background-color: ${({ theme }) => theme.colors.background};
    cursor: pointer;
  }
`;

export default ProfilesDropdown;
