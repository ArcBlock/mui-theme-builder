import { useMemoizedFn } from 'ahooks';
import { useEffect, useRef, useState } from 'react';
import { useThemeBuilder } from 'src/context/themeBuilder';

const MIN_HEIGHT = 768;

export interface PreviewBlockletProps {
  appUrl: string;
}

export function PreviewBlocklet({ appUrl }: PreviewBlockletProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const concept = useThemeBuilder((s) => s.getCurrentConcept());
  const iframeLoaded = useRef(false);

  // 发送主题配置
  const sendConcept = useMemoizedFn(() => {
    if (iframeLoaded.current) {
      iframeRef.current?.contentWindow?.postMessage({
        type: 'THEME_BUILDER_CONFIG_CHANGED',
        payload: {
          mode: concept.mode,
          ...concept.themeConfig,
        },
      });
    }
  });

  // 预览页面加载完毕
  const onIframeLoad = useMemoizedFn(() => {
    iframeLoaded.current = true;
    sendConcept();
  });

  // 动态调整 iframe 高度
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleResize = () => {
      try {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDocument) return;
        const height = iframeDocument.body.scrollHeight;
        iframe.style.height = `${Math.max(MIN_HEIGHT, height)}px`;
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
    // eslint-disable-next-line consistent-return
    return () => {
      iframe.removeEventListener('load', onLoad);
    };
  }, []);

  // 主题发生改变
  useEffect(() => {
    sendConcept();
  }, [concept]);

  return (
    <iframe
      title="blocklet preview"
      ref={iframeRef}
      src={appUrl}
      style={{
        border: 0,
        width: '100%',
        height: `${MIN_HEIGHT}px`,
        display: 'block',
      }}
      onLoad={onIframeLoad}
    />
  );
}
