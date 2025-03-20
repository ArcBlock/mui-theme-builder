/* eslint-disable @typescript-eslint/default-param-last */
import { ThemeOptions, createTheme } from '@mui/material';
import { TypographyOptions } from '@mui/material/styles/createTypography';
import deepmerge from 'deepmerge';
import { defaultThemeOptions } from 'src/siteTheme';
import { PreviewSize, RootState } from 'src/state/types';
import { generateThemeId, isSetEq } from 'src/utils';

import { loadFonts } from './actions';
import editorReducer, { initialState as editorInitialState } from './editor/reducers';

const defaultThemeId = generateThemeId({});

const initialState: RootState = {
  editor: editorInitialState,
  themeId: defaultThemeId,
  themeOptions: defaultThemeOptions, // the object loaded into createMuiTheme
  themeObject: createTheme(defaultThemeOptions),
  savedThemes: {
    [defaultThemeId]: {
      id: defaultThemeId,
      name: 'My Theme',
      themeOptions: defaultThemeOptions,
      fonts: ['Roboto'],
      lastUpdated: new Date().toISOString(),
    },
  },
  loadedFonts: new Set(),
  activeTab: 'preview',
  previewSize: false,
  tutorialStep: 0,
  tutorialOpen: false,
  componentNavOpen: false,
  themeConfigOpen: false,
  mobileWarningSeen: false,
};

const initialFonts = ['Droid Sans', 'Droid Serif', 'Open Sans', 'Roboto'];

function loadFontsIfRequired(fonts: string[], loadedFonts: Set<string>) {
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

/**
 * Parse a `ThemeOptions` object to get a list of google fonts included
 * Note that the Material-UI default Theme uses Roboto as the base Font
 * @param themeOptions - the `ThemeOptions` object to parse
 * @param previousFonts - previous state of `savedThemes[id].fonts`
 * @param loadedFonts - `RootState.loadedFonts`
 *
 * @returns string[] - the google fonts included in `themeOptions`
 */
const getFontsFromThemeOptions = (
  themeOptions: ThemeOptions,
  previousFonts: string[] | undefined,
  loadedFonts: Set<string>,
) => {
  const { typography } = themeOptions as { typography: TypographyOptions | undefined };

  // get all defined fonts from the themeOptions
  const fontList: string[] = [
    typography?.fontFamily || 'Roboto',
    typography?.h1?.fontFamily,
    typography?.h2?.fontFamily,
    typography?.h3?.fontFamily,
    typography?.h4?.fontFamily,
    typography?.h5?.fontFamily,
    typography?.h6?.fontFamily,
    typography?.subtitle1?.fontFamily,
    typography?.subtitle2?.fontFamily,
    typography?.body1?.fontFamily,
    typography?.body2?.fontFamily,
    typography?.button?.fontFamily,
    typography?.caption?.fontFamily,
    typography?.overline?.fontFamily,
  ]
    .flatMap((x) => (x == null ? [] : x?.replace(/"/g, '').split(',')))
    // .filter((x): x is string => !!x) // remove nulls and undefined items
    // .map(x => ) // strip out quotes and split by comma
    // .flat() // flatten the array if any font families had multiple specified
    .map((x) => x.trim()); // trim off any white space

  const fontSet = new Set<string>();
  fontList.forEach((x) => loadedFonts.has(x) && fontSet.add(x));

  // if new fontSet hasn't changed from the current theme fonts
  // return the original Set for redux performance
  if (previousFonts && isSetEq(new Set(previousFonts), fontSet)) {
    return previousFonts;
  }

  return [...fontSet];
};

const onRemoveSavedTheme = (state: RootState, themeId: string) => {
  const newSavedThemes = { ...state.savedThemes };
  delete newSavedThemes[themeId];
  return { savedThemes: newSavedThemes };
};

export default (state = initialState, action: any) => {
  let newState = {} as RootState;
  // run editor reducers
  newState = {
    ...state,
    editor: editorReducer(state.editor, action, state.savedThemes),
  };

  // on initial page load, load the initial fonts
  if (!state.loadedFonts.size) {
    newState = {
      ...state,
      loadedFonts: loadFontsIfRequired(initialFonts, state.loadedFonts),
    };
  }

  switch (action.type) {
    case 'persist/REHYDRATE':
      if (action.payload != null) {
        return {
          ...newState,
          themeObject: createPreviewMuiTheme(action.payload.themeOptions, newState.previewSize),
          loadedFonts: loadFontsIfRequired(
            action.payload.savedThemes[action.payload.themeId].fonts,
            newState.loadedFonts,
          ),
        };
      }
      return newState;
    case 'SAVE_THEME_INPUT':
    case 'UPDATE_THEME':
      return {
        ...newState,
        themeOptions: action.themeOptions,
        themeObject: createPreviewMuiTheme(action.themeOptions, newState.previewSize),
        savedThemes: {
          ...newState.savedThemes,
          [newState.themeId]: {
            ...newState.savedThemes[newState.themeId],
            themeOptions: action.themeOptions,
            fonts: getFontsFromThemeOptions(
              action.themeOptions,
              newState.savedThemes[newState.themeId]?.fonts,
              newState.loadedFonts,
            ),
            lastUpdated: new Date().toISOString(),
          },
        },
      };
    case 'ADD_NEW_THEME':
      // eslint-disable-next-line no-case-declarations
      const newThemeId = generateThemeId(newState.savedThemes);

      return {
        ...newState,
        themeId: newThemeId,
        themeOptions: action.savedTheme.themeOptions,
        themeObject: createPreviewMuiTheme(action.savedTheme.themeOptions, newState.previewSize),
        savedThemes: {
          ...newState.savedThemes,
          [newThemeId]: {
            id: newThemeId,
            ...action.savedTheme,
            lastUpdated: new Date().toISOString(),
          },
        },
        loadedFonts: loadFontsIfRequired(action.savedTheme.fonts, newState.loadedFonts),
      };
    case 'LOAD_THEME':
      return {
        ...newState,
        themeId: action.themeId,
        themeOptions: newState.savedThemes[action.themeId].themeOptions,
        themeObject: createPreviewMuiTheme(newState.savedThemes[action.themeId].themeOptions, newState.previewSize),
        loadedFonts: loadFontsIfRequired(newState.savedThemes[action.themeId].fonts, newState.loadedFonts),
      };
    case 'RENAME_THEME':
      return {
        ...newState,
        savedThemes: {
          ...newState.savedThemes,
          [action.themeId]: {
            ...newState.savedThemes[action.themeId],
            name: action.name,
            lastUpdated: new Date().toISOString(),
          },
        },
      };
    case 'REMOVE_THEME':
      return {
        ...newState,
        ...onRemoveSavedTheme(newState, action.themeId),
      };
    case 'FONTS_LOADED':
      return {
        ...newState,
        loadedFonts: new Set([...newState.loadedFonts, ...action.fonts].sort()),
      };
    case 'SET_TAB':
      return {
        ...newState,
        activeTab: action.tab,
      };
    case 'SET_PREVIEW_SIZE':
      return {
        ...newState,
        previewSize: action.previewSize,
        themeObject: createPreviewMuiTheme(newState.themeOptions, action.previewSize),
      };
    case 'INCREMENT_TUTORIAL_STEP':
      return {
        ...newState,
        tutorialStep: newState.tutorialStep + 1,
      };
    case 'DECREMENT_TUTORIAL_STEP':
      return {
        ...newState,
        tutorialStep: newState.tutorialStep - 1,
      };
    case 'RESET_TUTORIAL_STEP':
      return {
        ...newState,
        tutorialStep: 0,
      };
    case 'TOGGLE_TUTORIAL':
      return {
        ...newState,
        tutorialOpen: !newState.tutorialOpen,
      };
    case 'TOGGLE_COMPONENT_NAV':
      return {
        ...newState,
        componentNavOpen: !newState.componentNavOpen,
      };
    case 'TOGGLE_THEME_CONFIG':
      return {
        ...newState,
        themeConfigOpen: !newState.themeConfigOpen,
      };
    case 'WARNING_SCREEN_SEEN':
      return {
        ...newState,
        mobileWarningSeen: true,
      };
    case 'RESET_SITE_DATA':
      return {
        ...initialState,
      };
    default:
      return newState;
  }
};
