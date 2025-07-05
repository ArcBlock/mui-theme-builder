import { useReactive } from 'ahooks';
import { useEffect } from 'react';

export default function useDomSize(ref: React.RefObject<HTMLElement | null>) {
  const size = useReactive({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (ref.current) {
        size.width = ref.current.offsetWidth;
        size.height = ref.current.offsetHeight;
      }
    };

    updateSize();

    // 创建 ResizeObserver 监听容器宽度变化
    const resizeObserver = new ResizeObserver(updateSize);
    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    // 清理函数
    return () => {
      resizeObserver.disconnect();
    };
  }, [ref, size]);

  return size;
}
