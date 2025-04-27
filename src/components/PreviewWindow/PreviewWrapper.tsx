import { Box, Paper, useTheme } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import ThemeWrapper from 'src/components/ThemeWrapper';
import { RootState } from 'src/state/types';

interface PreviewWrapperProps {
  children: React.ReactNode;
}

/**
 * Wraps children in ThemeWrapper and creates a letterbox around the component
 */
function PreviewWrapper({ children }: PreviewWrapperProps) {
  return (
    <Box
      sx={{
        height: 1,
        position: 'relative',
      }}>
      <ThemeWrapper>
        <Box
          sx={{
            height: 1,
            backgroundColor: '#F8F8F8',
          }}>
          <PreviewBackground>{children}</PreviewBackground>
        </Box>
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
  const previewSize = useSelector((state: RootState) => state.previewSize);
  return (
    <Paper
      elevation={8}
      square
      sx={{
        maxWidth: (() => {
          if (previewSize === 'xs') return 375;
          if (previewSize === 'sm') return 650;
          return 'unset';
        })(),
        height: 1,
        overflowY: 'auto',
        margin: 'auto',
        position: 'relative', // for FAB positioning
        zIndex: 1,
      }}
      dir={directionIsRTL ? 'rtl' : ''}>
      {children}
    </Paper>
  );
}
