import { Locale } from '@arcblock/ux/lib/type';
import { useEffect, useState } from 'react';

export default function useParentLocale() {
  const [locale, setLocale] = useState<Locale>('en');

  // 接受父页面的 locale
  useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      if (event.data?.type === 'SEND_LOCALE') {
        setLocale(event.data.payload);
      }
    };

    window.addEventListener('message', messageHandler);

    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, []);

  return { locale };
}
