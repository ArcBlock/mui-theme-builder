import { LocaleProvider } from '@arcblock/ux/lib/Locale/context';
import { ThemeProvider } from '@arcblock/ux/lib/Theme';
import { ToastProvider } from '@arcblock/ux/lib/Toast';
import { deepmergeAll } from '@arcblock/ux/lib/Util';
import type { Locale } from '@arcblock/ux/lib/type';
import { Box, BoxProps, type Theme, type ThemeOptions, createTheme, styled } from '@mui/material';
import { useAsyncEffect, useMemoizedFn } from 'ahooks';
import { useEffect, useMemo, useState } from 'react';
import { shallow } from 'zustand/shallow';

import Editor from './components/Editor';
import Header from './components/Header';
import PreviewSizeControls from './components/Header/PreviewSizeControls';
import PreviewWindow from './components/Preview/PreviewWindow';
import { BUILDER_THEME_OPTIONS } from './constants';
import { ThemeBuilderContext, useThemeBuilder } from './context/themeBuilder';
import useMobile from './hooks/useMobile';
import { translations } from './locales';
import createStore from './state/createStore';
import { ThemeData } from './types/theme';
import { getTheme, saveTheme } from './utils';

const Container = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.default,
  '& .hide-scrollbar': {
    /* Firefox */
    scrollbarWidth: 'none',
    /* IE */
    msOverflowStyle: 'none',
  },
  /* Webkit 浏览器 (Chrome, Safari, Edge) */
  '&::-webkit-scrollbar': {
    display: 'none',
  },
}));
const OpacityLoading = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 2000,
  opacity: 0.4,
  backgroundColor: theme.palette.background.default,
}));

function Preview(props: BoxProps) {
  return (
    <Box {...props}>
      {/* 预览区 */}
      <PreviewWindow />
      {/* 预览窗口导航 */}
      <Box sx={{ position: 'absolute', bottom: 0, right: 0, zIndex: 1 }}>
        <PreviewSizeControls />
      </Box>
    </Box>
  );
}

export interface BaseThemeBuilderProps extends Omit<BoxProps, 'onChange'> {
  loading?: boolean;
  showPreview?: boolean;
  showEditor?: boolean;
  showHeader?: boolean;
  locale?: Locale;
  themeOptions?: ThemeOptions;
  themeData?: ThemeData | null;
  children?: React.ReactNode;
  onSave?: (themeData: ThemeData) => Promise<void>;
  onChange?: (themeData: ThemeData) => void;
}
export function BaseThemeBuilder({
  loading = false,
  showPreview = false,
  showEditor = true,
  showHeader = true,
  locale = 'en',
  themeOptions = {},
  themeData = undefined,
  children = undefined,
  onSave = undefined,
  onChange = undefined,
  ...rest
}: BaseThemeBuilderProps) {
  const isMobile = useMobile();
  const store = useMemo(() => createStore(), []);
  const content = useMemo(
    () =>
      children || (
        <>
          {showHeader && <Header onSave={onSave} />}
          <Box
            sx={{
              display: 'flex',
              flexGrow: 1,
              minHeight: 0,
              overflow: 'hidden',
              backgroundColor: 'background.default',
              pb: isMobile ? '48px' : 0,
              position: 'relative',
            }}>
            {showEditor && !isMobile && (
              <Box
                className="hide-scrollbar"
                sx={{ maxWidth: showPreview ? '800px' : 'unset', flex: '1 0', overflowY: 'auto', overflowX: 'hidden' }}>
                {/* 编辑区 */}
                <Editor />
              </Box>
            )}
            {showPreview && (
              <Preview className="hide-scrollbar" sx={{ flex: '1 0', overflowY: 'auto', overflowX: 'hidden' }} />
            )}
          </Box>
          {/* 编辑区 */}
          {isMobile && <Editor />}
        </>
      ),
    [children, showEditor, showHeader, showPreview, isMobile, onSave],
  );
  // 继承父主题
  const createBuilderTheme = useMemoizedFn((parentTheme: Theme) => {
    return createTheme(deepmergeAll([parentTheme, BUILDER_THEME_OPTIONS, themeOptions]));
  });

  // 设置主题数据
  useEffect(() => {
    if (themeData) {
      store.getState().setConcepts(themeData);
    }
  }, [themeData, store]);

  // 监听 store 数据变化
  useEffect(() => {
    const unsubscribe = store.subscribe(
      (state) => [state.concepts, state.currentConceptId],
      () => {
        onChange?.(store.getState().getThemeData());
      },
      { equalityFn: shallow }, // shallow 支持数组比较
    );

    return () => {
      unsubscribe();
    };
  }, [store, onChange]);

  return (
    <ThemeProvider theme={createBuilderTheme}>
      <LocaleProvider locale={locale} translations={translations}>
        <ToastProvider>
          <ThemeBuilderContext.Provider value={store}>
            <Container {...rest}>
              {content}
              {loading && <OpacityLoading />}
            </Container>
          </ThemeBuilderContext.Provider>
        </ToastProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}

export type DefaultSave = typeof saveTheme;
export type DefaultFetch = typeof getTheme;
export interface ThemeBuilderProps extends Omit<BaseThemeBuilderProps, 'onSave' | 'onLoad'> {
  /** 为 false 时，不会自动从 service 拉取 ThemeData */
  fetchTheme?: false | ((defaultFetch: DefaultFetch) => Promise<ThemeData | null>);
  onLoad?: (themeData: ThemeData | null) => void;
  onSave?: (themeData: ThemeData, defaultSave: DefaultSave) => Promise<void>;
}
export function ThemeBuilder({ themeData: outerThemeData, fetchTheme, onLoad, onSave, ...rest }: ThemeBuilderProps) {
  const [themeData, setThemeData] = useState<ThemeData | null>(null);
  const [loading, setLoading] = useState(fetchTheme !== false);

  // 支持后端保存
  const handleSave = useMemoizedFn(async (themeData: ThemeData) => {
    if (onSave) {
      await onSave(themeData, saveTheme);
      return;
    }

    await saveTheme({ data: themeData });
  });

  // 后端获取 themeData
  useAsyncEffect(async () => {
    let result: ThemeData | null = null;

    // 无需拉取
    if (fetchTheme === false || themeData) {
      setLoading(false);
      onLoad?.(null);
      return;
    }

    setLoading(true);
    try {
      if (fetchTheme) {
        result = await fetchTheme(getTheme);
      } else {
        result = await getTheme();
      }
      setThemeData(result);
      onLoad?.(result);
    } finally {
      setLoading(false);
    }
  }, [fetchTheme, setThemeData]);

  return <BaseThemeBuilder themeData={outerThemeData || themeData} loading={loading} onSave={handleSave} {...rest} />;
}
ThemeBuilder.Toolbar = Header;
ThemeBuilder.Editor = Editor;
ThemeBuilder.Preview = Preview;

export { useThemeBuilder, saveTheme, getTheme };
export * from './constants';
export * from './state/createStore';
export * from './types/theme';
export * from './types/fonts';
