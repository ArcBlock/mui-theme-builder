import { useAsyncEffect } from 'ahooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PREVIEW_TEXT } from 'src/constants';
import { FontFilter, GoogleFont, GoogleFontsData } from 'src/types/fonts';
import { TextVariant } from 'src/types/theme';
import { loadFontsIfRequired, pickRandom } from 'src/utils';
import { topN } from 'src/utils';

const FONTS_PER_PAGE = 10; // 每页显示的字体数量

// 异步加载字体数据
let fontsDataCache: GoogleFontsData | null = null;
let fontsDataPromise: Promise<GoogleFontsData> | null = null;
let loadedFonts = new Set<string>();

const loadFontsData = async (): Promise<GoogleFontsData> => {
  if (fontsDataCache) {
    return fontsDataCache;
  }

  if (fontsDataPromise) {
    return fontsDataPromise;
  }

  fontsDataPromise = import('src/data/google-fonts.json').then((data) => {
    fontsDataCache = data.default as GoogleFontsData;
    return fontsDataCache;
  });

  return fontsDataPromise;
};

const useGoogleFonts = (filter: FontFilter) => {
  const [fontsData, setFontsData] = useState<GoogleFontsData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [fonts, setFonts] = useState<GoogleFont[]>([]);
  const lastRandomPick = useRef<{ heading: GoogleFont | null; body: GoogleFont | null }>({ heading: null, body: null });

  // 异步加载字体数据
  useEffect(() => {
    const loadData = async () => {
      try {
        setDataLoading(true);
        const data = await loadFontsData();
        setFontsData(data);
      } catch (error) {
        console.error('Failed to load fonts data:', error);
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, []);

  // 前端组装分类数据
  const { categories, fontsByCategory } = useMemo(() => {
    if (!fontsData) {
      return { categories: [], fontsByCategory: {} };
    }

    const categories = Array.from(new Set(fontsData.all.map((font) => font.c))).sort();
    const fontsByCategory = fontsData.all.reduce(
      (acc, font) => {
        const category = font.c || 'Other';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(font);
        return acc;
      },
      {} as Record<string, GoogleFont[]>,
    );

    // 在每个分类内按 popularity 排序
    Object.keys(fontsByCategory).forEach((category) => {
      fontsByCategory[category].sort((a, b) => a.p - b.p);
    });

    return { categories, fontsByCategory };
  }, [fontsData]);

  // 过滤字体
  const filteredFonts = useMemo(() => {
    if (!fontsData) return [];

    let result: GoogleFont[] = [];

    if (filter.category && filter.category !== 'All') {
      // 按分类过滤
      result = fontsByCategory[filter.category] || [];
    } else {
      // 使用所有字体
      result = fontsData.all;
    }

    // 按搜索关键词过滤
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      result = result.filter((font) => font.f.toLowerCase().includes(query));
    }

    return result;
  }, [fontsData, fontsByCategory, filter.category, filter.searchQuery]);

  // 加载更多字体
  const loadMore = () => {
    if (loading) return; // 防止 loading 时重复触发
    if (currentPage * FONTS_PER_PAGE < filteredFonts.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // 重置分页
  const resetPagination = () => {
    setCurrentPage(0);
  };

  // 随机挑选字体
  const headingPool = useMemo(() => {
    if (filter.category && filter.category !== 'All') {
      return topN(fontsByCategory[filter.category] || []);
    }
    return [
      ...topN(fontsByCategory['Display']),
      ...topN(fontsByCategory['Serif']),
      ...topN(fontsByCategory['Sans Serif']),
    ];
  }, [fontsByCategory, filter.category]);

  const bodyPool = useMemo(() => {
    if (filter.category && filter.category !== 'All') {
      return topN(fontsByCategory[filter.category] || []);
    }
    return [
      ...topN(fontsByCategory['Monospace']),
      ...topN(fontsByCategory['Serif']),
      ...topN(fontsByCategory['Sans Serif']),
    ];
  }, [fontsByCategory, filter.category]);

  const shuffleFonts = useCallback(
    (textVariant?: TextVariant) => {
      let heading: GoogleFont | null = null;
      let body: GoogleFont | null = null;

      if (!textVariant) {
        heading = pickRandom(headingPool, lastRandomPick.current.heading);
        body = pickRandom(bodyPool, lastRandomPick.current.body);
      }
      if (textVariant === 'heading') {
        heading = pickRandom(headingPool, lastRandomPick.current.heading);
      }
      if (textVariant === 'body') {
        body = pickRandom(bodyPool, lastRandomPick.current.body);
      }

      lastRandomPick.current = {
        heading,
        body,
      };

      return {
        heading,
        body,
      };
    },
    [headingPool, bodyPool],
  );

  // 当过滤条件改变时重置分页
  useEffect(() => {
    resetPagination();
  }, [filter.category, filter.searchQuery]);

  // 模拟异步加载
  useAsyncEffect(async () => {
    if (!fontsData) return;

    setLoading(true);
    // 累加模式：每次都显示前 N 页所有数据
    const newFonts = filteredFonts.slice(0, (currentPage + 1) * FONTS_PER_PAGE);
    setFonts(newFonts);
    // 预加载字体
    loadedFonts = await loadFontsIfRequired(
      newFonts.map((f) => f.f),
      loadedFonts,
      { text: PREVIEW_TEXT },
    );
    setLoading(false);
  }, [filteredFonts, currentPage, fontsData]);

  return {
    fonts,
    loading: loading || dataLoading,
    totalCount: filteredFonts.length,
    hasMore: (currentPage + 1) * FONTS_PER_PAGE < filteredFonts.length,
    loadMore,
    resetPagination,
    categories,
    allFonts: fontsData?.all || [],
    shuffleFonts,
  };
};

export default useGoogleFonts;
