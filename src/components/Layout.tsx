import { Alert, Box, CircularProgress } from '@mui/material';
import React from 'react';
import useRemoteThemeSync from 'src/hooks/use-remote-theme-sync';
import useSchemaKey from 'src/hooks/use-schema-key';
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
  const loading = useRemoteThemeSync();

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

  return children;
}

export default Layout;
