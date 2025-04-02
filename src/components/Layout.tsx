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
import React, { useMemo } from 'react';
import useBlockletInfo from 'src/hooks/use-blocklet-info';
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
    <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>{children}</Box>
  );
}

function Layout({ children }: LayoutProps) {
  const schemaKey = useSchemaKey();
  const syncLoading = useRemoteThemeSync();
  const { data: blockletInfo, loading: blockletInfoLoading } = useBlockletInfo(schemaKey);
  const loading = syncLoading || blockletInfoLoading;
  const siteTheme = useMemo(() => {
    if (blockletInfoLoading) return {};

    const baseThemeOptions = blockletInfo?.theme?.light ?? {
      palette: {
        mode: 'light',
        primary: {
          main: '#1DC1C7',
        },
        secondary: {
          main: '#16CED1',
        },
      },
    };

    return createTheme(deepmerge(baseThemeOptions, siteThemeOptions));
  }, [blockletInfo, blockletInfoLoading]);

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
