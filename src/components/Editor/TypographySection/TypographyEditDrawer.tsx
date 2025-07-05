import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import { Close, Search } from '@mui/icons-material';
import {
  Box,
  Drawer,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { PREVIEW_TEXT } from 'src/constants';
import useGoogleFonts from 'src/hooks/useGoogleFonts';
import { DEFAULT_FONT_STRING, useThemeStore } from 'src/state/themeStore';
import { GoogleFont } from 'src/types/fonts';
import { TextVariant } from 'src/types/theme';

import { ButtonShuffle } from '../Common/ButtonShuffle';
import VirtualFontList from './VirtualFontList';

// 字体分类配置
const FONT_CATEGORIES = [
  {
    value: 'Sans Serif',
    labelKey: 'editor.typographySection.sansSerif',
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
  {
    value: 'Serif',
    labelKey: 'editor.typographySection.serif',
    fontFamily: 'Times New Roman, Times, serif',
  },
  {
    value: 'Display',
    labelKey: 'editor.typographySection.display',
    fontFamily: 'Impact, Chalkduster, fantasy, cursive',
  },
  {
    value: 'Monospace',
    labelKey: 'editor.typographySection.monospace',
    fontFamily: 'Fira Mono, Consolas, monospace',
  },
];

interface TypographyEditDrawerProps {
  open: boolean;
  variant: TextVariant;
  onClose: () => void;
}

function TypographyEditDrawer({ open, variant, onClose }: TypographyEditDrawerProps) {
  const { t } = useLocaleContext();
  const setFontOptions = useThemeStore((s) => s.setFontOptions);
  const themeObject = useThemeStore((s) => s.themeObject);
  const isMobile = useMediaQuery(themeObject.breakpoints.down('md'));

  // 状态管理
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const filter = useMemo(() => ({ category: selectedCategory, searchQuery }), [selectedCategory, searchQuery]);

  // 字体数据
  const { fonts, loading, totalCount, hasMore, loadMore, categories, shuffleFonts } = useGoogleFonts(filter);

  // 获取可用的分类选项（不含 All）
  const availableCategories = useMemo(() => {
    return FONT_CATEGORIES.filter((cat) => categories.includes(cat.value));
  }, [categories]);

  // 当前使用的字体
  const activeFont = useMemo(() => {
    let fontFamily = themeObject.typography.fontFamily ?? DEFAULT_FONT_STRING;

    if (variant === 'heading') {
      fontFamily = themeObject.typography.h1.fontFamily ?? DEFAULT_FONT_STRING;
    }

    return fontFamily.split(',')[0].replace(/"/g, '');
  }, [variant, themeObject]);

  // 处理搜索
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  // 处理分类选择
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // 修改字体
  const handleFontSelect = (font: GoogleFont) => {
    setFontOptions({ [variant]: { fontFamily: font.f } });
    // clear filter
    setSearchQuery('');
    setSelectedCategory('All');
    onClose();
  };

  // 随机字体
  const handleShuffleFonts = () => {
    const result = shuffleFonts(variant);

    setFontOptions({ [variant]: { fontFamily: result[variant]!.f } });
  };

  const drawerContent = (
    <Stack sx={{ p: 1.5, width: isMobile ? 'auto' : 320, height: '100%' }}>
      {/* 标题栏 */}
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1
        }}>
        <Typography sx={{ fontSize: 18, fontWeight: 500, textTransform: 'capitalize' }}>
          {variant === 'heading' ? t('editor.typographySection.heading') : t('editor.typographySection.body')}
        </Typography>
        <IconButton onClick={onClose}>
          <Close sx={{ fontSize: 20 }} />
        </IconButton>
      </Stack>

      {/* 字体搜索 */}
      <TextField
        placeholder={t('editor.typographySection.searchFonts')}
        value={searchQuery}
        size="small"
        sx={{ mb: 1, '& .MuiInputBase-input': { fontSize: 14 } }}
        onChange={(e) => handleSearchChange(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ fontSize: 20 }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery ? (
              <IconButton size="small" onClick={() => handleSearchChange('')}>
                <Close sx={{ fontSize: 16 }} />
              </IconButton>
            ) : null,
          }
        }}
      />

      {/* 字体分类卡片选择 */}
      <Grid container spacing={1} sx={{ mb: 1 }}>
        {availableCategories.map((cat) => {
          const selected = selectedCategory === cat.value;
          return (
            <Grid
              key={cat.value}
              onClick={() => (selected ? handleCategoryChange('All') : handleCategoryChange(cat.value))}
              size={3}>
              <Box
                sx={{
                  cursor: 'pointer',
                  p: '6px',
                  border: '1px solid',
                  borderColor: selected ? 'primary.main' : 'divider',
                  borderRadius: 1,
                  transition: 'all 0.15s',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}>
                <Stack
                  sx={{
                    alignItems: "center",
                    color: selected ? 'primary.main' : 'text.primary'
                  }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: 16,
                      lineHeight: '20px',
                      fontFamily: cat.fontFamily,
                    }}>
                    Aa
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: 12,
                    }}>
                    {t(cat.labelKey)}
                  </Typography>
                </Stack>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      {/* 字体总数显示 */}
      <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
        {t('editor.typographySection.results', { count: totalCount })}
      </Typography>

      {/* 虚拟滚动字体列表 */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <VirtualFontList
          fonts={fonts}
          loading={loading}
          onFontSelect={handleFontSelect}
          previewText={PREVIEW_TEXT}
          onLoadMore={loadMore}
          hasMore={hasMore}
        />
      </Box>

      {/* 随机字体 */}
      <ButtonShuffle sx={{ mt: 1 }} onClick={handleShuffleFonts} />
      {/* 当前使用的字体 */}
      <Box>
        <Typography
          variant="body2"
          align="center"
          sx={{
            color: "text.secondary",
            mt: 1
          }}>
          {t('editor.typographySection.activeFont')}
          <Link href={`https://fonts.google.com/specimen/${activeFont}`} target="_blank" sx={{ ml: 1 }}>
            {activeFont}
          </Link>
        </Typography>
      </Box>
    </Stack>
  );

  return (
    <Drawer
      anchor={isMobile ? 'bottom' : 'left'}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: { sx: { height: { xs: '80vh', md: '100%' } } }
      }}>
      {drawerContent}
    </Drawer>
  );
}

export default TypographyEditDrawer;
