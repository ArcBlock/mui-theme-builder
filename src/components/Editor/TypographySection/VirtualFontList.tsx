import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual';
import { useRef, useMemo, useEffect } from 'react';
import GoogleIcon from '@mui/icons-material/Google';
import { GoogleFont } from 'src/types/fonts';

interface VirtualFontListProps {
  fonts: GoogleFont[];
  loading: boolean;
  onFontSelect: (font: GoogleFont) => void;
  height: string | number;
  previewText?: string;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const ITEM_HEIGHT = 80; // 每个字体项的高度

export default function VirtualFontList({
  fonts,
  loading,
  onFontSelect,
  height,
  previewText = 'The quick brown fox jumps over the lazy dog',
  onLoadMore,
  hasMore = false,
}: VirtualFontListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: fonts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ITEM_HEIGHT,
    overscan: 5,
  });

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
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (fonts.length === 0) {
    return (
      <Box
        sx={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography color="text.secondary">没有找到匹配的字体</Typography>
      </Box>
    );
  }

  return (
    <Box
      ref={parentRef}
      sx={{
        height,
        overflow: 'auto',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
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
              }}
            >
              <Paper
                variant="outlined"
                onClick={() => onFontSelect(font)}
                sx={{
                  m: 1,
                  p: 1.5,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: ITEM_HEIGHT - 16, // 减去 margin
                  '&:hover': {
                    borderColor: 'grey.700',
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontFamily: `"${font.f}"`,
                      fontSize: '1.1rem',
                      lineHeight: 1.2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {previewText}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mt: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <GoogleIcon sx={{ fontSize: '14px', color: 'text.secondary' }} />
                      <Typography
                        sx={{
                          fontSize: '14px',
                          color: 'text.secondary',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {font.f}
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '12px',
                        backgroundColor: 'action.selected',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      {font.c}
                    </Typography>
                  </Box>
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
          }}
        >
          <CircularProgress size={24} />
        </Box>
      )}
    </Box>
  );
} 