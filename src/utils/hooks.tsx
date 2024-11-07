import { useCallback, useEffect, useState } from 'react';
import { useInfiniteQuery, useMutation, useQuery } from 'react-query';
import { matchPath, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { Tab } from '../components/Tabs/TabBar';

import _ from 'lodash';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { actions as userAction } from '../state/user/reducer';
import { TableData, TableDataProp, User } from '../types';
import api, { Populations } from './api';
import { intersectionObserverConfig } from './configs';
import { AdminRoleType, UserRoleType } from './constants';
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

  const { isLoading } = useQuery([token], () => api.getUserInfo(), {
    onError: ({ response }: any) => {
      dispatch(userAction.setUser(emptyUser));
      clearCookies();
      dispatch(userAction.setUser(emptyUser));
      return;

      return handleErrorToastFromServer(response);
    },
    onSuccess: async (data: User) => {
      if (data) {
        handleSetProfile(data?.profiles);
        dispatch(userAction.setUser({ userData: data, loggedIn: true }));
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!token,
  });

  return { isLoading: isLoading };
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
  const { id = '' } = useParams();
  const [searchParams] = useSearchParams();
  const { page } = Object.fromEntries([...Array.from(searchParams)]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  return { page, navigate, dispatch, location, id };
};

export const useGetCurrentRoute = (tabs: Tab[]) => {
  const currentLocation = useLocation();
  const tab =
    tabs.find((tab) => matchPath({ path: tab.slug || '', end: false }, currentLocation.pathname)) ||
    tabs[0];
  return tab;
};

export const useGetCurrentProfile = () => {
  const profiles = useAppSelector((state) => state.user.userData.profiles);
  const profileId = cookies.get('profileId');
  const currentProfile = profiles?.find((profile) => profile.id == profileId);
  return currentProfile;
};

const useCanManageChildren = () => {
  const currentProfile = useGetCurrentProfile();
  const user = useAppSelector((state) => state.user.userData);
  const isAdmin = user.type === AdminRoleType.ADMIN;

  return currentProfile?.data?.canHaveChildren || isAdmin;
};

export const useIsUser = () => {
  const user = useAppSelector((state) => state.user.userData);
  const isUser = user.type === AdminRoleType.USER;

  return isUser;
};

export const useGetPopulateFields = () => {
  const canHaveChildren = useCanManageChildren();

  return canHaveChildren ? [Populations.TENANT] : [];
};

export const useTableColumns = (defaultColumns) => {
  const canHaveChildren = useCanManageChildren();

  const childrenStatusColumn = { tenant: { label: 'Pateikė', show: true } };

  return canHaveChildren ? { ...defaultColumns, ...childrenStatusColumn } : defaultColumns;
};

export const useHasRole = (role) => {
  const currentProfile = useGetCurrentProfile();

  return currentProfile?.role === role;
};

export const useIsTenantAdmin = () => {
  return useHasRole(UserRoleType.ADMIN);
};

export const useIsTenantUser = () => {
  return useHasRole(UserRoleType.USER);
};

export const useInfinityLoad = (
  queryKey: string,
  fn: (params: { page: number }) => any,
  observerRef: any,
  filters = {},
  enabled = true,
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
    enabled,
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

export const useAutoSave = ({
  canAutoSave = true,
  changes,
  onSave,
  debounceMs = 20000,
}: {
  canAutoSave?: boolean;
  changes: any;
  onSave: (changes: any) => void;
  debounceMs?: number;
}) => {
  if (!canAutoSave) {
    return;
  }

  const [lastSavedChanges, setLastSavedChanges] = useState(null);

  const debouncedSubmit = useCallback(
    _.debounce((changes) => {
      onSave && onSave(changes);
      setLastSavedChanges(changes);
    }, debounceMs),
    [],
  );

  useEffect(() => {
    if (!_.isEmpty(changes) && !_.isEqual(changes, lastSavedChanges)) {
      debouncedSubmit(changes);
    }
  }, [changes, debouncedSubmit]);
};
