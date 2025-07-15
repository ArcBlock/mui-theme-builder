import axios from 'axios';
import { useEffect, useState } from 'react';
import { useThemeBuilder } from 'src/context/themeBuilder';
import { DEFAULT_CONCEPT_ID, DEFAULT_CONCEPT_NAME } from 'src/state/createStore';
import { Concept } from 'src/types/theme';
import { getAuthHeaders, isDev } from 'src/utils';

import useSchemaKey from './useSchemaKey';

export default function useRemoteThemeSync() {
  const [loading, setLoading] = useState(!isDev);
  const setConcepts = useThemeBuilder((s) => s.setConcepts);
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
        setConcepts({
          concepts: _concepts,
          currentConceptId: _currentConceptId,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setConcepts, schemaKey]);

  return loading;
}
