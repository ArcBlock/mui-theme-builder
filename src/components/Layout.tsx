import {
  Alert,
  Box,
  CircularProgress,
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import deepmerge from 'deepmerge';
import React, { useEffect, useMemo } from 'react';
import useParentTheme from 'src/hooks/use-parent-theme';
import useRemoteThemeSync from 'src/hooks/use-remote-theme-sync';
import useSchemaKey from 'src/hooks/use-schema-key';
import { siteThemeOptions } from 'src/siteTheme';
import { isDev } from 'src/utils';

import './layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

function Center({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
      }}>
      {children}
    </Box>
  );
}

function Layout({ children }: LayoutProps) {
  const schemaKey = useSchemaKey();
  const syncLoading = useRemoteThemeSync();
  const { data: parentTheme, loading: parentThemeLoading } = useParentTheme();
  const loading = syncLoading || parentThemeLoading;
  const siteTheme = useMemo(() => {
    if (parentThemeLoading) return {};

    return createTheme(deepmerge(parentTheme, siteThemeOptions));
  }, [parentTheme, parentThemeLoading]);

  // 通知父页面已经加载完毕
  useEffect(() => {
    if (window.parent !== window && !loading) {
      window.parent?.postMessage({ type: 'THEME_BUILDER_LOADED' }, window.location.origin);
    }
  }, [loading]);

  if (!schemaKey && !isDev) {
    return (
      <Center>
        <Alert severity="error">Theme Builder requires a valid schemaKey to work</Alert>
      </Center>
    );
  }

  if (loading) {
    return (
      <Center>
        <CircularProgress />
      </Center>
    );
  }

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={siteTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default Layout;
