import { isEqual } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from 'styled-components';
import Cookies from 'universal-cookie';
import DefaultLayout from './components/layouts/Default';
import LoginLayout from './components/layouts/Login';
import FullscreenLoader from './components/other/FullscreenLoader';
import CreatePassword from './pages/CreatePassword';
import ForgotPassword from './pages/ForgotPassword';
import { Login } from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import { useAppSelector } from './state/hooks';
import { GlobalStyle, theme } from './styles';
import api from './utils/api';
import { useCheckAuthMutation } from './utils/hooks';
import { handleUpdateTokens } from './utils/loginFunctions';
import { routes, slugs } from './utils/routes';
const cookies = new Cookies();

function App() {
  const loggedIn = useAppSelector((state) => state.user.loggedIn);
  const location = useLocation();
  const [initialLoading, setInitialLoading] = useState(true);

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

  const isLoading = [initialLoading, updateTokensMutation.isLoading, checkAuthLoading].some(
    (loading) => loading,
  );

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {!isLoading ? (
        <Routes>
          <Route element={<PublicRoute loggedIn={loggedIn} />} key="root">
            <Route path={slugs.login} element={<Login />} />
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
            element={<Navigate to={loggedIn ? slugs.users : slugs.login} replace />}
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
  if (loggedIn) {
    return <Navigate to={slugs.users} replace />;
  }

  return (
    <LoginLayout>
      <Outlet />
    </LoginLayout>
  );
};

const ProtectedRoute = ({ loggedIn }: ProtectedRouteProps) => {
  if (!loggedIn) {
    return <Navigate to={slugs.login} replace />;
  }

  return (
    <DefaultLayout>
      <Outlet />
    </DefaultLayout>
  );
};

export default App;
