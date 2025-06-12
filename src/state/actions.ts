import { ThemeOptions } from '@mui/material';
import { defaultDarkTheme, defaultLightTheme } from 'src/siteTheme';
import { getByPath, loadFonts, removeByPath, setByPath } from 'src/utils';

import { canSave } from './selectors';
import { PreviewSize } from './types';

/**
 * Check if the code editor has unsaved work, and if so, prompt the user
 * as to whether they'd like to overwrite with changes being made
 */
const checkIfUserAllowsOverwrite = (state: any) =>
  // eslint-disable-next-line no-alert
  !canSave(state) || window.confirm('There are unsaved changes in the code editor. Wipe changes and proceed?');

/**
 * Remove a key/value in the theme options object by a given path.
 * Paths ending in "main" eg. "palette.primary.main" must be declared.
 * if the key path ends in "main"
 *  replace it with the default Theme value at that path
 * if the key is removed, and the containing object no longer
 * has any meaningful key/values, remove it as well
 * e.g. removing palette.background.default creates {palette: {background: {}}}
 * and should be removed to tidy the theme code
 * @param path - the path to remove from the themeOptions
 */
export const removeThemeOption = (path: string) => (dispatch: Function, getState: Function) => {
  const state = getState();

  if (checkIfUserAllowsOverwrite(state)) {
    const currentMode = state.mode;
    const currentTheme = currentMode === 'light' ? defaultLightTheme : defaultDarkTheme;
    let updatedThemeOptions: ThemeOptions;

    if (path.endsWith('main')) {
      const defaultValueForPath = getByPath(currentTheme, path);
      updatedThemeOptions = setByPath(state.themeOptions[currentMode], path, defaultValueForPath);
    } else {
      // remove the key from the themeOptions (immutably)
      updatedThemeOptions = removeByPath(state.themeOptions[currentMode], path);
    }

    return dispatch({
      type: 'UPDATE_THEME',
      themeOptions: updatedThemeOptions,
    });
  }
  return undefined;
};

export const removeThemeOptions =
  (configs: { path: string; value: any }[]) => (dispatch: Function, getState: Function) => {
    const state = getState();

    if (checkIfUserAllowsOverwrite(state)) {
      const currentMode = state.mode;
      let updatedThemeOptions = state.themeOptions[currentMode];

      configs.forEach(({ path }) => {
        updatedThemeOptions = removeByPath(updatedThemeOptions, path);
      });

      dispatch({
        type: 'UPDATE_THEME',
        themeOptions: updatedThemeOptions,
      });
    }
  };

export const setThemeOption = (path: string, value: any) => (dispatch: Function, getState: Function) => {
  const state = getState();

  if (checkIfUserAllowsOverwrite(state)) {
    const currentMode = state.mode;
    const updatedThemeOptions = setByPath(state.themeOptions[currentMode], path, value);

    dispatch({
      type: 'UPDATE_THEME',
      themeOptions: updatedThemeOptions,
    });
  }
};

export const setThemeOptions =
  (configs: { path: string; value: any }[]) => (dispatch: Function, getState: Function) => {
    const state = getState();

    if (checkIfUserAllowsOverwrite(state)) {
      const currentMode = state.mode;
      let updatedThemeOptions = state.themeOptions[currentMode];

      configs.forEach(({ path, value }) => {
        updatedThemeOptions = setByPath(updatedThemeOptions, path, value);
      });

      dispatch({
        type: 'UPDATE_THEME',
        themeOptions: updatedThemeOptions,
      });
    }
  };

/**
 * Load fonts using webfontloader, then add those fonts to the redux store
 */
export const addFonts = (fonts: string[]) => async (dispatch: Function) => {
  const fontsLoaded: boolean = await loadFonts(fonts);
  if (fontsLoaded) {
    return dispatch({
      type: 'FONTS_LOADED',
      fonts,
    });
  }
  return false;
};

/**
 * Set the active tab for the editor page
 */
export const setPreviewSize = (previewSize: PreviewSize) => ({
  type: 'SET_PREVIEW_SIZE',
  previewSize,
});

export const resetSiteData = () => ({ type: 'RESET_SITE_DATA' });

export const setThemeSettings = (settings: { prefer: string }) => ({
  type: 'SET_THEME_SETTINGS',
  settings,
});

export const setThemePrefer = (prefer: string) => ({
  type: 'SET_THEME_PREFER',
  prefer,
});

export const resetStore = () => ({
  type: 'RESET_STORE',
});
