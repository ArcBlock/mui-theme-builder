import { ThemeProvider } from '@arcblock/ux/lib/Theme';
import { Box, BoxProps } from '@mui/material';
import React from 'react';
import { useThemeBuilder } from 'src/context/themeBuilder';
import useScrollbarStyle from 'src/hooks/useScrollbarStyle';

interface ThemeWrapperProps {
  children: React.ReactNode;
}

/**
 *
 * Wraps example content in the dynamically controlled theme
 * set by the theme editor sidebar
 */
function ThemeWrapper({ children }: ThemeWrapperProps) {
  const themeObject = useThemeBuilder((s) => s.themeObject);

  return (
    <ThemeProvider theme={themeObject} darkSchemeClass="dark-color-scheme" injectFirst>
      <ThemeContainer className="dark-color-scheme">{children}</ThemeContainer>
    </ThemeProvider>
  );
}

/**
 * CssBaseline
 */
function ThemeContainer({ children, ...rest }: BoxProps) {
  const scrollbarStyle = useScrollbarStyle();

  return (
    <Box
      {...rest}
      sx={{
        ...scrollbarStyle,
      }}>
      {children}
    </Box>
  );
}

export default ThemeWrapper;
