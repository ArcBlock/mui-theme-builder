import { applyMiddleware, createStore as reduxCreateStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// defaults to localStorage for web
import thunk from 'redux-thunk';

import reducers from './reducers';

const persistConfig = {
  key: 'blocklet-theme-builder',
  storage,
  whitelist: ['themeId', 'mode', 'fonts', 'themeOptions', 'selectedComponentId'],
};

// in production, persist the mobileWarningSeen value so mobile users don't see the popup again on reload
if (process.env.NODE_ENV === 'production') {
  persistConfig.whitelist.push('mobileWarningSeen');
}

const persistedReducer = persistReducer(persistConfig, reducers);

export default () => {
  const store = reduxCreateStore(persistedReducer, applyMiddleware(thunk));
  const persistor = persistStore(store);
  // persistor.purge()
  return { store, persistor };
};
