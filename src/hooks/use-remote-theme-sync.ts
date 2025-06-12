import { deepmerge } from '@arcblock/ux/lib/Theme';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { defaultThemeOptions } from 'src/siteTheme';
import { getAuthHeaders, isDev } from 'src/utils';

import useSchemaKey from './use-schema-key';

export default function useRemoteThemeSync() {
  const [loading, setLoading] = useState(!isDev);
  const dispatch = useDispatch();
  const schemaKey = useSchemaKey();

  useEffect(() => {
    if (isDev) {
      dispatch({
        type: 'SET_THEME_OPTIONS',
        themeOptions: deepmerge(defaultThemeOptions, {
          light: {
            palette: {
              mode: 'light',
              primary: {
                main: '#00bba7',
                contrastText: '#fff',
                light: '#00d5be',
                dark: '#009689',
              },
              secondary: {
                main: '#00b8db',
                contrastText: '#fff',
                light: '#00d3f3',
                dark: '#0092bb',
              },
              error: {
                main: '#fb2c36',
                contrastText: '#fff',
                light: '#ff6467',
                dark: '#e7000b',
              },
              warning: {
                main: '#ff6900',
                contrastText: '#fff',
                light: '#ff8904',
                dark: '#f54900',
              },
              info: {
                main: '#2b7fff',
                contrastText: '#fff',
                light: '#51a2ff',
                dark: '#155dfc',
              },
              success: {
                main: '#00c950',
                contrastText: '#fff',
                light: '#05df72',
                dark: '#00a63e',
              },
              grey: {
                '50': '#fafafa',
                '100': '#f4f4f5',
                '200': '#e4e4e7',
                '300': '#d4d4d8',
                '400': '#9f9fa9',
                '500': '#71717b',
                '600': '#52525c',
                '700': '#3f3f47',
                '800': '#27272a',
                '900': '#18181b',
                A100: '#09090b',
                A200: '#09090b',
                A400: '#09090b',
                A700: '#09090b',
              },
              text: {
                primary: '#18181b',
                secondary: '#71717b',
                disabled: '#d4d4d8',
                hint: '#d4d4d8',
                contrast: '#fff',
              },
              divider: '#F4F4F5',
              background: {
                default: '#fff',
                paper: '#fff',
              },
              common: {
                black: '#000',
                white: '#fff',
              },
              action: {
                active: 'rgba(24, 24, 27, 0.54)',
                hover: 'rgba(24, 24, 27, 0.04)',
                hoverOpacity: 0.04,
                selected: 'rgba(24, 24, 27, 0.08)',
                selectedOpacity: 0.08,
                disabled: 'rgba(24, 24, 27, 0.26)',
                disabledBackground: 'rgba(24, 24, 27, 0.12)',
                disabledOpacity: 0.38,
                focus: 'rgba(24, 24, 27, 0.12)',
                focusOpacity: 0.12,
                activatedOpacity: 0.12,
              },
              storeSecondary: {
                main: '#EBFEFF',
                contrastText: '#fff',
              },
              did: {
                primary: '#4598FA',
                secondary: '#49C3AD',
              },
            },
            shape: {
              borderRadius: 8,
            },
            typography: {
              fontSize: 14,
              fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
              button: {
                fontWeight: 700,
                textTransform: 'none',
              },
              allVariants: {
                textTransform: 'none',
              },
              color: {
                main: '#18181b',
                gray: '#71717b',
              },
              h1: {
                fontSize: '1.875rem',
                lineHeight: 1.2,
                fontWeight: 700,
                fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
                textTransform: 'none',
              },
              h2: {
                fontSize: '1.5rem',
                lineHeight: 1.3333333,
                fontWeight: 700,
                fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
                textTransform: 'none',
              },
              h3: {
                fontSize: '1.25rem',
                lineHeight: 1.4,
                fontWeight: 700,
                fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
                textTransform: 'none',
              },
              h4: {
                fontSize: '1.125rem',
                lineHeight: 1.55,
                fontWeight: 600,
                fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
                textTransform: 'none',
              },
              h5: {
                fontSize: '1rem',
                lineHeight: 1.5,
                fontWeight: 700,
                fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
                textTransform: 'none',
              },
              h6: {
                fontSize: '0.875rem',
                lineHeight: 1.43,
                fontWeight: 700,
                fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
                textTransform: 'none',
              },
              subtitle1: {
                fontSize: '1rem',
                lineHeight: 1.43,
                fontWeight: 500,
                fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
                textTransform: 'none',
              },
              subtitle2: {
                fontSize: '0.875rem',
                lineHeight: 1.43,
                fontWeight: 500,
                fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
                textTransform: 'none',
              },
              body1: {
                fontSize: '1rem',
                lineHeight: 1.5,
                fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
                fontWeight: 400,
                textTransform: 'none',
              },
              body2: {
                fontSize: '0.875rem',
                lineHeight: 1.43,
                fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
                fontWeight: 400,
                textTransform: 'none',
              },
              caption: {
                fontSize: '0.75rem',
                lineHeight: 1.33,
                fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
                fontWeight: 400,
                textTransform: 'none',
              },
              overline: {
                fontSize: '0.75rem',
                lineHeight: 1.33,
                fontWeight: 500,
                fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
                textTransform: 'none',
              },
            },
            breakpoints: {
              values: {
                xs: 0,
                sm: 600,
                md: 960,
                lg: 1280,
                xl: 1920,
              },
            },
            shadows: [
              'none',
              '0px 1px 2px 0px rgba(24,24,27,0.06),0px 1px 3px 0px rgba(24,24,27,0.03)',
              '0px 1.5px 3px 0px rgba(24,24,27,0.07),0px 1px 4px 0px rgba(24,24,27,0.035)',
              '0px 2px 4px 0px rgba(24,24,27,0.08),0px 1.5px 5px 0px rgba(24,24,27,0.04)',
              '0px 2px 8px 0px rgba(24,24,27,0.09),0px 2px 6px 0px rgba(24,24,27,0.045)',
              '0px 2.5px 10px 0px rgba(24,24,27,0.10),0px 2px 7px 0px rgba(24,24,27,0.05)',
              '0px 3px 12px 0px rgba(24,24,27,0.11),0px 2.5px 8px 0px rgba(24,24,27,0.055)',
              '0px 3.5px 14px 0px rgba(24,24,27,0.12),0px 3px 9px 0px rgba(24,24,27,0.06)',
              '0px 4px 16px 0px rgba(24,24,27,0.13),0px 3.5px 10px 0px rgba(24,24,27,0.065)',
              '0px 4.5px 18px 0px rgba(24,24,27,0.14),0px 4px 11px 0px rgba(24,24,27,0.07)',
              '0px 5px 20px 0px rgba(24,24,27,0.15),0px 4.5px 12px 0px rgba(24,24,27,0.075)',
              '0px 5.5px 22px 0px rgba(24,24,27,0.16),0px 5px 13px 0px rgba(24,24,27,0.08)',
              '0px 6px 24px 0px rgba(24,24,27,0.17),0px 5.5px 14px 0px rgba(24,24,27,0.085)',
              '0px 6.5px 26px 0px rgba(24,24,27,0.18),0px 6px 15px 0px rgba(24,24,27,0.09)',
              '0px 7px 28px 0px rgba(24,24,27,0.19),0px 6.5px 16px 0px rgba(24,24,27,0.095)',
              '0px 7.5px 30px 0px rgba(24,24,27,0.20),0px 7px 17px 0px rgba(24,24,27,0.10)',
              '0px 8px 32px 0px rgba(24,24,27,0.21),0px 7.5px 18px 0px rgba(24,24,27,0.105)',
              '0px 8.5px 34px 0px rgba(24,24,27,0.22),0px 8px 19px 0px rgba(24,24,27,0.11)',
              '0px 9px 36px 0px rgba(24,24,27,0.23),0px 8.5px 20px 0px rgba(24,24,27,0.115)',
              '0px 9.5px 38px 0px rgba(24,24,27,0.24),0px 9px 21px 0px rgba(24,24,27,0.12)',
              '0px 10px 40px 0px rgba(24,24,27,0.25),0px 9.5px 22px 0px rgba(24,24,27,0.125)',
              '0px 10.5px 42px 0px rgba(24,24,27,0.26),0px 10px 23px 0px rgba(24,24,27,0.13)',
              '0px 11px 44px 0px rgba(24,24,27,0.27),0px 10.5px 24px 0px rgba(24,24,27,0.135)',
              '0px 11.5px 46px 0px rgba(24,24,27,0.28),0px 11px 25px 0px rgba(24,24,27,0.14)',
              '0px 12px 48px 0px rgba(24,24,27,0.29),0px 11.5px 26px 0px rgba(24,24,27,0.145)',
            ],
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
                    color: '#18181b',
                  },
                  body: {
                    color: '#18181b',
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
              MuiTooltip: {
                styleOverrides: {
                  tooltip: {
                    backgroundColor: '#3f3f47',
                    color: '#fff',
                  },
                },
              },
              MuiPaper: {
                styleOverrides: {
                  root: {
                    backgroundImage: 'none',
                  },
                },
              },
            },
          },
          dark: {
            palette: {
              mode: 'dark',
              primary: {
                main: '#00d5be',
                contrastText: '#121212',
                light: '#4ce3d0',
                dark: '#00a89a',
              },
              secondary: {
                main: '#00d3f3',
                contrastText: '#121212',
                light: '#51e1ff',
                dark: '#00a2c0',
              },
              error: {
                main: '#ff6467',
                contrastText: '#121212',
                light: '#ff9598',
                dark: '#e7000b',
              },
              warning: {
                main: '#ff8904',
                contrastText: '#121212',
                light: '#ffa644',
                dark: '#f54900',
              },
              info: {
                main: '#51a2ff',
                contrastText: '#121212',
                light: '#83c3ff',
                dark: '#1570e5',
              },
              success: {
                main: '#05df72',
                contrastText: '#121212',
                light: '#56e799',
                dark: '#00b24a',
              },
              grey: {
                '50': '#18181b',
                '100': '#27272a',
                '200': '#3f3f47',
                '300': '#52525c',
                '400': '#71717b',
                '500': '#9f9fa9',
                '600': '#d4d4d8',
                '700': '#e4e4e7',
                '800': '#f4f4f5',
                '900': '#fafafa',
                A100: '#f8f8fa',
                A200: '#f8f8fa',
                A400: '#f8f8fa',
                A700: '#f8f8fa',
              },
              text: {
                primary: '#ffffff',
                secondary: '#d4d4d8',
                disabled: '#52525c',
                hint: '#71717b',
                contrast: '#18181b',
              },
              divider: '#3f3f47',
              background: {
                default: '#121212',
                paper: '#18181b',
              },
              common: {
                black: '#000',
                white: '#fff',
              },
              action: {
                active: 'rgba(255, 255, 255, 0.54)',
                hover: 'rgba(255, 255, 255, 0.08)',
                hoverOpacity: 0.08,
                selected: 'rgba(255, 255, 255, 0.16)',
                selectedOpacity: 0.16,
                disabled: 'rgba(255, 255, 255, 0.26)',
                disabledBackground: 'rgba(255, 255, 255, 0.12)',
                disabledOpacity: 0.38,
                focus: 'rgba(255, 255, 255, 0.12)',
                focusOpacity: 0.12,
                activatedOpacity: 0.24,
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
            },
            shape: {
              borderRadius: 8,
            },
            typography: {
              fontSize: 14,
              fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
              button: {
                fontWeight: 700,
                textTransform: 'none',
              },
              allVariants: {
                textTransform: 'none',
              },
              color: {
                main: '#fff',
                gray: '#9e9e9e',
              },
              h1: {
                fontSize: '1.875rem',
                lineHeight: 1.2,
                fontWeight: 700,
                fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
                textTransform: 'none',
              },
              h2: {
                fontSize: '1.5rem',
                lineHeight: 1.3333333,
                fontWeight: 700,
                fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
                textTransform: 'none',
              },
              h3: {
                fontSize: '1.25rem',
                lineHeight: 1.4,
                fontWeight: 700,
                fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
                textTransform: 'none',
              },
              h4: {
                fontSize: '1.125rem',
                lineHeight: 1.55,
                fontWeight: 600,
                fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
                textTransform: 'none',
              },
              h5: {
                fontSize: '1rem',
                lineHeight: 1.5,
                fontWeight: 700,
                fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
                textTransform: 'none',
              },
              h6: {
                fontSize: '0.875rem',
                lineHeight: 1.43,
                fontWeight: 700,
                fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
                textTransform: 'none',
              },
              subtitle1: {
                fontSize: '1rem',
                lineHeight: 1.43,
                fontWeight: 500,
                fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
                textTransform: 'none',
              },
              subtitle2: {
                fontSize: '0.875rem',
                lineHeight: 1.43,
                fontWeight: 500,
                fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
                textTransform: 'none',
              },
              body1: {
                fontSize: '1rem',
                lineHeight: 1.5,
                fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
                fontWeight: 400,
                textTransform: 'none',
              },
              body2: {
                fontSize: '0.875rem',
                lineHeight: 1.43,
                fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
                fontWeight: 400,
                textTransform: 'none',
              },
              caption: {
                fontSize: '0.75rem',
                lineHeight: 1.33,
                fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
                fontWeight: 400,
                textTransform: 'none',
              },
              overline: {
                fontSize: '0.75rem',
                lineHeight: 1.33,
                fontWeight: 500,
                fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
                textTransform: 'none',
              },
            },
            breakpoints: {
              values: {
                xs: 0,
                sm: 600,
                md: 960,
                lg: 1280,
                xl: 1920,
              },
            },
            shadows: [
              'none',
              '0px 1px 2px 0px rgba(24,24,27,0.06),0px 1px 3px 0px rgba(24,24,27,0.03)',
              '0px 1.5px 3px 0px rgba(24,24,27,0.07),0px 1px 4px 0px rgba(24,24,27,0.035)',
              '0px 2px 4px 0px rgba(24,24,27,0.08),0px 1.5px 5px 0px rgba(24,24,27,0.04)',
              '0px 2px 8px 0px rgba(24,24,27,0.09),0px 2px 6px 0px rgba(24,24,27,0.045)',
              '0px 2.5px 10px 0px rgba(24,24,27,0.10),0px 2px 7px 0px rgba(24,24,27,0.05)',
              '0px 3px 12px 0px rgba(24,24,27,0.11),0px 2.5px 8px 0px rgba(24,24,27,0.055)',
              '0px 3.5px 14px 0px rgba(24,24,27,0.12),0px 3px 9px 0px rgba(24,24,27,0.06)',
              '0px 4px 16px 0px rgba(24,24,27,0.13),0px 3.5px 10px 0px rgba(24,24,27,0.065)',
              '0px 4.5px 18px 0px rgba(24,24,27,0.14),0px 4px 11px 0px rgba(24,24,27,0.07)',
              '0px 5px 20px 0px rgba(24,24,27,0.15),0px 4.5px 12px 0px rgba(24,24,27,0.075)',
              '0px 5.5px 22px 0px rgba(24,24,27,0.16),0px 5px 13px 0px rgba(24,24,27,0.08)',
              '0px 6px 24px 0px rgba(24,24,27,0.17),0px 5.5px 14px 0px rgba(24,24,27,0.085)',
              '0px 6.5px 26px 0px rgba(24,24,27,0.18),0px 6px 15px 0px rgba(24,24,27,0.09)',
              '0px 7px 28px 0px rgba(24,24,27,0.19),0px 6.5px 16px 0px rgba(24,24,27,0.095)',
              '0px 7.5px 30px 0px rgba(24,24,27,0.20),0px 7px 17px 0px rgba(24,24,27,0.10)',
              '0px 8px 32px 0px rgba(24,24,27,0.21),0px 7.5px 18px 0px rgba(24,24,27,0.105)',
              '0px 8.5px 34px 0px rgba(24,24,27,0.22),0px 8px 19px 0px rgba(24,24,27,0.11)',
              '0px 9px 36px 0px rgba(24,24,27,0.23),0px 8.5px 20px 0px rgba(24,24,27,0.115)',
              '0px 9.5px 38px 0px rgba(24,24,27,0.24),0px 9px 21px 0px rgba(24,24,27,0.12)',
              '0px 10px 40px 0px rgba(24,24,27,0.25),0px 9.5px 22px 0px rgba(24,24,27,0.125)',
              '0px 10.5px 42px 0px rgba(24,24,27,0.26),0px 10px 23px 0px rgba(24,24,27,0.13)',
              '0px 11px 44px 0px rgba(24,24,27,0.27),0px 10.5px 24px 0px rgba(24,24,27,0.135)',
              '0px 11.5px 46px 0px rgba(24,24,27,0.28),0px 11px 25px 0px rgba(24,24,27,0.14)',
              '0px 12px 48px 0px rgba(24,24,27,0.29),0px 11.5px 26px 0px rgba(24,24,27,0.145)',
            ],
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
                    color: '#52525c',
                  },
                  body: {
                    color: '#52525c',
                  },
                },
              },
              MuiTableRow: {
                styleOverrides: {
                  root: {
                    '&:nth-child(even)': {
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    },
                  },
                  head: {
                    backgroundColor: 'transparent',
                  },
                },
              },
              MuiTooltip: {
                styleOverrides: {
                  tooltip: {
                    backgroundColor: '#3f3f47',
                    color: '#fff',
                  },
                },
              },
              MuiPaper: {
                styleOverrides: {
                  root: {
                    backgroundImage: 'none',
                    boxShadow:
                      '0px 3px 1px -2px rgba(120,120,123,0.15),0px 2px 2px 0px rgba(120,120,123,0.12),0px 1px 5px 0px rgba(120,120,123,0.1)',
                  },
                },
              },
              MuiAlert: {
                styleOverrides: {
                  standardError: {
                    backgroundColor: 'rgba(255, 100, 103, 0.25)',
                    color: '#ffa644',
                    '& .MuiAlert-icon': {
                      color: '#ffa644',
                    },
                  },
                  standardInfo: {
                    backgroundColor: 'rgba(81, 162, 255, 0.25)',
                    color: '#83c3ff',
                    '& .MuiAlert-icon': {
                      color: '#83c3ff',
                    },
                  },
                  standardWarning: {
                    backgroundColor: 'rgba(255, 137, 4, 0.25)',
                    color: '#ffa644',
                    '& .MuiAlert-icon': {
                      color: '#ffa644',
                    },
                  },
                  standardSuccess: {
                    backgroundColor: 'rgba(5, 223, 114, 0.25)',
                    color: '#56e799',
                    '& .MuiAlert-icon': {
                      color: '#56e799',
                    },
                  },
                },
              },
            },
          },
          prefer: 'system',
        }),
      });

      return;
    }

    axios
      .get(schemaKey, {
        headers: getAuthHeaders(),
      })
      .then((res) => {
        dispatch({
          type: 'SET_THEME_OPTIONS',
          themeOptions: deepmerge(defaultThemeOptions, res.data),
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch, schemaKey]);

  return loading;
}

// const x = { items: ['a', 'b'] };
// const y = { items: ['c'] };

// const merged = deepmerge(x, y);
// console.log(merged); // { items: ['c'] }
