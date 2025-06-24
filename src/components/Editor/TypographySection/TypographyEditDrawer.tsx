import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import { DEFAULT_FONTS } from '@blocklet/theme';
import { Close, Search, ExpandMore } from '@mui/icons-material';
import {
  Box,
  Drawer,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from '@mui/material';
import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { useThemeStore } from 'src/state/themeStore';
import { TextVariant } from 'src/types/theme';
import { FontFilter } from 'src/types/fonts';

import { ButtonShuffle } from '../Common/ButtonShuffle';
import useGoogleFonts from './hooks/useGoogleFonts';
import VirtualFontList from './VirtualFontList';

const headingVariants = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'overline'] as const;

// 优化字体字符串处理函数
const formatFontFamily = (fontName: string): string => {
  // 检查是否包含空格或特殊字符（除了连字符和数字）
  const needsQuotes = /[^\w-]/.test(fontName);
  return needsQuotes ? `"${fontName}"` : fontName;
};

const DEFAULT_FONT_STRING = DEFAULT_FONTS.map(formatFontFamily).join(', ');

interface TypographyEditDrawerProps {
  open: boolean;
  variant: TextVariant | null;
  onClose: () => void;
}

function TypographyEditDrawer({ open, variant, onClose }: TypographyEditDrawerProps) {
  const { t } = useLocaleContext();
  const themeObject = useThemeStore((s) => s.themeObject);
  const isMobile = useMediaQuery(themeObject.breakpoints.down('md'));
  
  // 状态管理
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filter, setFilter] = useState<FontFilter>({ category: 'All', searchQuery: '' });
  
  // 字体数据
  const { fonts, loading, totalCount, hasMore, loadMore, categories } = useGoogleFonts(filter);
  const addFonts = useThemeStore((s) => s.addFonts);
  const setThemeOptions = useThemeStore((s) => s.setThemeOptions);

  // 获取分类列表
  const categoryOptions = useMemo(() => {
    return ['All', ...categories];
  }, [categories]);

  // 当前使用的字体
  const activeFont = useMemo(() => {
    let fontFamily = themeObject.typography.fontFamily ?? DEFAULT_FONT_STRING;

    if (variant === 'Heading') {
      fontFamily = themeObject.typography.h1.fontFamily ?? DEFAULT_FONT_STRING;
    }

    return fontFamily.split(',')[0].replace(/"/g, '');
  }, [variant, themeObject]);

  // 更新过滤条件
  const updateFilter = useCallback((newFilter: Partial<FontFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  }, []);

  // 处理搜索
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateFilter({ searchQuery: value });
  };

  // 处理分类选择
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    updateFilter({ category: category === 'All' ? undefined : category });
  };

  // 修改字体
  const handleFontSelect = (font: any) => {
    if (variant) {
      addFonts([font.f]);

      if (variant === 'Heading') {
        const configs = headingVariants.map((v) => ({
          path: `typography.${v}.fontFamily`,
          value: `"${font.f}", ${DEFAULT_FONT_STRING}`,
        }));
        setThemeOptions(configs);
      } else {
        const bodyFontFamily = `"${font.f}", ${DEFAULT_FONT_STRING}`;
        // body 字体本质上是 base 字体
        const updates = [
          {
            path: 'typography.fontFamily',
            value: bodyFontFamily,
          },
        ];
        const headingFontFamily = themeObject.typography.h1.fontFamily ?? DEFAULT_FONT_STRING;

        // 不能影响 Heading 字体
        if (headingFontFamily !== bodyFontFamily) {
          headingVariants.map((v) => ({
            path: `typography.${v}.fontFamily`,
            value: headingFontFamily,
          }));
        }

        setThemeOptions(updates);
      }
    }

    onClose();
  };

  // 计算列表高度
  const listHeight = useMemo(() => {
    const drawerHeight = isMobile ? '80vh' : '100%';
    const headerHeight = 120; // 标题、搜索、分类、总数显示的高度
    const footerHeight = 120; // 随机按钮和当前字体信息的高度
    return `calc(${drawerHeight} - ${headerHeight + footerHeight}px)`;
  }, [isMobile]);

  const drawerContent = (
    <Stack sx={{ p: 2, width: isMobile ? 'auto' : 320, height: '100%' }}>
      {/* 标题栏 */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
          {variant === 'Heading' ? t('editor.heading') : t('editor.body')}
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Stack>

      {/* 分类选择 */}
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>字体分类</InputLabel>
        <Select
          value={selectedCategory}
          label="字体分类"
          onChange={(e) => handleCategoryChange(e.target.value)}
          endAdornment={<ExpandMore />}
        >
          {categoryOptions.map((category) => (
            <MenuItem key={category} value={category}>
              {category === 'All' ? '所有分类' : category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* 字体搜索 */}
      <TextField
        placeholder={t('editor.searchFonts')}
        value={searchQuery}
        size="small"
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          endAdornment: searchQuery ? (
            <IconButton size="small" onClick={() => handleSearchChange('')}>
              <Close />
            </IconButton>
          ) : null,
        }}
        onChange={(e) => handleSearchChange(e.target.value)}
      />

      {/* 字体总数显示 */}
      <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          共找到
        </Typography>
        <Chip 
          label={totalCount} 
          size="small" 
          color="primary" 
          variant="outlined"
        />
        <Typography variant="body2" color="text.secondary">
          个字体
        </Typography>
      </Box>

      {/* 虚拟滚动字体列表 */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <VirtualFontList
          fonts={fonts}
          loading={loading}
          onFontSelect={handleFontSelect}
          height={listHeight}
          previewText={t('editor.fontPreviewText')}
          onLoadMore={loadMore}
          hasMore={hasMore}
        />
      </Box>

      {/* 随机字体 */}
      <Box sx={{ mt: 2 }}>
        <ButtonShuffle />
      </Box>

      {/* 当前使用的字体 */}
      <Box>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
          {t('editor.activeFont')}
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
      PaperProps={{ sx: { height: { xs: '80vh', md: '100%' } } }}>
      {drawerContent}
    </Drawer>
  );
}

export default TypographyEditDrawer;
