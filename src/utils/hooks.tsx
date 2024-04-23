import { useEffect, useState } from 'react';
import { useInfiniteQuery, useMutation, useQuery } from 'react-query';
import { matchPath, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { Tab } from '../components/Tabs/TabBar';

import { useAppDispatch, useAppSelector } from '../state/hooks';
import { actions as userAction } from '../state/user/reducer';
import { TableData, TableDataProp, User } from '../types';
import api from './api';
import { intersectionObserverConfig } from './configs';
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
      cookies.remove('refreshToken', { path: '/' });
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
export const useCheckUserInfo = () => {
  const dispatch = useAppDispatch();
  const token = cookies.get('token');

  const profileMutation = useMutation(api.getProfiles, {
    onSuccess: (data) => {
      handleSetProfile(data);
    },
  });

  const { isLoading } = useQuery([token], () => api.getUserInfo(), {
    onError: ({ response }: any) => {
      clearCookies();
      dispatch(userAction.setUser(emptyUser));

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

  return tabs.find((tab) =>
    matchPath({ path: tab.slug || '', end: false }, currentLocation.pathname),
  );
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

export const useInfinityLoad = (
  queryKey: string,
  fn: (params: { page: number }) => any,
  observerRef: any,
  filters = {},
) => {
  const queryFn = async (page: number) => {
    const data = await fn({
      ...filters,
      page,
    });
    return {
      ...data,
      data: data.rows,
    };
  };

  const result = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: ({ pageParam }: any) => queryFn(pageParam),
    getNextPageParam: (lastPage: any) => {
      return lastPage?.page < lastPage?.totalPages ? lastPage.page + 1 : undefined;
    },
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = result;
  useEffect(() => {
    const currentObserver = observerRef.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, intersectionObserverConfig);

    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, data, observerRef]);

  return result;
};
