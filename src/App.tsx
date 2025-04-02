import { LocaleProvider } from '@arcblock/ux/lib/Locale/context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import './components/layout.css';
import { translations } from './locales';
import HomePage from './pages/index';
import createStore from './state/createStore';

function App() {
  const { store, persistor } = createStore();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LocaleProvider locale="en" translations={translations}>
          <HomePage />
        </LocaleProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
