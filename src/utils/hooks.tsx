import { isEqual } from 'lodash';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { useAppDispatch } from '../state/hooks';
import { actions as userAction } from '../state/user/reducer';
import { User } from '../types';
import api from './api';
import { handleErrorToastFromServer } from './functions';
import { clearCookies, emptyUser, handleSetProfile } from './loginFunctions';
import { slugs } from './routes';

const cookies = new Cookies();

export const useLogoutMutation = () => {
  const dispatch = useAppDispatch();

  const { mutateAsync } = useMutation(() => api.logout(), {
    onError: ({ response }) => {
      handleErrorToastFromServer(response);
    },
    onSuccess: () => {
      clearCookies();
      dispatch(userAction.setUser(emptyUser));
    },
  });

  return { mutateAsync };
};

export const useWindowSize = (width: string) => {
  const [isInRange, setIsInRange] = useState(false);

  const handleResize = () => {
    const mediaQuery = window.matchMedia(width);
    setIsInRange(mediaQuery.matches);
  };

  useEffect(() => {
    handleResize();
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isInRange;
};

export const useCheckAuthMutation = () => {
  const dispatch = useAppDispatch();
  const token = cookies.get('token');

  const { isLoading } = useQuery([token], () => api.checkAuth(), {
    onError: ({ response }: any) => {
      if (isEqual(response.status, 401)) {
        clearCookies();
        dispatch(userAction.setUser(emptyUser));

        return;
      }

      return handleErrorToastFromServer(response);
    },
    onSuccess: (data: User) => {
      if (data) {
        handleSetProfile(data?.profiles);
        dispatch(userAction.setUser({ userData: data, loggedIn: true }));
      }
    },
    retry: false,
    enabled: !!token,
  });

  return { isLoading };
};

export const useSetPassword = () => {
  const [searchParams] = useSearchParams();
  const { h, s } = Object.fromEntries([...Array.from(searchParams)]);

  const { data, mutateAsync, isLoading } = useMutation(
    ({ password }: { password: string }) => {
      return api.setPassword({ h, s, password });
    },
    {
      onError: ({ response }) => {
        handleErrorToastFromServer(response);
      },
    },
  );

  return { isSuccess: data?.success, mutateAsync, isLoading };
};

export const useVerifyUser = () => {
  const [searchParams] = useSearchParams();
  const { h, s } = Object.fromEntries([...Array.from(searchParams)]);
  const navigate = useNavigate();

  if (!h || !s) {
    navigate(slugs.login);
  }

  const { data, isLoading } = useQuery(['verifyUser', s, h], () => api.verifyUser({ h, s }), {
    onError: () => {
      navigate(slugs.login);
    },
    retry: false,
  });

  return { data, isLoading };
};
