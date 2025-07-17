import { ThemeProvider } from '@arcblock/ux/lib/Theme';
import { ThemeBuilder } from '@blocklet/theme-builder-react';
import { Alert, Box, CircularProgress, Theme, createTheme } from '@mui/material';
import React, { useEffect, useMemo } from 'react';

import ErrorBoundary from '../components/ErrorBoundary';
import useParentLocale from '../hooks/useParentLocale';
import useParentTheme from '../hooks/useParentTheme';
import useRemoteThemeSync from '../hooks/useRemoteThemeSync';
import useSave from '../hooks/useSave';
import useSchemaKey from '../hooks/useSchemaKey';

export const isDev = process.env.NODE_ENV === 'development';

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

function Index() {
  const schemaKey = useSchemaKey();
  const { loading: syncLoading, themeData } = useRemoteThemeSync();
  const { parentTheme, loading: parentThemeLoading } = useParentTheme();
  const { locale } = useParentLocale();
  const { saveTheme } = useSave();
  const loading = syncLoading || parentThemeLoading;

  // 跟随父页面主题
  const siteTheme = useMemo(() => {
    if (parentThemeLoading) return {} as Theme;

    return createTheme(parentTheme);
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
    <ErrorBoundary>
      <ThemeProvider theme={siteTheme} injectFirst>
        <ThemeBuilder showPreview locale={locale} themeData={themeData} onSave={saveTheme} />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default Index;
