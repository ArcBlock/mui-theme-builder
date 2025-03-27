import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/state/types';
import { getAuthHeaders, isDev } from 'src/utils';

import useSchemaKey from './use-schema-key';

export default function useRemoteThemeSync() {
  const [loading, setLoading] = useState(!isDev);
  const dispatch = useDispatch();
  const schemaKey = useSchemaKey();
  const mode = useSelector((state: RootState) => state.mode);

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
          themeOptions: res.data,
          mode,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch, schemaKey, mode]);

  return loading;
}
