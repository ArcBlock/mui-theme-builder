import { type Concept, DEFAULT_CONCEPT_ID, DEFAULT_CONCEPT_NAME, type ThemeData } from '@blocklet/theme-builder-react';
import axios from 'axios';
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
          prefer = 'system',
          // 新数据
          concepts,
          currentConceptId,
        } = res.data || {};

        let _concepts = concepts as Concept[];
        let _currentConceptId = currentConceptId as string;

        // 兼容旧数据（单主题）
        if (!_concepts) {
          _concepts = [
            {
              id: DEFAULT_CONCEPT_ID,
              name: DEFAULT_CONCEPT_NAME,
              template: DEFAULT_CONCEPT_NAME,
              mode: !prefer || prefer === 'system' ? 'light' : prefer,
              prefer,
              themeConfig: {
                light,
                dark,
                common,
              },
              editor: {
                colors: {},
                typography: {},
                styles: {},
              },
            },
          ];
          _currentConceptId = DEFAULT_CONCEPT_ID;
        }
        setThemeData({
          concepts: _concepts,
          currentConceptId: _currentConceptId,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setThemeData, schemaKey]);

  return { loading, themeData };
}
