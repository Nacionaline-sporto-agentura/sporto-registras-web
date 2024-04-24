import { useQuery } from 'react-query';
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from 'styled-components';
import Cookies from 'universal-cookie';
import DefaultLayout from './components/layouts/Default';
import LoginLayout from './components/layouts/Login';
import FullscreenLoader from './components/other/FullscreenLoader';
import { CantLogin } from './pages/CantLogin';
import CreatePassword from './pages/CreatePassword';
import ForgotPassword from './pages/ForgotPassword';
import { Login } from './pages/Login';
import Profiles from './pages/Profiles';
import ResetPassword from './pages/ResetPassword';
import { useAppSelector } from './state/hooks';
import { GlobalStyle, theme } from './styles';
import api from './utils/api';
import { AdminRoleType } from './utils/constants';
import { useCheckUserInfo } from './utils/hooks';
import { handleUpdateTokens } from './utils/loginFunctions';
import { slugs, useFilteredRoutes } from './utils/routes';
const cookies = new Cookies();

function App() {
  const loggedIn = useAppSelector((state) => state.user.loggedIn);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { ticket } = Object.fromEntries([...Array.from(searchParams)]);
  const token = cookies.get('token');
  const refreshToken = cookies.get('refreshToken');

  const routes = useFilteredRoutes();

  const { isLoading: eGateLoading } = useQuery([ticket], () => api.eGatesLogin({ ticket }), {
    onError: () => {
      navigate(slugs.cantLogin);
    },
    onSuccess: (data) => {
      if (data) {
        handleUpdateTokens(data);
      }
    },
    retry: false,
    enabled: !!ticket,
  });

  const { isLoading: updateTokensLoading } = useQuery(
    [token, 'refreshToken'],
    () => api.refreshToken(),
    {
      onError: () => {
        cookies.remove('refreshToken', { path: '/' });
      },
      onSuccess: (data) => {
        handleUpdateTokens(data);
      },
      retry: false,
      enabled: !token && !!refreshToken,
    },
  );

  const { isLoading: userInfoLoading } = useCheckUserInfo();

  const isLoading = [updateTokensLoading, userInfoLoading, eGateLoading].some((loading) => loading);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {!isLoading ? (
        <Routes>
          <Route element={<PublicRoute loggedIn={loggedIn} />} key="root">
            <Route path={slugs.cantLogin} element={<CantLogin />} />
            <Route path={slugs.login} element={<Login />} />
            <Route path={slugs.profiles} element={<Profiles />} />
            <Route path={slugs.forgotPassword} element={<ForgotPassword />} />
            <Route path={slugs.resetPassword} element={<ResetPassword />} />
            <Route path={slugs.invite} element={<CreatePassword />} />
          </Route>

          <Route element={<ProtectedRoute loggedIn={loggedIn} />} key="root">
            {routes.map((route) => (
              <Route key={JSON.stringify(route)} path={route.slug} element={route.component} />
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
  const location = useLocation();
  const isProfilesPathname = slugs.profiles === location.pathname;
  const user = useAppSelector((state) => state.user.userData);

  const userWithoutProfile = loggedIn && user.type == AdminRoleType.USER && !profileId;

  if (loggedIn) {
    if (!userWithoutProfile) return <Navigate to={'/'} replace />;

    if (userWithoutProfile && !isProfilesPathname) return <Navigate to={slugs.profiles} replace />;
  } else if (isProfilesPathname) {
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
