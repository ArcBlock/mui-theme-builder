import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import GoogleIcon from '@mui/icons-material/Google';
import { Box, CircularProgress, Paper, Typography, useTheme } from '@mui/material';
import { VirtualItem, useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useMemo, useRef } from 'react';
import { GoogleFont } from 'src/types/fonts';

interface VirtualFontListProps {
  fonts: GoogleFont[];
  loading: boolean;
  onFontSelect: (font: GoogleFont) => void;
  previewText?: string;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const ITEM_HEIGHT = 112; // 每个字体项的高度

export default function VirtualFontList({
  fonts,
  loading,
  onFontSelect,
  previewText = 'The quick brown fox jumps over the lazy dog',
  onLoadMore,
  hasMore = false,
}: VirtualFontListProps) {
  const { t } = useLocaleContext();
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: fonts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ITEM_HEIGHT,
    overscan: 5,
  });
  const theme = useTheme();
  const virtualItems = virtualizer.getVirtualItems();

  // 滚动触底自动加载
  useEffect(() => {
    const scrollElement = parentRef.current;
    if (!scrollElement || !onLoadMore || !hasMore) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      // 当滚动到距离底部 100px 时触发加载
      if (scrollHeight - scrollTop - clientHeight < 100) {
        onLoadMore();
      }
    };

    scrollElement.addEventListener('scroll', handleScroll);
    return () => scrollElement.removeEventListener('scroll', handleScroll);
  }, [onLoadMore, hasMore]);

  if (loading && fonts.length === 0) {
    return (
      <Box
        sx={{
          mt: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (fonts.length === 0) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mt: 1,
          textAlign: 'center',
        }}>
        {t('editor.noFontsFound')}
      </Typography>
    );
  }

  return (
    <Box
      ref={parentRef}
      sx={{
        height: '100%',
        overflow: 'auto',
        position: 'relative',
      }}>
      <Box
        sx={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}>
        {virtualItems.map((virtualItem: VirtualItem) => {
          const font = fonts[virtualItem.index];
          return (
            <Box
              key={virtualItem.key}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}>
              <Paper
                variant="outlined"
                onClick={() => onFontSelect(font)}
                sx={{
                  mb: 1,
                  py: 1.5,
                  px: 1.5,
                  cursor: 'pointer',
                  height: ITEM_HEIGHT - parseFloat(theme.spacing(1)), // 减去 margin
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.15s',
                  '&:hover': {
                    borderColor: 'grey.700',
                  },
                }}>
                <Typography
                  sx={{
                    mt: 0.5,
                    flexGrow: 1,
                    fontFamily: `"${font.f}"`,
                    fontSize: '1.1rem',
                    lineHeight: 1.2,
                  }}>
                  {previewText}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GoogleIcon sx={{ fontSize: '14px', color: 'text.secondary' }} />
                  <Typography
                    sx={{
                      fontSize: '14px',
                      color: 'text.secondary',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                    {font.f}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          );
        })}
      </Box>

      {/* 底部加载指示器 */}
      {loading && fonts.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            py: 2,
          }}>
          <CircularProgress size={24} />
        </Box>
      )}
    </Box>
  );
}
