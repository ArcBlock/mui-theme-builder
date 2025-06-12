import { applyMiddleware, createStore as reduxCreateStore } from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducers';

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
    loadedFonts: Array.from(state.loadedFonts),
    selectedComponentId: state.selectedComponentId,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(persistState));
  return result;
};

// 从 localStorage 恢复状态
const loadState = () => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return undefined;
    }
    const state = JSON.parse(serializedState);
    // 转换 loadedFonts 回 Set
    if (state.loadedFonts) {
      state.loadedFonts = new Set(state.loadedFonts);
    }
    return state;
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
