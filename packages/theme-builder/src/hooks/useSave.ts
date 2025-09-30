import type { DefaultSave, ThemeSetting } from '@blocklet/theme-builder-react';
import { useMemoizedFn } from 'ahooks';

import { getAuthHeaders, isDev } from '../utils';
import useSchemaKey from './useSchemaKey';

export default function useSave() {
  const schemaKey = useSchemaKey();

  const saveTheme = useMemoizedFn(async (setting: Partial<ThemeSetting>, defaultSave: DefaultSave) => {
    // 本地测试用
    if (isDev) {
      // eslint-disable-next-line no-console
      console.log('ThemeSetting', setting);
      // @ts-ignore
      window.themeSetting = setting;
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((resolve) => setTimeout(resolve, 500));

      return;
    }

    // 后端保存
    await defaultSave({ data: setting, url: schemaKey, headers: getAuthHeaders() });
  });

  return { saveTheme };
}
