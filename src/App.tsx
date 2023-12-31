import { isEqual } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { Navigate, Outlet, Route, Routes, useLocation, useSearchParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from 'styled-components';
import Cookies from 'universal-cookie';
import DefaultLayout from './components/layouts/Default';
import LoginLayout from './components/layouts/Login';
import FullscreenLoader from './components/other/FullscreenLoader';
import CreatePassword from './pages/CreatePassword';
import ForgotPassword from './pages/ForgotPassword';
import { Login } from './pages/Login';
import Profiles from './pages/Profiles';
import ResetPassword from './pages/ResetPassword';
import { useAppSelector } from './state/hooks';
import { GlobalStyle, theme } from './styles';
import api from './utils/api';
import { AdminRoleType } from './utils/constants';
import { handleErrorToastFromServer } from './utils/functions';
import { useCheckAuthMutation } from './utils/hooks';
import { handleUpdateTokens } from './utils/loginFunctions';
import { slugs, useFilteredRoutes } from './utils/routes';
const cookies = new Cookies();

function App() {
  const loggedIn = useAppSelector((state) => state.user.loggedIn);
  const location = useLocation();
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const { ticket } = Object.fromEntries([...Array.from(searchParams)]);

  const routes = useFilteredRoutes();

  const { isLoading: eGateLoading } = useQuery([ticket], () => api.eGatesLogin({ ticket }), {
    onError: ({ response }: any) => {
      handleErrorToastFromServer(response);
    },
    onSuccess: (data) => {
      if (data) {
        handleUpdateTokens(data);
      }
    },
    retry: false,
    enabled: !!ticket,
  });

  const updateTokensMutation = useMutation(api.refreshToken, {
    onError: ({ response }: any) => {
      if (isEqual(response.status, 401)) {
        cookies.remove('refreshToken', { path: '/' });
      }
    },
    onSuccess: (data) => {
      handleUpdateTokens(data);
    },
  });

  const updateTokensMutationMutateAsyncFunction = updateTokensMutation.mutateAsync;

  const shouldUpdateTokens = useCallback(async () => {
    if (!cookies.get('token') && cookies.get('refreshToken')) {
      await updateTokensMutationMutateAsyncFunction();
    }
  }, [updateTokensMutationMutateAsyncFunction]);

  const { isLoading: checkAuthLoading } = useCheckAuthMutation();

  useEffect(() => {
    (async () => {
      await shouldUpdateTokens();

      setInitialLoading(false);
    })();
  }, [location.pathname, shouldUpdateTokens]);

  const isLoading = [
    initialLoading,
    updateTokensMutation.isLoading,
    checkAuthLoading,
    eGateLoading,
  ].some((loading) => loading);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {!isLoading ? (
        <Routes>
          <Route element={<PublicRoute loggedIn={loggedIn} />} key="root">
            <Route path={slugs.login} element={<Login />} />
            <Route path={slugs.profiles} element={<Profiles />} />
            <Route path={slugs.forgotPassword} element={<ForgotPassword />} />
            <Route path={slugs.resetPassword} element={<ResetPassword />} />
            <Route path={slugs.invite} element={<CreatePassword />} />
          </Route>

          <Route element={<ProtectedRoute loggedIn={loggedIn} />} key="root">
            {routes.map((route) => (
              <Route path={route.slug} element={route.component} />
            ))}
          </Route>

          <Route
            path="*"
            element={<Navigate to={loggedIn ? routes[0].slug : slugs.login} replace />}
          />
        </Routes>
      ) : (
        <FullscreenLoader />
      )}
    </ThemeProvider>
  );
}

interface ProtectedRouteProps {
  loggedIn: boolean;
}

const PublicRoute = ({ loggedIn }: ProtectedRouteProps) => {
  const profileId = cookies.get('profileId');

  const user = useAppSelector((state) => state.user.userData);

  const userWithoutProfile = loggedIn && user.type == AdminRoleType.USER && !profileId;

  if (loggedIn && !userWithoutProfile) {
    return <Navigate to={'/'} replace />;
  }

  return (
    <LoginLayout>
      <Outlet />
    </LoginLayout>
  );
};

const ProtectedRoute = ({ loggedIn }: ProtectedRouteProps) => {
  if (!loggedIn) {
    return <Navigate to={'/'} replace />;
  }

  return (
    <DefaultLayout>
      <Outlet />
    </DefaultLayout>
  );
};

export default App;
