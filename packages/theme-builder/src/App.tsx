import { LocaleProvider } from '@arcblock/ux/lib/Locale/context';

import './app.css';
import { translations } from './locales';
import HomePage from './pages/index';

function App() {
  return (
    <LocaleProvider locale="en" translations={translations}>
      <HomePage />
    </LocaleProvider>
  );
}

export default App;
