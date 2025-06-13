/* eslint-disable @typescript-eslint/default-param-last */
import { DEFAULT_FONTS } from '@blocklet/theme';
import { ThemeOptions, createTheme } from '@mui/material';
import { defaultThemeOptions } from 'src/siteTheme';
import { RootState } from 'src/state/types';
import { createPreviewMuiTheme, generateThemeId, getFontsFromThemeOptions } from 'src/utils';

import editorReducer, { initialState as editorInitialState } from './editor/reducers';

const defaultThemeId = generateThemeId('');

export const initialState: RootState = {
  editor: editorInitialState,
  themeId: defaultThemeId,
  themeOptions: defaultThemeOptions,
  themeObject: createTheme(defaultThemeOptions.light),
  fonts: ['Roboto'], // themeOptions 中使用过的字体
  mode: 'light',
  loadedFonts: new Set(DEFAULT_FONTS), // 已加载的字体
  previewSize: false,
  themeConfigOpen: false,
  selectedComponentId: 'Website',
};

export default (state = initialState, action: any) => {
  let currentState = {} as RootState;

  // run editor reducers
  currentState = {
    ...state,
    // 这里会触发 editor 的 actions
    editor: editorReducer(state.editor, action, state),
  };

  switch (action.type) {
    // 设置 ThemeOptions
    case 'SET_THEME_OPTIONS':
      return {
        ...currentState,
        themeOptions: {
          light: action.themeOptions.light ? action.themeOptions.light : currentState.themeOptions.light,
          dark: action.themeOptions.dark ? action.themeOptions.dark : currentState.themeOptions.dark,
          prefer: action.themeOptions.prefer ?? currentState.themeOptions.prefer,
        },
      };
    // 切换 mode
    case 'SET_THEME_MODE':
      return {
        ...currentState,
        mode: action.mode,
        // @ts-expect-error
        themeObject: createPreviewMuiTheme(currentState.themeOptions[action.mode], currentState.previewSize),
        fonts: getFontsFromThemeOptions(
          // @ts-expect-error
          currentState.themeOptions[action.mode],
          currentState.fonts,
          currentState.loadedFonts,
        ),
      };
    // editor 编辑保存
    case 'SAVE_THEME_INPUT':
    case 'UPDATE_THEME': {
      // 获取当前模式下的主题配置
      const currentModeTheme = action.themeOptions;
      const otherMode = currentState.mode === 'light' ? 'dark' : 'light';
      const otherModeTheme = currentState.themeOptions[otherMode];
      const excludeFields = ['palette', 'components', 'shadows'];
      const { palette, components, typography, shadows } = otherModeTheme;

      // 只保留当前主题中存在的共享字段
      const newOtherModeTheme: ThemeOptions = {
        ...Object.keys(currentModeTheme).reduce(
          (acc, key) => {
            if (!excludeFields.includes(key)) {
              acc[key] = currentModeTheme[key];
            }
            return acc;
          },
          {} as Record<string, unknown>,
        ),
        palette,
        components,
        shadows,
      };

      // 保留历史遗留字段 typography.color
      if (typeof typography === 'object' && typography.color) {
        if (typeof newOtherModeTheme.typography === 'object' && newOtherModeTheme.typography) {
          newOtherModeTheme.typography = {
            ...newOtherModeTheme.typography,
            color: typography.color,
          };
        }
      }

      // 创建新的主题配置，保持共享字段同步
      const newThemeOptions = {
        ...currentState.themeOptions,
        [currentState.mode]: currentModeTheme,
        [otherMode]: newOtherModeTheme,
      };

      return {
        ...currentState,
        themeOptions: newThemeOptions,
        themeObject: createPreviewMuiTheme(currentModeTheme, currentState.previewSize),
        fonts: getFontsFromThemeOptions(currentModeTheme, currentState.fonts, currentState.loadedFonts),
      };
    }
    case 'FONTS_LOADED':
      return {
        ...currentState,
        loadedFonts: new Set([...currentState.loadedFonts, ...action.fonts].sort()),
      };
    case 'SET_PREVIEW_SIZE':
      return {
        ...currentState,
        previewSize: action.previewSize,
        themeObject: createPreviewMuiTheme(currentState.themeOptions[currentState.mode], action.previewSize),
      };
    case 'TOGGLE_THEME_CONFIG':
      return {
        ...currentState,
        themeConfigOpen: !currentState.themeConfigOpen,
      };
    case 'RESET_SITE_DATA':
      return {
        ...initialState,
      };
    case 'SET_PREVIEW_COMPONENT':
      return {
        ...currentState,
        selectedComponentId: action.payload.id,
      };
    case 'SET_THEME_PREFER':
      return {
        ...currentState,
        themeOptions: {
          ...currentState.themeOptions,
          prefer: action.prefer,
        },
      };
    case 'RESET_STORE':
      return {
        ...initialState,
      };
    default:
      return currentState;
  }
};
