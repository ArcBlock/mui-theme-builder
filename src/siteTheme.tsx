import { createDefaultThemeOptions } from '@arcblock/ux/lib/Theme';
import { Theme, ThemeOptions, createTheme } from '@mui/material';

export const defaultLightThemeOptions: ThemeOptions = createDefaultThemeOptions('light');
export const defaultLightTheme: Theme = createTheme(defaultLightThemeOptions);

export const defaultDarkTheme = createTheme({ palette: { mode: 'dark' } });
export const darkDefaultThemeOptions: ThemeOptions = {
  palette: defaultDarkTheme.palette,
};

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
