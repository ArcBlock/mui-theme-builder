import { Box, useTheme } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { PC_PREVIEW_WINDOW_MIN_WIDTH } from 'src/constants';
import { useThemeStore } from 'src/state/themeStore';

import { getSampleComponent } from '../Samples';
import PreviewWrapper from './PreviewWrapper';

function PreviewWindow() {
  const theme = useTheme();
  const selectedComponentId = useThemeStore((s) => s.selectedComponentId);
  const previewSize = useThemeStore((s) => s.previewSize);
  const previewComponent = getSampleComponent(selectedComponentId);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  // 监听容器宽度变化
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth - parseInt(theme.spacing(2), 10));
      }
    };

    // 初始设置宽度
    updateWidth();

    // 创建 ResizeObserver 监听宽度变化
    const resizeObserver = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // 清理函数
    return () => {
      resizeObserver.disconnect();
    };
  }, [theme]);

  // 判断是否需要缩放
  const shouldScale = containerWidth > 0 && containerWidth < PC_PREVIEW_WINDOW_MIN_WIDTH && previewSize === false;
  const scale = shouldScale ? containerWidth / PC_PREVIEW_WINDOW_MIN_WIDTH : 1;

  return (
    <Box
      ref={containerRef}
      className="preview-window"
      sx={{
        padding: 2,
        position: 'relative',
      }}>
      <PreviewWrapper
        sx={{
          width: shouldScale ? PC_PREVIEW_WINDOW_MIN_WIDTH : '100%',
          transform: shouldScale ? `scale(${scale})` : 'none',
          transformOrigin: 'top left',
        }}>
        {previewComponent || null}
      </PreviewWrapper>
    </Box>
  );
}

export default PreviewWindow;
