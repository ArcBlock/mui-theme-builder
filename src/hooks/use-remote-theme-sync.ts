import axios from 'axios';
import { useEffect, useState } from 'react';
import { DEFAULT_CONCEPT_ID, DEFAULT_CONCEPT_NAME, useThemeStore } from 'src/state/themeStore';
import { getAuthHeaders, isDev } from 'src/utils';

import useSchemaKey from './use-schema-key';

export default function useRemoteThemeSync() {
  const [loading, setLoading] = useState(!isDev);
  const syncRemoteData = useThemeStore((s) => s.syncRemoteData);
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
        const {
          // 旧数据
          light = {},
          dark = {},
          common = {},
          prefer = 'light',
          // 新数据
          concepts,
          currentConceptId,
        } = res.data || {};

        let _concepts = concepts;

        // 兼容旧数据（单主题）
        if (!_concepts) {
          syncRemoteData({
            concepts: [
              {
                id: DEFAULT_CONCEPT_ID,
                name: DEFAULT_CONCEPT_NAME,
                themeConfig: {
                  light,
                  dark,
                  common,
                  prefer,
                },
              },
            ],
            currentConceptId: DEFAULT_CONCEPT_ID,
          });
          return;
        }

        syncRemoteData({
          concepts,
          currentConceptId,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [syncRemoteData, schemaKey]);

  return loading;
}
