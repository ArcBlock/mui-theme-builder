import { useRequest } from 'ahooks';
import axios from 'axios';
import isUrl from 'is-url';
import { joinURL } from 'ufo';

export default function useBlockletInfo(endpoint: string) {
  return useRequest(
    async () => {
      if (!isUrl(endpoint)) {
        return undefined;
      }

      const { origin } = new URL(endpoint);
      const res = await axios.get(joinURL(origin, '/__blocklet__.js?type=json'), { timeout: 5000 });

      // 所处不是 blocklet 环境
      if (!res.headers['content-type'] || !res.headers['content-type'].includes('application/json')) {
        return undefined;
      }

      return res.data;
    },
    {
      refreshDeps: [endpoint],
      onError(error: Error) {
        console.error(error);
      },
    },
  );
}
