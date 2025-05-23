import { Theme, ThemeOptions } from '@mui/material';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { defaultDarkTheme, defaultLightTheme } from 'src/siteTheme';
import { getByPath } from 'src/utils';

import { RootState } from './types';

/**
 * Return the value of in the theme at the specified path,
 * and whether that value is set by the user or is default
 * @param path
 * @param themeOptions
 * @param themeObject
 */
const getThemeValueInfo = (path: string, themeOptions: ThemeOptions, themeObject: Theme, mode: 'light' | 'dark') => {
  const defaultVal = getByPath(mode === 'light' ? defaultLightTheme : defaultDarkTheme, path);
  const valFromSaved: any = getByPath(themeOptions, path);

  return {
    modifiedByUser: valFromSaved !== undefined && valFromSaved !== defaultVal,
    value: getByPath(themeObject, path),
  };
};

const makeThemeValueInfoSelector = () =>
  createSelector(
    (_: any, path: string) => path,
    (state: RootState) => state.themeOptions[state.mode],
    (state: RootState) => state.themeObject,
    (state: RootState) => state.mode,
    getThemeValueInfo,
  );

/**
 * Return the value of in the theme at the specified path,
 * and whether that value is set by the user or is default
 * @param path
 */
export const useThemeValueInfo = (path: string) => {
  const selectThemeValue = useMemo(makeThemeValueInfoSelector, []);

  return useSelector((state: RootState) => selectThemeValue(state, path));
};

/**
 * Return the value of a generated theme at the specified path
 * @param path
 */
export const useThemeValue = (path: string) => useThemeValueInfo(path).value;

export const canSave = (state: any) => state.editor.savedVersion !== state.editor.currentVersion;

/**
 * Return whether the code editor has unsaved changes
 */
export const useCanSave = () => useSelector((state: RootState) => canSave(state));
