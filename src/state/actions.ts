import { ThemeOptions } from '@mui/material';
import { defaultTheme } from 'src/siteTheme';
import { getByPath, removeByPath, setByPath, verbose } from 'src/utils';

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
    let updatedThemeOptions: ThemeOptions;

    // path with ".<name>" removed
    // const parentPath = path.substring(0, path.lastIndexOf('.'));

    // paths ending in "main" must be declared
    // replace with the value from the default Theme object
    if (path.endsWith('main')) {
      const defaultValueForPath = getByPath(defaultTheme, path);
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
 * loads a set of passed fonts and resolves a promise
 * when the fonts load, or fail to load
 * @param fonts
 */
export function loadFonts(fonts: string[]) {
  return new Promise<boolean>((resolve) => {
    import('webfontloader')
      .then((WebFontModule) => {
        const WebFont = WebFontModule.default || WebFontModule;
        WebFont.load({
          google: {
            families: fonts,
          },
          active: () => {
            verbose('state/actions -> loadFonts: webfonts loaded', fonts);
            resolve(true);
          },
          inactive: () => {
            verbose('state/actions -> loadFonts: webfonts could not load', fonts);
            resolve(false);
          },
        });
      })
      .catch(() => {
        resolve(false);
      });
  });
}

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
