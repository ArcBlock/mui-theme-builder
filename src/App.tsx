import { LocaleProvider } from '@arcblock/ux/lib/Locale/context';
import { Provider } from 'react-redux';

import './components/layout.css';
import { translations } from './locales';
import HomePage from './pages/index';
import createStore from './state/createStore';

function App() {
  const { store } = createStore();

  return (
    <Provider store={store}>
      <LocaleProvider locale="en" translations={translations}>
        <HomePage />
      </LocaleProvider>
    </Provider>
  );
}

export default App;
