import { applyMiddleware, createStore as reduxCreateStore } from 'redux';
import { createTransform, persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// defaults to localStorage for web
import thunk from 'redux-thunk';

import reducers from './reducers';

const persistConfig = {
  key: 'blocklet-theme-builder',
  storage,
  whitelist: ['themeOptions', 'mode', 'fonts', 'loadedFonts', 'selectedComponentId'],
  transforms: [
    createTransform<Set<string>, string[]>(
      (inState) => {
        return Array.from(inState);
      },
      (outState) => {
        return new Set(outState);
      },
      { whitelist: ['loadedFonts'] },
    ),
  ],
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
