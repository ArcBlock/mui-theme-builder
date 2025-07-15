import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import { ThemeProvider } from '@arcblock/ux/lib/Theme';
import { ThemeBuilder } from '@blocklet/theme-builder-react';
import { Alert, Box, CircularProgress, Theme, createTheme } from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import ErrorBoundary from 'src/components/ErrorBoundary';
import useParentLocale from 'src/hooks/useParentLocale';
import useParentTheme from 'src/hooks/useParentTheme';
import useRemoteThemeSync from 'src/hooks/useRemoteThemeSync';
import useSchemaKey from 'src/hooks/useSchemaKey';
import { isDev } from 'src/utils';

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
  const { changeLocale } = useLocaleContext();
  const loading = syncLoading || parentThemeLoading;

  // 跟随父页面主题
  const siteTheme = useMemo(() => {
    if (parentThemeLoading) return {} as Theme;

    return createTheme(parentTheme);
  }, [parentTheme, parentThemeLoading]);

  // 跟随父页面 locale
  useEffect(() => {
    changeLocale(locale);
  }, [changeLocale, locale]);

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
        <ThemeBuilder showPreview locale={locale} themeData={themeData} />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default Index;
