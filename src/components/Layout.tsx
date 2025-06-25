import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import { ThemeProvider, deepmerge } from '@arcblock/ux/lib/Theme';
import { ToastProvider } from '@arcblock/ux/lib/Toast';
import { Alert, Box, CircularProgress, Theme, createTheme } from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import useParentLocale from 'src/hooks/useParentLocale';
import useParentTheme from 'src/hooks/useParentTheme';
import useRemoteThemeSync from 'src/hooks/useRemoteThemeSync';
import useSchemaKey from 'src/hooks/useSchemaKey';
import { createSiteThemeOptions } from 'src/siteTheme';
import { isDev } from 'src/utils';

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
  const { locale } = useParentLocale();
  const { changeLocale } = useLocaleContext();
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

  // 跟随父页面 locale 变化
  useEffect(() => {
    changeLocale(locale);
  }, [locale]);

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
