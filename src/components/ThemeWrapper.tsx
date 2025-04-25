import { ThemeProvider } from '@arcblock/ux/lib/Theme';
import Paper, { PaperProps } from '@mui/material/Paper';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/state/types';

interface ThemeWrapperProps {
  children: React.ReactNode;
}

/**
 *
 * Wraps example content in the dynamically controlled theme
 * set by the theme editor sidebar
 */
function ThemeWrapper({ children }: ThemeWrapperProps) {
  const themeObject = useSelector((state: RootState) => state.themeObject);

  return (
    <ThemeProvider theme={themeObject} injectFirst>
      <ThemeContainer>{children}</ThemeContainer>
    </ThemeProvider>
  );
}

/**
 * CssBaseline
 */
function ThemeContainer({ children, ...rest }: PaperProps) {
  return (
    <Paper
      {...rest}
      sx={{
        bgcolor: 'background.default',
        width: '100%',
        height: '100%',
      }}
      elevation={0}
      square>
      {children}
    </Paper>
  );
}

export default ThemeWrapper;
