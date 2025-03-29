/* eslint-disable @typescript-eslint/default-param-last */
import { defaultLightThemeOptions } from 'src/siteTheme';
import { stringify } from 'src/utils';

import { RootState } from '../types';
import { EditorState } from './types';

export const initialState: EditorState = {
  themeInput: stringify(defaultLightThemeOptions),
  initialVersion: 0,
  currentVersion: 0,
  lastVersion: 0,
  savedVersion: 0,
  canRedo: false,
  canUndo: false,
  errors: [],
  formatOnSave: true,
  outputTypescript: true,
};

export default (state = initialState, action: any, parentState: Omit<RootState, 'editor'>) => {
  switch (action.type) {
    case 'persist/REHYDRATE':
      if (action.payload != null) {
        const { themeOptions, mode } = action.payload;

        return {
          ...state,
          themeInput: stringify(themeOptions[mode]),
        };
      }
    // eslint-disable-next-line no-fallthrough
    case 'UPDATE_EDITOR_STATE':
      return {
        ...state,
        ...action.editorState,
      };
    // 更新 mode 对应的 ThemeOptions
    case 'UPDATE_THEME':
      return {
        ...state,
        themeInput: stringify(action.themeOptions),
      };
    // 切换 mode
    case 'SET_THEME_MODE':
      return {
        ...state,
        // @ts-expect-error
        themeInput: stringify(parentState.themeOptions[action.mode]),
      };
    // 设置 ThemeOptions
    case 'SET_THEME_OPTIONS':
      return {
        ...state,
        // @ts-expect-error
        themeInput: stringify(action.themeOptions[action.mode] || parentState.themeOptions[action.mode]),
      };
    default:
      return state;
  }
};
