import { useMemoizedFn } from 'ahooks';
import { useEffect, useRef, useState } from 'react';
import { useThemeStore } from 'src/state/themeStore';

const MIN_HEIGHT = 768;

export interface PreviewBlockletProps {
  appUrl: string;
}

export function PreviewBlocklet({ appUrl }: PreviewBlockletProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const themeObject = useThemeStore((state) => state.themeObject);
  const concept = useThemeStore((state) => state.getCurrentConcept());
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const onIframeLoad = useMemoizedFn(() => setIframeLoaded(true));

  // 动态调整 iframe 高度
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleResize = () => {
      try {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDocument) return;
        const height = iframeDocument.body.scrollHeight;
        iframe.style.height = Math.max(MIN_HEIGHT, height) + 'px';
      } catch (err) {
        console.warn('Cannot access iframe content (possibly cross-origin):', err);
      }
    };

    const onLoad = () => {
      handleResize();

      // 优先使用 ResizeObserver（现代浏览器支持）
      try {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
        const observer = new ResizeObserver(handleResize);
        if (iframeDocument?.body) {
          observer.observe(iframeDocument.body);
        }

        return () => observer.disconnect();
      } catch (e) {
        // 退回到 setInterval 方式
        const interval = setInterval(handleResize, 500);
        return () => clearInterval(interval);
      }
    };

    iframe.addEventListener('load', onLoad);
    return () => {
      iframe.removeEventListener('load', onLoad);
    };
  }, []);

  // 实时发送主题配置
  useEffect(() => {
    if (iframeLoaded) {
      iframeRef.current?.contentWindow?.postMessage({
        type: 'THEME_BUILDER_CONFIG_CHANGED',
        payload: {
          mode: concept.mode,
          ...concept.themeConfig,
        },
      });
    }
  }, [themeObject, iframeLoaded]);

  return (
    <iframe
      ref={iframeRef}
      src={appUrl}
      style={{
        border: 0,
        width: '100%',
        height: '100%',
        display: 'block',
      }}
      onLoad={onIframeLoad}
    />
  );
}
