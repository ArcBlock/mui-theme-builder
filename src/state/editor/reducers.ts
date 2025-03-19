/* eslint-disable @typescript-eslint/default-param-last */
import { ThemeOptions } from '@mui/material';
import JSON5 from 'json5';
import { defaultThemeOptions } from 'src/siteTheme';

import { RootState } from '../types';
import { EditorState } from './types';

const stringify = (themeOptions: ThemeOptions) => {
  return `import { ThemeOptions } from '@mui/material/styles';

export const themeOptions: ThemeOptions = ${JSON5.stringify(themeOptions, null, 2)};`;
};

export const initialState: EditorState = {
  themeInput: stringify(defaultThemeOptions),
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

export default (state = initialState, action: any, savedThemes: RootState['savedThemes']) => {
  switch (action.type) {
    case 'persist/REHYDRATE':
      if (action.payload != null) {
        return {
          ...state,
          themeInput: stringify(action.payload.themeOptions),
        };
      }
    // eslint-disable-next-line no-fallthrough
    case 'UPDATE_EDITOR_STATE':
      return {
        ...state,
        ...action.editorState,
      };
    case 'UPDATE_THEME':
      return {
        ...state,
        themeInput: stringify(action.themeOptions),
      };
    case 'ADD_NEW_THEME':
      return {
        ...state,
        themeInput: stringify(action.savedTheme.themeOptions),
      };
    case 'LOAD_THEME':
      return {
        ...state,
        themeInput: stringify(savedThemes[action.themeId].themeOptions),
      };
    default:
      return state;
  }
};
