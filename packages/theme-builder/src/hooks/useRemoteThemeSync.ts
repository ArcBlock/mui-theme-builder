import { type ThemeData, getTheme } from '@blocklet/theme-builder-react';
import { useEffect, useState } from 'react';

import { getAuthHeaders, isDev } from '../utils';
import useSchemaKey from './useSchemaKey';

export default function useRemoteThemeSync() {
  const schemaKey = useSchemaKey();
  const [loading, setLoading] = useState(!isDev);
  const [themeData, setThemeData] = useState<ThemeData>();

  useEffect(() => {
    if (isDev) {
      return;
    }

    getTheme({
      url: schemaKey,
      headers: getAuthHeaders(),
    }).finally(() => {
      setLoading(false);
    });
  }, [setThemeData, schemaKey]);

  return { loading, themeData };
}
