import { ThemeOptions } from '@mui/material';
import { useEffect, useState } from 'react';

export default function useParentTheme() {
  const [theme, setTheme] = useState<ThemeOptions>({
    breakpoints: {
      keys: ['xs', 'sm', 'md', 'lg', 'xl'],
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
      unit: 'px',
    },
    direction: 'ltr',
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
          },
        },
      },
      MuiButtonGroup: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          sizeSmall: {
            borderBottomWidth: '0',
            paddingTop: '8px',
            paddingBottom: '8px',
            paddingLeft: 0,
            paddingRight: '20px',
          },
          sizeMedium: {
            borderBottomWidth: '0',
            paddingTop: '14px',
            paddingBottom: '14px',
            paddingLeft: 0,
            paddingRight: '30px',
          },
          head: {
            textTransform: 'uppercase',
            color: '#212121',
          },
          body: {
            color: '#212121',
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:nth-child(even)': {
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
            },
          },
          head: {
            backgroundColor: 'transparent',
          },
        },
      },
    },
    palette: {
      mode: 'light',
      primary: {
        main: '#f57c00',
        contrastText: '#fff',
        light: 'rgb(247, 150, 51)',
        dark: 'rgb(171, 86, 0)',
      },
      secondary: {
        main: '#0086FF',
        contrastText: '#fff',
        light: 'rgb(51, 158, 255)',
        dark: 'rgb(0, 93, 178)',
      },
      error: {
        main: '#F16E6E',
        contrastText: '#fff',
        light: 'rgb(243, 139, 139)',
        dark: 'rgb(168, 77, 77)',
      },
      warning: {
        main: '#DE9E37',
        contrastText: '#fff',
        light: 'rgb(228, 177, 95)',
        dark: 'rgb(155, 110, 38)',
      },
      info: {
        main: '#0775F8',
        contrastText: '#fff',
        light: 'rgb(56, 144, 249)',
        dark: 'rgb(4, 81, 173)',
      },
      success: {
        main: '#34BE74',
        contrastText: '#fff',
        light: 'rgb(92, 203, 143)',
        dark: 'rgb(36, 133, 81)',
      },
      grey: {
        '50': '#fafafa',
        '100': '#f5f5f5',
        '200': '#eeeeee',
        '300': '#e0e0e0',
        '400': '#bdbdbd',
        '500': '#9e9e9e',
        '600': '#757575',
        '700': '#616161',
        '800': '#424242',
        '900': '#212121',
        A100: '#d5d5d5',
        A200: '#aaaaaa',
        A400: '#303030',
        A700: '#616161',
      },
      text: {
        primary: 'rgba(85, 18, 239, 0.87)',
        secondary: 'rgba(18, 47, 235, 0.54)',
        disabled: 'rgba(0, 0, 0, 0.38)',
        hint: 'rgba(0, 0, 0, 0.38)',
      },
      divider: '#eeeeee',
      background: {
        default: '#a5d6a7',
        paper: '#fff',
      },
      common: {
        black: '#000',
        white: '#fff',
      },
      storeSecondary: {
        main: '#EBFEFF',
        contrastText: '#fff',
      },
      did: {
        primary: '#4598FA',
        secondary: '#49C3AD',
      },
      contrastThreshold: 3,
      tonalOffset: 0.2,
      action: {
        active: '#1ab9e989',
        hover: 'rgba(0, 0, 0, 0.04)',
        hoverOpacity: 0.04,
        selected: 'rgba(0, 0, 0, 0.08)',
        selectedOpacity: 0.08,
        disabled: 'rgba(0, 0, 0, 0.26)',
        disabledBackground: 'rgba(0, 0, 0, 0.12)',
        disabledOpacity: 0.38,
        focus: 'rgba(0, 0, 0, 0.12)',
        focusOpacity: 0.12,
        activatedOpacity: 0.12,
      },
    },
    shape: {
      borderRadius: 4,
    },
    typography: {
      fontSize: 14,
      fontFamily: 'Caveat',
      button: {
        fontWeight: 700,
        textTransform: 'none',
        fontFamily: 'Caveat',
        fontSize: '0.875rem',
        lineHeight: 1.75,
      },
      allVariants: {
        textTransform: 'none',
      },
      h1: {
        fontSize: '1.2916666666666667rem',
        lineHeight: 1.2,
        fontWeight: 700,
        fontFamily: 'Caveat',
        textTransform: 'none',
        '@media (min-width:0px)': {
          fontSize: '1.25rem',
        },
        '@media (min-width:600px)': {
          fontSize: '1.6667rem',
        },
        '@media (min-width:960px)': {
          fontSize: '1.6667rem',
        },
        '@media (min-width:1280px)': {
          fontSize: '1.875rem',
        },
      },
      h2: {
        fontSize: '1.1666666666666667rem',
        lineHeight: 1.3333333,
        fontWeight: 700,
        fontFamily: 'Caveat',
        textTransform: 'none',
        '@media (min-width:0px)': {
          fontSize: '1.125rem',
        },
        '@media (min-width:600px)': {
          fontSize: '1.3125rem',
        },
        '@media (min-width:960px)': {
          fontSize: '1.5rem',
        },
        '@media (min-width:1280px)': {
          fontSize: '1.5rem',
        },
      },
      h3: {
        fontSize: '1.0833333333333333rem',
        lineHeight: 1.4,
        fontWeight: 700,
        fontFamily: 'Caveat',
        textTransform: 'none',
        '@media (min-width:0px)': {
          fontSize: '1.0714rem',
        },
        '@media (min-width:600px)': {
          fontSize: '1.25rem',
        },
        '@media (min-width:960px)': {
          fontSize: '1.25rem',
        },
        '@media (min-width:1280px)': {
          fontSize: '1.25rem',
        },
      },
      h4: {
        fontSize: '1.0416666666666667rem',
        lineHeight: 1.55,
        fontWeight: 600,
        fontFamily: 'Caveat',
        textTransform: 'none',
        '@media (min-width:0px)': {
          fontSize: '0.9677rem',
        },
        '@media (min-width:600px)': {
          fontSize: '1.129rem',
        },
        '@media (min-width:960px)': {
          fontSize: '1.129rem',
        },
        '@media (min-width:1280px)': {
          fontSize: '1.129rem',
        },
      },
      h5: {
        fontSize: '1rem',
        lineHeight: 1.5,
        fontWeight: 700,
        fontFamily: 'Caveat',
        textTransform: 'none',
      },
      h6: {
        fontSize: '0.875rem',
        lineHeight: 1.43,
        fontWeight: 700,
        fontFamily: 'Caveat',
        textTransform: 'none',
      },
      subtitle1: {
        fontSize: '1rem',
        lineHeight: 1.5,
        fontWeight: 500,
        fontFamily: 'Caveat',
        textTransform: 'none',
      },
      subtitle2: {
        fontSize: '0.875rem',
        lineHeight: 1.43,
        fontWeight: 500,
        fontFamily: 'Caveat',
        textTransform: 'none',
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.75,
        fontFamily: 'Caveat',
        fontWeight: 400,
        textTransform: 'none',
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.43,
        fontFamily: 'Caveat',
        fontWeight: 400,
        textTransform: 'none',
      },
      caption: {
        fontSize: '0.75rem',
        lineHeight: 1.33,
        fontFamily: 'Caveat',
        fontWeight: 400,
        textTransform: 'none',
      },
      overline: {
        fontSize: '0.75rem',
        lineHeight: 1.33,
        fontWeight: 500,
        fontFamily: 'Caveat',
        textTransform: 'none',
      },
      color: {
        main: '#222222',
        gray: '#9e9e9e',
      },
      htmlFontSize: 16,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
      inherit: {
        fontFamily: 'inherit',
        fontWeight: 'inherit',
        fontSize: 'inherit',
        lineHeight: 'inherit',
        letterSpacing: 'inherit',
      },
    },
    mixins: {
      toolbar: {
        minHeight: 56,
        '@media (min-width:0px)': {
          '@media (orientation: landscape)': {
            minHeight: 48,
          },
        },
        '@media (min-width:600px)': {
          minHeight: 64,
        },
      },
    },
    shadows: [
      'none',
      '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
      '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
      '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
      '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
      '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
      '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
      '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
      '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
      '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
      '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
      '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
      '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
      '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
      '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
      '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
      '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
      '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
      '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
      '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
      '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
      '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
      '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
      '0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)',
      '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)',
    ],
    transitions: {
      easing: {
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
      },
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195,
      },
    },
    zIndex: {
      mobileStepper: 1000,
      fab: 1050,
      speedDial: 1050,
      appBar: 1100,
      drawer: 1200,
      modal: 1300,
      snackbar: 1400,
      tooltip: 1500,
    },
  });
  const [loading, setLoading] = useState(true);

  // 从父页面拉取 theme
  useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      if (event.data?.type === 'SEND_THEME') {
        setTheme(event.data.payload);
        setLoading(false);
      }
    };

    // 不在 iframe 中或不同域
    if (window.parent === window || window.location.origin !== window.parent.location.origin) {
      setLoading(false);
    } else {
      window.parent?.postMessage({ type: 'REQUEST_THEME' }, window.location.origin);
    }

    window.addEventListener('message', messageHandler);

    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, []);

  return { data: theme, loading };
}
