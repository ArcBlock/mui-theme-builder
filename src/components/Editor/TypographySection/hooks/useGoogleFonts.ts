import { useEffect, useMemo, useState } from 'react';
import { FontFilter, GoogleFont, GoogleFontsData } from 'src/types/fonts';

const FONTS_PER_PAGE = 40; // 每页显示的字体数量

// 异步加载字体数据
let fontsDataCache: GoogleFontsData | null = null;
let fontsDataPromise: Promise<GoogleFontsData> | null = null;

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
      fontsByCategory[category].sort((a, b) => b.p - a.p);
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

  // 当过滤条件改变时重置分页
  useEffect(() => {
    resetPagination();
  }, [filter.category, filter.searchQuery]);

  // 模拟异步加载
  useEffect(() => {
    if (!fontsData) return;

    setLoading(true);
    const timer = setTimeout(() => {
      // 累加模式：每次都显示前 N 页所有数据
      const newFonts = filteredFonts.slice(0, (currentPage + 1) * FONTS_PER_PAGE);
      setFonts(newFonts);
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [filteredFonts, currentPage, fontsData]);

  console.log('currentPage', currentPage), 'haseMore', (currentPage + 1) * FONTS_PER_PAGE < filteredFonts.length;

  return {
    fonts,
    loading: loading || dataLoading,
    totalCount: filteredFonts.length,
    hasMore: (currentPage + 1) * FONTS_PER_PAGE < filteredFonts.length,
    loadMore,
    resetPagination,
    categories,
  };
};

export default useGoogleFonts;
