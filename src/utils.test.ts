import * as utils from './utils';

describe('getByPath Tests', () => {
  const data = {
    foo: {
      bar: {
        baz: 1,
      },
    },
  };
  test('getByPath gets existing value', () => {
    expect(utils.getByPath(data, 'foo.bar.baz')).toBe(1);
  });
  test('getByPath returns undefined on path not found', () => {
    expect(utils.getByPath(data, 'foo.bar.none')).toBeUndefined();
  });
  test('getByPath returns specified defaultValue on path not found', () => {
    expect(utils.getByPath(data, 'foo.bar.none', 2)).toBe(2);
  });
  test('getByPath gets existing value, with defaultValue passed', () => {
    expect(utils.getByPath(data, 'foo.bar.baz', 2)).toBe(1);
  });
});

describe('removeByPath Tests', () => {
  test('removeByPath removes value', () => {
    expect(
      utils.removeByPath(
        {
          foo: {
            bar: {
              baz: {
                bat: 4,
                qux: 5,
              },
            },
          },
        },
        'foo.bar.baz.bat',
      ),
    ).toEqual({
      foo: {
        bar: {
          baz: {
            qux: 5,
          },
        },
      },
    });
  });

  test('removeByPath returns original object on path not found', () => {
    const data = {
      foo: {
        bar: {
          baz: {
            bat: 4,
            qux: 5,
          },
        },
      },
    };
    expect(utils.removeByPath(data, 'foo.bar.none')).toEqual(data);
  });

  test('removeByPath removes empty parents after delete', () => {
    expect(
      utils.removeByPath(
        {
          foobar: 10,
          foo: {
            barbar: 20,
            bar: {
              baz: 5,
            },
          },
        },
        'foo.bar.baz',
      ),
    ).toEqual({
      foobar: 10,
      foo: {
        barbar: 20,
      },
    });

    expect(
      utils.removeByPath(
        {
          foobar: 10,
          foo: {
            bar: {
              baz: 5,
            },
          },
        },
        'foo.bar.baz',
      ),
    ).toEqual({
      foobar: 10,
    });

    expect(
      utils.removeByPath(
        {
          foo: {
            bar: {
              baz: 5,
            },
          },
        },
        'foo.bar.baz',
      ),
    ).toEqual({});
  });
});

describe('isSetEq Tests', () => {
  test('Equal Sets return true', () => {
    expect(utils.isSetEq(new Set([1, 2, 3, 4]), new Set([1, 2, 3, 4]))).toBeTruthy();
  });
  test('Inequal Sets return false', () => {
    expect(utils.isSetEq(new Set([1, 2, 3, 4]), new Set([5, 6, 7, 8]))).toBeFalsy();
  });
});

describe('diffJSON Tests', () => {
  // Basic theme objects for testing
  const baseTheme = {
    palette: {
      mode: 'light',
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
      },
      secondary: {
        main: '#9c27b0',
        light: '#ba68c8',
        dark: '#7b1fa2',
      },
    },
    typography: {
      fontFamily: 'Roboto',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 500,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
    },
  };

  const modifiedTheme = {
    palette: {
      mode: 'dark', // Changed from light to dark
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
      },
      secondary: {
        main: '#9c27b0',
        light: '#ba68c8',
        dark: '#7b1fa2',
      },
    },
    typography: {
      fontFamily: 'Roboto',
      h1: {
        fontSize: '3rem', // Changed from 2.5rem
        fontWeight: 500,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12, // Changed from 8
          },
        },
      },
    },
  };

  test('returns undefined when objects are identical', () => {
    expect(utils.diffJSON(baseTheme, baseTheme)).toBeUndefined();
  });

  test('returns full object when target is undefined', () => {
    expect(utils.diffJSON(baseTheme, undefined)).toEqual(baseTheme);
  });

  test('returns full object when target is null', () => {
    expect(utils.diffJSON(baseTheme, null)).toEqual(baseTheme);
  });

  test('returns undefined when comparing null with null', () => {
    expect(utils.diffJSON(null, null)).toBeUndefined();
  });

  test('returns source when comparing different primitive values', () => {
    expect(utils.diffJSON('light', 'dark')).toBe('light');
    expect(utils.diffJSON(8, 12)).toBe(8);
    expect(utils.diffJSON(true, false)).toBe(true);
  });

  test('returns only changed values in theme object', () => {
    const expectedDiff = {
      palette: {
        mode: 'dark',
      },
      typography: {
        h1: {
          fontSize: '3rem',
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 12,
            },
          },
        },
      },
    };
    expect(utils.diffJSON(modifiedTheme, baseTheme)).toEqual(expectedDiff);
  });

  test('handles nested array differences in theme configuration', () => {
    const themeWithArray = {
      ...baseTheme,
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            '@font-face': [
              { fontFamily: 'Roboto', src: 'url(roboto.woff2)' },
              { fontFamily: 'Roboto', src: 'url(roboto-bold.woff2)', fontWeight: 700 },
            ],
          },
        },
      },
    };

    const modifiedThemeWithArray = {
      ...baseTheme,
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            '@font-face': [
              { fontFamily: 'Roboto', src: 'url(roboto.woff2)' },
              { fontFamily: 'Roboto', src: 'url(roboto-medium.woff2)', fontWeight: 500 },
            ],
          },
        },
      },
    };

    const expectedDiff = {
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            '@font-face': [
              { fontFamily: 'Roboto', src: 'url(roboto.woff2)' },
              { fontFamily: 'Roboto', src: 'url(roboto-medium.woff2)', fontWeight: 500 },
            ],
          },
        },
      },
    };

    expect(utils.diffJSON(modifiedThemeWithArray, themeWithArray)).toEqual(expectedDiff);
  });

  test('handles new properties added to theme', () => {
    const themeWithNewProp = {
      ...baseTheme,
      shape: {
        borderRadius: 4,
      },
    };

    const expectedDiff = {
      shape: {
        borderRadius: 4,
      },
    };

    expect(utils.diffJSON(themeWithNewProp, baseTheme)).toEqual(expectedDiff);
  });

  test('handles removed properties from theme', () => {
    const themeWithoutProp = {
      palette: {
        mode: 'light',
        primary: {
          main: '#1976d2',
          light: '#42a5f5',
          dark: '#1565c0',
        },
      },
      typography: {
        fontFamily: 'Roboto',
        h1: {
          fontSize: '2.5rem',
          fontWeight: 500,
        },
      },
    };

    expect(utils.diffJSON(themeWithoutProp, baseTheme)).toEqual(undefined);
  });

  test('handles complex theme overrides', () => {
    const themeWithOverrides = {
      ...baseTheme,
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              padding: '8px 16px',
            },
            contained: {
              boxShadow: 'none',
            },
          },
        },
        MuiTextField: {
          defaultProps: {
            variant: 'outlined',
          },
        },
      },
    };

    const modifiedThemeWithOverrides = {
      ...baseTheme,
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              padding: '8px 16px',
            },
            contained: {
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            },
          },
        },
        MuiTextField: {
          defaultProps: {
            variant: 'filled',
          },
        },
      },
    };

    const expectedDiff = {
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 12,
            },
            contained: {
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            },
          },
        },
        MuiTextField: {
          defaultProps: {
            variant: 'filled',
          },
        },
      },
    };

    expect(utils.diffJSON(modifiedThemeWithOverrides, themeWithOverrides)).toEqual(expectedDiff);
  });
});
