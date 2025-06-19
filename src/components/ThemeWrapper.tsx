import { ThemeProvider } from '@arcblock/ux/lib/Theme';
import Paper, { PaperProps } from '@mui/material/Paper';
import React from 'react';
import { useThemeStore } from 'src/state/themeStore';
import useScrollbarStyle from 'src/hooks/use-scrollbar-style';

interface ThemeWrapperProps {
  children: React.ReactNode;
}

/**
 *
 * Wraps example content in the dynamically controlled theme
 * set by the theme editor sidebar
 */
function ThemeWrapper({ children }: ThemeWrapperProps) {
  const themeObject = useThemeStore((s) => s.themeObject);

  return (
    <ThemeProvider theme={themeObject} darkSchemeClass="dark-color-scheme" injectFirst>
      <ThemeContainer className="dark-color-scheme">{children}</ThemeContainer>
    </ThemeProvider>
  );
}

/**
 * CssBaseline
 */
function ThemeContainer({ children, ...rest }: PaperProps) {
  const scrollbarStyle = useScrollbarStyle();

  return (
    <Paper
      {...rest}
      sx={{
        bgcolor: 'background.default',
        width: '100%',
        height: '100%',
        ...scrollbarStyle,
      }}
      elevation={0}
      square>
      {children}
    </Paper>
  );
}

export default ThemeWrapper;
