import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
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
          type: 'UPDATE_THEME',
          themeOptions: res.data,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch, schemaKey]);

  return loading;
}
