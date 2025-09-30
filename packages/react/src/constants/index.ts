import { BLOCKLET_THEME_DARK, BLOCKLET_THEME_LIGHT, DEFAULT_FONTS } from '@blocklet/theme';
import { type ThemeOptions } from '@mui/material';
import { Theme, createTheme } from '@mui/material';

export const DEFAULT_CONCEPT_ID = 'EdNkoyjQDQFY7f1gzwdat';
export const DEFAULT_CONCEPT_NAME = 'Default';
export const MODE_SPECIFIC_FIELDS = ['palette', 'components', 'shadows']; // 需要区分 light/dark 的主题配置
export const HEADING_VARIANTS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'overline'] as const;
export const BODY_VARIANTS = ['body1', 'body2'] as const;
export const DEFAULT_THEME_META = { locked: false };

// 默认的 font-family 字符串
export const DEFAULT_FONT_STRING = DEFAULT_FONTS.map((s) => {
  // 检查是否包含空格或特殊字符（除了连字符和数字）
  const needsQuotes = /[^\w-]/.test(s);
  return needsQuotes ? `"${s}"` : s;
}).join(',');

export const PREVIEW_TEXT = 'The five boxing wizards jump quickly together';

// PC 最小预览窗口宽度
export const PC_PREVIEW_WINDOW_MIN_WIDTH = 960;

// 默认浅色主题
export const defaultLightTheme: Theme = createTheme(BLOCKLET_THEME_LIGHT);

// 默认深色主题
export const defaultDarkTheme = createTheme(BLOCKLET_THEME_DARK);

// Editor 样式
export const BUILDER_THEME_OPTIONS: ThemeOptions = {
  shape: {
    borderRadius: 8, // 固定圆角大小
  },
  spacing: 8, // 固定间距，以免无法编辑
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        docked: {
          '& .MuiPaper-root': {
            position: 'static',
          },
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: theme.palette.background.default,
        }),
      },
    },
  },
};
