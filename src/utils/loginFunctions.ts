import Cookies from 'universal-cookie';
import { UserReducerProps } from '../state/user/reducer';
import { Profile, ProfileId } from '../types';

const cookies = new Cookies();

interface UpdateTokenProps {
  token?: string;
  error?: string;
  message?: string;
  refreshToken?: string;
}

export const emptyUser: UserReducerProps = {
  userData: {},
  loggedIn: false,
};

export const handleSetProfile = (profiles?: Profile[]) => {
  const isOneProfile = profiles?.length === 1;
  const profileId = cookies.get('profileId');

  if (isOneProfile) {
    return handleSelectProfile(profiles[0].id);
  }

  if (profileId) {
    const hasProfile = profiles?.some((profile) => profile.id.toString() === profileId.toString());

    if (hasProfile) {
      handleSelectProfile(profileId);
    } else {
      cookies.remove('profileId', { path: '/' });
    }
  }
};

export const clearCookies = () => {
  cookies.remove('token', { path: '/' });
  cookies.remove('profileId', { path: '/' });
};

export const handleUpdateTokens = (data: UpdateTokenProps) => {
  const { token, refreshToken } = data;

  if (token) {
    cookies.set('token', `${token}`, {
      path: '/',
      expires: new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
    });
  }

  if (refreshToken) {
    cookies.set('refreshToken', `${refreshToken}`, {
      path: '/',
      expires: new Date(new Date().getTime() + 60 * 60 * 24 * 1000 * 30),
    });
  }
};

export const handleSelectProfile = (profileId: ProfileId) => {
  if (cookies.get('profileId')?.toString() === profileId?.toString()) return;

  cookies.set('profileId', `${profileId}`, {
    path: '/',
    expires: new Date(new Date().getTime() + 60 * 60 * 24 * 1000 * 30),
  });

  window.location.reload();
};
