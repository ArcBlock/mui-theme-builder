/* eslint-disable @typescript-eslint/default-param-last */
import { defaultThemeOptions } from 'src/siteTheme';
import { stringify } from 'src/utils';

import { EditorState } from './types';

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

export default (state = initialState, action: any) => {
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
    default:
      return state;
  }
};
