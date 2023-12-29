import { isEqual } from 'lodash';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { matchPath, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { Tab } from '../components/other/TabBar';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { actions as userAction } from '../state/user/reducer';
import { TableData, TableDataProp, User } from '../types';
import api from './api';
import { AdminRoleType } from './constants';
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

  const profileMutation = useMutation(api.getProfiles, {
    onSuccess: (data) => {
      handleSetProfile(data);
    },
  });

  const { isLoading } = useQuery([token], () => api.getUserInfo(), {
    onError: ({ response }: any) => {
      if (isEqual(response.status, 401)) {
        clearCookies();
        dispatch(userAction.setUser(emptyUser));

        return;
      }

      return handleErrorToastFromServer(response);
    },
    onSuccess: async (data: User) => {
      if (data) {
        const profiles = await profileMutation.mutateAsync();
        dispatch(userAction.setUser({ userData: { ...data, profiles: profiles }, loggedIn: true }));
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!token,
  });

  return { isLoading: isLoading || profileMutation.isLoading };
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

export const useEGatesSign = () => {
  const { mutateAsync, isLoading } = useMutation(api.eGatesSign, {
    onError: ({ response }) => {
      handleErrorToastFromServer(response);
    },
    onSuccess: ({ url }) => {
      window.location.replace(url);
    },
    retry: false,
  });

  return { isLoading, mutateAsync };
};

export const useTableData = ({ endpoint, mapData, dependencyArray, name }: TableDataProp) => {
  const [tableData, setTableData] = useState<TableData>({ data: [] });

  const { isFetching } = useQuery([name, ...dependencyArray], () => endpoint(), {
    onError: ({ response }) => {
      handleErrorToastFromServer(response);
    },
    onSuccess: (list) => {
      setTableData({
        data: mapData(list?.rows || []),
        totalPages: list?.totalPages,
      });
    },
  });

  return { tableData, loading: isFetching };
};

export const useGenericTablePageHooks = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { page } = Object.fromEntries([...Array.from(searchParams)]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  return { page, navigate, dispatch, location, id };
};

export const useGetCurrentRoute = (tabs: Tab[]) => {
  const currentLocation = useLocation();

  return tabs.find((tab) => matchPath({ path: tab.slug, end: false }, currentLocation.pathname));
};

export const useGetCurrentProfile = () => {
  const profiles = useAppSelector((state) => state.user.userData.profiles);
  const profileId = cookies.get('profileId');
  const currentProfile = profiles?.find((profile) => profile.id == profileId);
  return currentProfile;
};

export const useIsTenantAdmin = () => {
  const currentProfile = useGetCurrentProfile();

  return currentProfile?.role === AdminRoleType.ADMIN;
};
