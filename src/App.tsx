import { LocaleProvider } from '@arcblock/ux/lib/Locale/context';
import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import theme from 'src/siteTheme';

import './components/layout.css';
import { translations } from './locales';
import HomePage from './pages/index';
import createStore from './state/createStore';

function App() {
  const { store, persistor } = createStore();

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <LocaleProvider locale="en" translations={translations}>
              <HomePage />
            </LocaleProvider>
          </PersistGate>
        </Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
