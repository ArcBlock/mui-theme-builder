import axios from 'axios';
import { useCallback } from 'react';
import { useThemeStore } from 'src/state/themeStore';
import { Concept } from 'src/types/theme';
import { getAuthHeaders, isDev } from 'src/utils';

import useSchemaKey from './useSchemaKey';

export default function useSave() {
  const schemaKey = useSchemaKey();
  const setSaving = useThemeStore((s) => s.setSaving);

  const saveTheme = useCallback(
    async ({ concepts, currentConceptId }: { concepts: Concept[]; currentConceptId: string }) => {
      const themeData = {
        concepts,
        currentConceptId,
      };

      setSaving(true);

      // 本地测试用
      if (isDev) {
        // eslint-disable-next-line no-console
        console.log('themeData', themeData);
        // @ts-ignore
        window.themeData = themeData;
        // eslint-disable-next-line no-promise-executor-return
        await new Promise((resolve) => setTimeout(resolve, 500));
        // eslint-disable-next-line no-console
        setSaving(false);

        return;
      }

      // 后端保存
      try {
        await axios.post(
          schemaKey,
          {
            theme: themeData,
          },
          {
            headers: getAuthHeaders(),
          },
        );
        // eslint-disable-next-line no-useless-catch
      } catch (error) {
        throw error;
      } finally {
        setSaving(false);
      }
    },
    [schemaKey, setSaving],
  );

  return { saveTheme };
}
