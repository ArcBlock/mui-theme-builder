import { Box, Paper, useTheme } from '@mui/material';
import React from 'react';
import ThemeWrapper from 'src/components/ThemeWrapper';
import { useThemeStore } from 'src/state/themeStore';

interface PreviewWrapperProps {
  children: React.ReactNode;
}

/**
 * Wraps children in ThemeWrapper and creates a letterbox around the component
 */
function PreviewWrapper({ children }: PreviewWrapperProps) {
  return (
    <Box className="preview-wrapper" sx={{ height: 1 }}>
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
  const previewSize = useThemeStore((s) => s.previewSize);

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
