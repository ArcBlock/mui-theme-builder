import { createDefaultThemeOptions } from '@arcblock/ux/lib/Theme';
import { Theme, ThemeOptions, createTheme } from '@mui/material';
import deepmerge from 'deepmerge';

// 默认字体
export const defaultFonts = ['Roboto', 'Helvetica', 'Arial', 'sans-serif'];

// 默认浅色主题
export const defaultLightThemeOptions: ThemeOptions = deepmerge(createDefaultThemeOptions('light'), {
  typography: {
    fontFamily: defaultFonts.join(','),
  },
});
export const defaultLightTheme: Theme = createTheme(defaultLightThemeOptions);

// 默认深色主题
export const defaultDarkTheme = createTheme({ palette: { mode: 'dark' } });
export const darkDefaultThemeOptions: ThemeOptions = {
  palette: defaultDarkTheme.palette,
};

// 编辑器主题
const siteTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1DC1C7',
    },
    secondary: {
      main: '#16CED1',
    },
  },
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
          border: '1px solid rgba(255, 255, 255, .125)',
          boxShadow: 'none',
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
          borderBottom: '1px solid rgba(255, 255, 255, .125)',
          minHeight: 56,
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
          // backgroundColor: '#212121',
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
          // backgroundColor: '#121212',
        },
      },
    },
  },
});

export default siteTheme;
