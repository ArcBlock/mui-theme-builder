import { DEFAULT_FONTS } from '@blocklet/theme';
import { applyMiddleware, createStore as reduxCreateStore } from 'redux';
import thunk from 'redux-thunk';
import { createPreviewMuiTheme, loadFontsIfRequired, stringify } from 'src/utils';

import reducers, { initialState } from './reducers';

const STORAGE_KEY = 'blocklet-theme-builder';

// 自定义持久化中间件
const persistMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action);

  // 只持久化需要的状态
  const state = store.getState();
  const persistState = {
    themeOptions: state.themeOptions,
    mode: state.mode,
    fonts: state.fonts,
    selectedComponentId: state.selectedComponentId,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(persistState));
  return result;
};

// 从 localStorage 恢复初始状态
const loadState = () => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return undefined;
    }
    const state = JSON.parse(serializedState);
    state.loadedFonts = loadFontsIfRequired(state.fonts, new Set(DEFAULT_FONTS));
    state.themeObject = createPreviewMuiTheme(state.themeOptions[state.mode], false);

    return {
      ...initialState,
      ...state,
      // @required editor 初始状态
      editor: {
        ...initialState.editor,
        themeInput: stringify(state.themeOptions[state.mode]),
      },
    };
  } catch (err) {
    console.error('Failed to load state from localStorage:', err);
    return undefined;
  }
};

export default () => {
  const preloadedState = loadState();
  const store = reduxCreateStore(reducers, preloadedState, applyMiddleware(thunk, persistMiddleware));
  return { store };
};
