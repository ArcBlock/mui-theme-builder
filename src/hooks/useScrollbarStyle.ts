import { useTheme } from '@arcblock/ux/lib/Theme';
import { useMemo } from 'react';

/**
 * 在 light mode 下给滚动条应用浅色样式。dark mode 下返回空。
 */
export default function useScrollbarStyle() {
  const theme = useTheme();

  return useMemo(() => {
    if (theme.palette.mode === 'dark') {
      return null;
    }

    const trackColor = '#fafafa';
    const thumbColor = '#c1c1c1';

    return {
      '@supports selector(::-webkit-scrollbar)': {
        '*::-webkit-scrollbar': {
          width: '12px',
          height: '12px',
        },
        '*::-webkit-scrollbar-track': {
          background: trackColor,
        },
        '*::-webkit-scrollbar-thumb': {
          background: thumbColor,
          borderRadius: '6px',
          border: '2px solid',
          borderColor: trackColor,
          backgroundClip: 'padding-box',
          '&:hover': {
            background: '#7d7d7d',
            backgroundClip: 'padding-box',
          },
        },
      },
      '@supports not selector(::-webkit-scrollbar)': {
        '*': {
          scrollbarWidth: 'auto',
          scrollbarColor: `${thumbColor} ${trackColor}`,
        },
      },
    };
  }, [theme]);
}
