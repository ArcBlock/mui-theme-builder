import { Box, Paper } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import ThemeWrapper from 'src/components/ThemeWrapper';
import { RootState } from 'src/state/types';

import PreviewSizeControls from './PreviewSizeControls';

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
      <PreviewSizeControls />
      <ThemeWrapper>
        <Box
          sx={{
            bgcolor: '#212121',
            p: 2,
            height: 1,
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
  // if the theme has `direction` set to 'rtl', then add 'rtl' as a classname
  // to the Paper component, so that RTL styles will be enabled
  const directionIsRTL = useSelector((state: RootState) => state.themeOptions.direction === 'rtl');
  const previewSize = useSelector((state: RootState) => state.previewSize);
  return (
    <Paper
      elevation={8}
      square
      sx={{
        bgcolor: 'background.default',
        maxWidth: (() => {
          if (previewSize === 'xs') return 375;
          if (previewSize === 'sm') return 650;
          return 1000;
        })(),
        height: 1,
        overflowY: 'scroll',
        margin: 'auto',
        position: 'relative', // for FAB positioning
      }}
      dir={directionIsRTL ? 'rtl' : ''}>
      {children}
    </Paper>
  );
}
