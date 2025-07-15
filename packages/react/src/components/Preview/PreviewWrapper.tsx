import { Box, BoxProps, Paper, useTheme } from '@mui/material';
import React from 'react';
import ThemeWrapper from 'src/components/ThemeWrapper';
import { useThemeBuilder } from 'src/context/themeBuilder';

interface PreviewWrapperProps extends BoxProps {
  children: React.ReactNode;
}

/**
 * Wraps children in ThemeWrapper and creates a letterbox around the component
 */
function PreviewWrapper({ children, ...props }: PreviewWrapperProps) {
  return (
    <Box className="preview-wrapper" {...props}>
      <ThemeWrapper>
        <PreviewBackground>{children}</PreviewBackground>
      </ThemeWrapper>
    </Box>
  );
}

export default PreviewWrapper;

interface PreviewBackgroundProps {
  children: React.ReactNode;
}

/**
 * Creates a Paper component with a backgroundColor of `palette.background.default`
 * adds 'rtl' as a className if required by the theme to enable RTL styles.
 */
function PreviewBackground({ children }: PreviewBackgroundProps) {
  const theme = useTheme();
  const directionIsRTL = theme.direction === 'rtl';
  const previewSize = useThemeBuilder((s) => s.previewSize);

  return (
    <Paper
      sx={{
        maxWidth: (() => {
          if (previewSize === 'xs') return 375;
          if (previewSize === 'sm') return 650;
          return 'unset';
        })(),
        height: 1,
        overflow: 'auto',
        margin: 'auto',
        position: 'relative', // for FAB positioning
        zIndex: 1,
        backgroundColor: 'background.default',
        backgroundImage: 'none',
      }}
      dir={directionIsRTL ? 'rtl' : ''}>
      {children}
    </Paper>
  );
}
