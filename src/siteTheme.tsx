import { BLOCKLET_THEME_DARK, BLOCKLET_THEME_LIGHT } from '@blocklet/theme';
import { Theme, ThemeOptions, createTheme } from '@mui/material';
import { ThemePrefer } from './types/theme';

// 默认浅色主题
export const defaultLightTheme: Theme = createTheme(BLOCKLET_THEME_LIGHT);

// 默认深色主题
export const defaultDarkTheme = createTheme(BLOCKLET_THEME_DARK);

// 默认 theme 配置
export const defaultThemeOptions = {
  light: BLOCKLET_THEME_LIGHT,
  dark: BLOCKLET_THEME_DARK,
  prefer: 'light' as ThemePrefer,
};

// 创建编辑器主题
export const createSiteThemeOptions = ({ palette }: ThemeOptions): ThemeOptions => {
  const backgroundColor = palette?.background?.default ?? '#fff';

  return {
    components: {
      MuiAccordion: {
        defaultProps: {
          square: true,
          TransitionProps: {
            unmountOnExit: true,
          },
        },
        styleOverrides: {
          root: {
            border: 0,
            boxShadow: 'none',
            backgroundColor,
            transition: defaultLightTheme.transitions.create('margin-left'),
            '&:not(:last-child)': {
              borderBottom: 0,
            },
            '&:before': {
              display: 'none',
            },
            '&.Mui-expanded': {
              margin: 'auto',
            },
            '&.Mui-disabled': {
              marginLeft: 32,
            },
          },
        },
      },
      MuiAccordionSummary: {
        styleOverrides: {
          root: {
            border: 0,
            minHeight: 56,
            backgroundColor,
            '&.Mui-expanded': {
              minHeight: 56,
            },
          },
          content: {
            alignItems: 'center',
            justifyContent: 'space-between',
            '&.Mui-expanded': {
              margin: '12px 0',
            },
          },
        },
      },
      MuiAccordionDetails: {
        styleOverrides: {
          root: {
            backgroundColor,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          docked: {
            '& .MuiPaper-root': {
              position: 'static',
            },
          },
          paper: {},
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: {
            backgroundColor,
          },
        },
      },
    },
  };
};

// console.log('defaultLightTheme', defaultLightTheme);
// console.log('defaultDarkTheme', defaultDarkTheme);
