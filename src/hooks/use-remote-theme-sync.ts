import { deepmerge } from '@arcblock/ux/lib/Theme';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { defaultThemeOptions } from 'src/siteTheme';
import { getAuthHeaders, isDev } from 'src/utils';

import useSchemaKey from './use-schema-key';

export default function useRemoteThemeSync() {
  const [loading, setLoading] = useState(!isDev);
  const dispatch = useDispatch();
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
        dispatch({
          type: 'SET_THEME_OPTIONS',
          themeOptions: deepmerge(defaultThemeOptions, res.data),
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch, schemaKey]);

  return loading;
}

// const x = { items: ['a', 'b'] };
// const y = { items: ['c'] };

// const merged = deepmerge(x, y);
// console.log(merged); // { items: ['c'] }
