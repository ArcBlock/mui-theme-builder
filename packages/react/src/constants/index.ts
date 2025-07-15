import { type ThemeOptions } from '@mui/material';

export const PREVIEW_TEXT = 'The five boxing wizards jump quickly together';

// PC 最小预览窗口宽度
export const PC_PREVIEW_WINDOW_MIN_WIDTH = 960;

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
