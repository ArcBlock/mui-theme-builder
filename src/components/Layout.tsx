import { ThemeProvider, deepmerge } from '@arcblock/ux/lib/Theme';
import { ToastProvider } from '@arcblock/ux/lib/Toast';
import { Alert, Box, CircularProgress, Theme, createTheme } from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import useParentTheme from 'src/hooks/use-parent-theme';
import useRemoteThemeSync from 'src/hooks/use-remote-theme-sync';
import useSchemaKey from 'src/hooks/use-schema-key';
import { createSiteThemeOptions } from 'src/siteTheme';
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
    if (parentThemeLoading) return {} as Theme;

    return createTheme(deepmerge(parentTheme, createSiteThemeOptions(parentTheme)));
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
    <ThemeProvider theme={siteTheme} injectFirst>
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  );
}

export default Layout;
