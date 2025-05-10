/* eslint-disable @typescript-eslint/default-param-last */
import { deepmerge } from '@arcblock/ux/lib/Theme';
// import { ThemeOptions } from '@blocklet/theme';
import { ThemeOptions, createTheme } from '@mui/material';
import Samples from 'src/components/Samples';
import { defaultFonts, defaultThemeOptions } from 'src/siteTheme';
import { PreviewSize, RootState } from 'src/state/types';
import { generateThemeId, getFontsFromThemeOptions } from 'src/utils';

import { loadFonts } from './actions';
import editorReducer, { initialState as editorInitialState } from './editor/reducers';

const defaultThemeId = generateThemeId('');

const getSelectedComponent = (id = '') => {
  let cid = id;
  let preview = Samples.find((s) => s.id === cid)?.component;

  if (!cid || !preview) {
    cid = Samples[0]?.id ?? '';
    preview = Samples[0]?.component ?? null;
  }

  return {
    selectedComponentId: cid,
    previewComponent: preview,
  };
};

const initialState: RootState = {
  editor: editorInitialState,
  themeId: defaultThemeId,
  themeOptions: defaultThemeOptions,
  themeObject: createTheme(defaultThemeOptions.light),
  fonts: ['Roboto'], // themeOptions 中使用过的字体
  mode: 'light',
  loadedFonts: new Set(), // 已加载的字体
  previewSize: false,
  themeConfigOpen: false,
  ...getSelectedComponent(),
};

function loadFontsIfRequired(fonts: string[] = [], loadedFonts: Set<string>) {
  const fontsToLoad = fonts.filter((x) => !loadedFonts.has(x));

  if (!fontsToLoad.length) return loadedFonts;

  loadFonts(fontsToLoad);

  return new Set([...loadedFonts, ...fontsToLoad].sort());
}

const createPreviewMuiTheme = (themeOptions: ThemeOptions, previewSize: PreviewSize) => {
  // 利用 breakpoints 强制布局
  const spoofedBreakpoints: Record<string, { xs: number; sm: number; md: number; lg: number; xl: number }> = {
    xs: { xs: 0, sm: 10000, md: 10001, lg: 10002, xl: 10003 },
    sm: { xs: 0, sm: 1, md: 10001, lg: 10002, xl: 10003 },
    md: { xs: 0, sm: 1, md: 2, lg: 10002, xl: 10003 },
    lg: { xs: 0, sm: 1, md: 2, lg: 3, xl: 10003 },
    xl: { xs: 0, sm: 1, md: 2, lg: 3, xl: 4 },
  };

  const currentThemeOptions = deepmerge(
    themeOptions.palette?.mode === 'light' ? defaultThemeOptions.light : defaultThemeOptions.dark,
    themeOptions,
  );

  if (!previewSize) return createTheme(currentThemeOptions);

  return createTheme(deepmerge(currentThemeOptions, { breakpoints: { values: spoofedBreakpoints[previewSize] } }));
};

export default (state = initialState, action: any) => {
  let currentState = {} as RootState;

  // run editor reducers
  currentState = {
    ...state,
    // 这里会触发 editor 的 actions
    editor: editorReducer(state.editor, action, state),
  };

  // 初始化加载字体
  if (!state.loadedFonts.size) {
    currentState.loadedFonts = loadFontsIfRequired(defaultFonts, state.loadedFonts);
  }

  switch (action.type) {
    // 从 localStorage 还原
    case 'persist/REHYDRATE':
      if (action.payload != null) {
        return {
          ...currentState,
          themeOptions: action.payload.themeOptions,
          mode: action.payload.mode,
          fonts: action.payload.fonts,
          loadedFonts: loadFontsIfRequired(
            Array.from(action.payload.loadedFonts || new Set()),
            currentState.loadedFonts,
          ),
          themeObject: createPreviewMuiTheme(
            action.payload.themeOptions[action.payload.mode],
            currentState.previewSize,
          ),
          ...getSelectedComponent(action.payload.selectedComponentId),
        };
      }
      return currentState;
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
        previewComponent: action.payload.component,
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
        loadedFonts: loadFontsIfRequired(defaultFonts, state.loadedFonts),
        ...getSelectedComponent(),
      };
    default:
      return currentState;
  }
};
