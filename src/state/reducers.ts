/* eslint-disable @typescript-eslint/default-param-last */
import { ThemeOptions, createTheme } from '@mui/material';
import deepmerge from 'deepmerge';
import Samples from 'src/components/Samples';
import { defaultThemeOptions } from 'src/siteTheme';
import { PreviewSize, RootState } from 'src/state/types';
import { generateThemeId } from 'src/utils';

import { loadFonts } from './actions';
import editorReducer, { initialState as editorInitialState } from './editor/reducers';

const defaultThemeId = generateThemeId('');

const getInitialSelectedComponent = () => {
  const initialId = Samples[0]?.id ?? '';
  return {
    selectedComponentId: initialId,
    previewComponent: Samples.find((s) => s.id === initialId)?.component ?? null,
  };
};

const initialState: RootState = {
  editor: editorInitialState,
  themeId: defaultThemeId,
  themeOptions: {
    light: defaultThemeOptions,
    dark: {
      ...defaultThemeOptions,
      palette: {
        ...defaultThemeOptions.palette,
        mode: 'dark',
      },
    },
  },
  mode: 'light',
  themeObject: createTheme(defaultThemeOptions),
  loadedFonts: new Set(),
  previewSize: false,
  tutorialStep: 0,
  tutorialOpen: false,
  componentNavOpen: false,
  themeConfigOpen: false,
  mobileWarningSeen: false,
  ...getInitialSelectedComponent(),
};

const initialFonts = ['Droid Sans', 'Droid Serif', 'Open Sans', 'Roboto'];

function loadFontsIfRequired(fonts: string[] = [], loadedFonts: Set<string>) {
  const fontsToLoad = fonts.filter((x) => !loadedFonts.has(x));

  if (!fontsToLoad.length) return loadedFonts;

  loadFonts(fontsToLoad);

  return new Set([...loadedFonts, ...fontsToLoad].sort());
}

const createPreviewMuiTheme = (themeOptions: ThemeOptions, previewSize: PreviewSize) => {
  const spoofedBreakpoints: Record<string, { xs: number; sm: number; md: number; lg: number; xl: number }> = {
    xs: { xs: 0, sm: 10000, md: 10001, lg: 10002, xl: 10003 },
    sm: { xs: 0, sm: 1, md: 10001, lg: 10002, xl: 10003 },
    md: { xs: 0, sm: 1, md: 2, lg: 10002, xl: 10003 },
    lg: { xs: 0, sm: 1, md: 2, lg: 3, xl: 10003 },
    xl: { xs: 0, sm: 1, md: 2, lg: 3, xl: 4 },
  };

  if (!previewSize) return createTheme(themeOptions);

  return createTheme(deepmerge({ breakpoints: { values: spoofedBreakpoints[previewSize] } }, themeOptions));
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
    currentState.loadedFonts = loadFontsIfRequired(initialFonts, state.loadedFonts);
  }

  switch (action.type) {
    case 'persist/REHYDRATE':
      if (action.payload != null) {
        return {
          ...currentState,
          themeOptions: action.payload.themeOptions,
          mode: action.payload.mode,
          themeObject: createPreviewMuiTheme(
            action.payload.themeOptions[action.payload.mode],
            currentState.previewSize,
          ),
          loadedFonts: loadFontsIfRequired(
            action.payload.themeOptions[action.payload.mode].fonts,
            currentState.loadedFonts,
          ),
        };
      }
      return currentState;
    // 设置 ThemeOptions
    case 'SET_THEME_OPTIONS':
      return {
        ...currentState,
        themeOptions: action.themeOptions,
      };
    // 切换 mode
    case 'SET_THEME_MODE':
      return {
        ...currentState,
        mode: action.mode,
        // @ts-expect-error
        themeObject: createPreviewMuiTheme(currentState.themeOptions[action.mode], currentState.previewSize),
      };
    // editor 编辑保存
    case 'SAVE_THEME_INPUT':
    case 'UPDATE_THEME':
      // tools 编辑保存
      return {
        ...currentState,
        themeOptions: {
          ...currentState.themeOptions,
          [currentState.mode]: action.themeOptions,
        },
        themeObject: createPreviewMuiTheme(action.themeOptions, currentState.previewSize),
      };
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
    case 'INCREMENT_TUTORIAL_STEP':
      return {
        ...currentState,
        tutorialStep: currentState.tutorialStep + 1,
      };
    case 'DECREMENT_TUTORIAL_STEP':
      return {
        ...currentState,
        tutorialStep: currentState.tutorialStep - 1,
      };
    case 'RESET_TUTORIAL_STEP':
      return {
        ...currentState,
        tutorialStep: 0,
      };
    case 'TOGGLE_TUTORIAL':
      return {
        ...currentState,
        tutorialOpen: !currentState.tutorialOpen,
      };
    case 'TOGGLE_COMPONENT_NAV':
      return {
        ...currentState,
        componentNavOpen: !currentState.componentNavOpen,
      };
    case 'TOGGLE_THEME_CONFIG':
      return {
        ...currentState,
        themeConfigOpen: !currentState.themeConfigOpen,
      };
    case 'WARNING_SCREEN_SEEN':
      return {
        ...currentState,
        mobileWarningSeen: true,
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
    default:
      return currentState;
  }
};
