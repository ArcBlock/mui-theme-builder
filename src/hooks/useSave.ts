import axios from 'axios';
import { useCallback } from 'react';
import { Concept } from 'src/types/theme';
import { getAuthHeaders, isDev } from 'src/utils';

import useSchemaKey from './useSchemaKey';

export default function useSave() {
  const schemaKey = useSchemaKey();

  const saveTheme = useCallback(
    async ({ concepts, currentConceptId }: { concepts: Concept[]; currentConceptId: string }) => {
      const themeData = {
        concepts,
        currentConceptId,
      };
      console.log('themeData', themeData);
      // 后端保存
      if (!isDev) {
        await axios.post(
          schemaKey,
          {
            theme: themeData,
          },
          {
            headers: getAuthHeaders(),
          },
        );
      } else {
        // eslint-disable-next-line no-console
        console.log('themeData', themeData); // 本地测试用
      }
    },
    [schemaKey],
  );

  return { saveTheme };
}
