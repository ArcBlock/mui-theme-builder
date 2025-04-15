import { ThemeOptions } from '@mui/material';
import { useEffect, useState } from 'react';

export default function useParentTheme() {
  const [theme, setTheme] = useState<ThemeOptions>({});
  const [loading, setLoading] = useState(true);

  // 从父页面拉取 theme
  useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      if (event.data?.type === 'SEND_THEME') {
        setTheme(event.data.payload);
        setLoading(false);
      }
    };

    // 不在 iframe 中或不同域
    if (window.parent === window || window.location.origin !== window.parent.location.origin) {
      setLoading(false);
    } else {
      window.parent?.postMessage({ type: 'REQUEST_THEME' }, window.location.origin);
    }

    window.addEventListener('message', messageHandler);

    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, []);

  return { data: theme, loading };
}
