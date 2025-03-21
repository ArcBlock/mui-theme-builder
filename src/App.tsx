import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import theme from 'src/siteTheme';

import BlockletSamples from './components/BlockletSamples';
import MuiComponentSamples from './components/MuiComponentSamples/MuiComponentSamples';
import PreviewWindow from './components/PreviewWindow/PreviewWindow';
import './components/layout.css';
import HomePage from './pages/index';
import createStore from './state/createStore';

function App() {
  const basePath = import.meta.env.BASE_URL;
  const { store, persistor } = createStore();

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter basename={basePath}>
              <Routes>
                <Route path="/" element={<HomePage />}>
                  <Route path="preview" element={<PreviewWindow />} />
                  <Route path="components/:id?" element={<MuiComponentSamples />} />
                  {BlockletSamples.map(({ id, component }) => (
                    <Route path={`blocklets/${id}`} element={component} />
                  ))}
                </Route>
              </Routes>
            </BrowserRouter>
          </PersistGate>
        </Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
