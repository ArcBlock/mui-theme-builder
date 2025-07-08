import { useEffect, useState } from 'react';

/**
 * 获取 HTML 根元素的字体大小
 * @returns htmlFontSize 值（像素）
 */
export default function useHtmlFontSize(): number {
  const [htmlFontSize, setHtmlFontSize] = useState(16); // 默认值

  useEffect(() => {
    // 直接从根元素获取计算后的字体大小
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

    if (!isNaN(rootFontSize)) {
      setHtmlFontSize(rootFontSize);
    }
  }, []);

  return htmlFontSize;
}
