import { DesignSystemProvider } from '@aplinkosministerija/design-system';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from 'styled-components';
import App from './App';
import redux from './state/store';
import { theme } from './styles/index';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const { store, persistor } = redux;
const queryClient = new QueryClient();
const env = import.meta.env;
const basename = env?.VITE_BASE_URL || '/';

root.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <DesignSystemProvider>
        <PersistGate persistor={persistor}>
          <BrowserRouter basename={basename}>
            <ThemeProvider theme={theme}>
              <App />
            </ThemeProvider>
          </BrowserRouter>
        </PersistGate>
      </DesignSystemProvider>
    </Provider>
  </QueryClientProvider>,
);
