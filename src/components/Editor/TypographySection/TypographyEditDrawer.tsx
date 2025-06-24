import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import { DEFAULT_FONTS } from '@blocklet/theme';
import { Close, Search } from '@mui/icons-material';
import GoogleIcon from '@mui/icons-material/Google';
import {
  Box,
  CircularProgress,
  Drawer,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useThemeStore } from 'src/state/themeStore';
import { TextVariant } from 'src/types/theme';

import { ButtonShuffle } from '../Common/ButtonShuffle';
import useGoogleFonts from './hooks/useGoogleFonts';

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
  const [searchQuery, setSearchQuery] = useState('');
  const { fonts, loading } = useGoogleFonts(searchQuery);
  const addFonts = useThemeStore((s) => s.addFonts);
  const setThemeOptions = useThemeStore((s) => s.setThemeOptions);

  // 当前使用的字体
  const activeFont = useMemo(() => {
    let fontFamily = themeObject.typography.fontFamily ?? DEFAULT_FONT_STRING;

    if (variant === 'Heading') {
      fontFamily = themeObject.typography.h1.fontFamily ?? DEFAULT_FONT_STRING;
    }

    return fontFamily.split(',')[0].replace(/"/g, '');
  }, [variant, themeObject]);

  // 修改字体
  const handleFontSelect = (fontFamily: string) => {
    if (variant) {
      addFonts([fontFamily]);

      if (variant === 'Heading') {
        const configs = headingVariants.map((v) => ({
          path: `typography.${v}.fontFamily`,
          value: `"${fontFamily}", ${DEFAULT_FONT_STRING}`,
        }));
        setThemeOptions(configs);
      } else {
        const bodyFontFamily = `"${fontFamily}", ${DEFAULT_FONT_STRING}`;
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

  const drawerContent = (
    <Stack sx={{ p: 2, width: isMobile ? 'auto' : 320, height: '100%' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
          {variant === 'Heading' ? t('editor.heading') : t('editor.body')}
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Stack>
      {/* 字体搜索 */}
      <TextField
        placeholder={t('editor.searchFonts')}
        value={searchQuery}
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          endAdornment: searchQuery ? (
            <IconButton size="small" onClick={() => setSearchQuery('')}>
              <Close />
            </IconButton>
          ) : null,
        }}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {/* 字体列表 */}
      <Stack spacing={1} sx={{ flex: 1, overflowY: 'auto', mt: 2, mb: 2 }}>
        {loading ? (
          <CircularProgress sx={{ alignSelf: 'center' }} />
        ) : (
          fonts.map((font) => (
            <Paper
              key={font.family}
              variant="outlined"
              onClick={() => handleFontSelect(font.family)}
              sx={{
                p: 1.5,
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                '&:hover': {
                  borderColor: 'grey.700',
                },
              }}>
              <Box>
                <Typography sx={{ fontFamily: font.family, fontSize: '1.2rem' }}>
                  {t('editor.fontPreviewText')}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                  <GoogleIcon sx={{ fontSize: '14px', color: 'text.secondary' }} />
                  <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>{font.family}</Typography>
                </Stack>
              </Box>
            </Paper>
          ))
        )}
      </Stack>
      {/* 随机字体 */}
      <ButtonShuffle />
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
