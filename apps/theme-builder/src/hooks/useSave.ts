import { type ThemeData } from '@blocklet/theme-builder-react';
import { useMemoizedFn } from 'ahooks';
import axios from 'axios';
import { getAuthHeaders, isDev } from 'src/utils';

import useSchemaKey from './useSchemaKey';

export default function useSave() {
  const schemaKey = useSchemaKey();

  const saveTheme = useMemoizedFn(async (themeData: ThemeData) => {
    // 本地测试用
    if (isDev) {
      // eslint-disable-next-line no-console
      console.log('themeData', themeData);
      // @ts-ignore
      window.themeData = themeData;
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((resolve) => setTimeout(resolve, 500));

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
    }
  });

  return { saveTheme };
}
