import { deepmerge } from '@arcblock/ux/lib/Theme';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useThemeStore } from 'src/state/themeStore';
import { defaultThemeOptions } from 'src/siteTheme';
import { getAuthHeaders, isDev } from 'src/utils';

import useSchemaKey from './use-schema-key';

export default function useRemoteThemeSync() {
  const [loading, setLoading] = useState(!isDev);
  const updateThemeOptions = useThemeStore((s) => s.updateThemeOptions);
  const schemaKey = useSchemaKey();

  useEffect(() => {
    if (isDev) {
      return;
    }

    axios
      .get(schemaKey, {
        headers: getAuthHeaders(),
      })
      .then((res) => {
        const { light = {}, dark = {}, common = {}, prefer = 'light' } = res.data || {};

        updateThemeOptions(
          deepmerge(defaultThemeOptions, {
            light: deepmerge(common, light),
            dark: deepmerge(common, dark),
            prefer,
          })
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [updateThemeOptions, schemaKey]);

  return loading;
}

// const x = { items: ['a', 'b'] };
// const y = { items: ['c'] };

// const merged = deepmerge(x, y);
// console.log(merged); // { items: ['c'] }
