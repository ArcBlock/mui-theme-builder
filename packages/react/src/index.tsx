import { LocaleProvider } from '@arcblock/ux/lib/Locale/context';
import { ThemeProvider } from '@arcblock/ux/lib/Theme';
import { ToastProvider } from '@arcblock/ux/lib/Toast';
import { deepmergeAll } from '@arcblock/ux/lib/Util';
import type { Locale } from '@arcblock/ux/lib/type';
import { Box, BoxProps, type Theme, type ThemeOptions, createTheme, styled } from '@mui/material';
import { useMemoizedFn } from 'ahooks';
import { useEffect, useMemo } from 'react';
import Editor from 'src/components/Editor/Editor';
import Header from 'src/components/Header';
import PreviewSizeControls from 'src/components/Header/PreviewSizeControls';
import PreviewWindow from 'src/components/Preview/PreviewWindow';
import { ThemeBuilderContext, useThemeBuilder } from 'src/context/themeBuilder';
import useMobile from 'src/hooks/useMobile';
import { translations } from 'src/locales';

import { BUILDER_THEME_OPTIONS } from './constants';
import createStore from './state/createStore';
import { ThemeData } from './types/theme';

const Container = styled(Box)(({ theme }) => ({
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
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

export interface ThemeBuilderProps extends BoxProps {
  showPreview?: boolean;
  showEditor?: boolean;
  showHeader?: boolean;
  locale?: Locale;
  themeOptions?: ThemeOptions;
  themeData?: ThemeData;
  children?: React.ReactNode;
  onSave?: (themeData: ThemeData) => Promise<void>;
}

export function ThemeBuilder({
  showPreview = false,
  showEditor = true,
  showHeader = true,
  locale = 'en',
  themeOptions = {},
  themeData = undefined,
  children,
  onSave = undefined,
  ...rest
}: ThemeBuilderProps) {
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
                sx={{ maxWidth: '800px', flex: '1 0', overflowY: 'auto', overflowX: 'hidden' }}>
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
    [children, showEditor, showHeader, showPreview, isMobile],
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

  return (
    <ThemeProvider theme={createBuilderTheme}>
      <LocaleProvider locale={locale} translations={translations}>
        <ToastProvider>
          <ThemeBuilderContext.Provider value={store}>
            <Container {...rest}>{content}</Container>
          </ThemeBuilderContext.Provider>
        </ToastProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
ThemeBuilder.Toolbar = Header;
ThemeBuilder.Editor = Editor;
ThemeBuilder.Preview = Preview;

export { useThemeBuilder };
export * from './constants';
export * from './state/createStore';
export * from './types/theme';
export * from './types/fonts';
