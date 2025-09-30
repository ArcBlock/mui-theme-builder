import { type ThemeSetting, getTheme } from '@blocklet/theme-builder-react';
import { useEffect, useState } from 'react';

import { getAuthHeaders, isDev } from '../utils';
import useSchemaKey from './useSchemaKey';

export default function useRemoteThemeSync() {
  const schemaKey = useSchemaKey();
  const [loading, setLoading] = useState(!isDev);
  const [themeSetting, setThemeSetting] = useState<ThemeSetting>();

  useEffect(() => {
    if (isDev) {
      return;
    }

    getTheme({
      url: schemaKey,
      headers: getAuthHeaders(),
    })
      .then((data) => {
        setThemeSetting(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setThemeSetting, schemaKey]);

  return { loading, themeSetting };
}
