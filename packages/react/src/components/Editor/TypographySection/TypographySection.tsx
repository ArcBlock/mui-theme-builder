import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import { Box, Button, Grid, Stack, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import { useThemeBuilder } from 'src/context/themeBuilder';
import useGoogleFonts from 'src/hooks/useGoogleFonts';
import { TextVariant } from 'src/types/theme';

import { ButtonShuffle } from '../Common/ButtonShuffle';
import { FontFamilySelectorDrawer } from './FontFamilySelectorDrawer';
import { FontSizeDrawer } from './FontSizeDrawer';
import TypographyBlock from './TypographyBlock';

function TypographySection() {
  const { t } = useLocaleContext();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [fontSizeDrawerOpen, setFontSizeDrawerOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<TextVariant>('heading');
  const setFontOptions = useThemeBuilder((s) => s.setFontOptions);
  const isThemeLocked = useThemeBuilder((s) => s.isThemeLocked());
  const { shuffleFonts } = useGoogleFonts({ category: 'All', searchQuery: '' });

  const handleVariantClick = (variant: TextVariant) => {
    if (isThemeLocked) return;

    setSelectedVariant(variant);
    setDrawerOpen(true);
  };

  const handleShuffleFonts = () => {
    const { heading, body } = shuffleFonts();
    const updates: Parameters<typeof setFontOptions>[0] = {};

    if (heading) {
      updates.heading = { fontFamily: heading.f };
    }
    if (body) {
      updates.body = { fontFamily: body.f };
    }

    setFontOptions(updates);
  };

  return (
    <Box sx={{ mt: 3 }}>
      {/* 标题 */}
      <Stack
        direction="row"
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}>
        {/* 标题 */}
        <Typography variant="h5">{t('editor.typographySection.title')}</Typography>
        {/* 工具栏 */}
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
          {/* 调整字体大小 */}
          <Tooltip title={t('editor.typographySection.adjustFontSize')}>
            <Button
              variant="outlined"
              size="small"
              disabled={isThemeLocked}
              sx={{ color: 'inherit', borderColor: 'divider', minWidth: 'auto' }}
              onClick={() => setFontSizeDrawerOpen(true)}>
              <FormatSizeIcon sx={{ py: '2px' }} />
            </Button>
          </Tooltip>
          {/* Shuffle 按钮 */}
          <ButtonShuffle disabled={isThemeLocked} onClick={handleShuffleFonts} />
        </Box>
      </Stack>
      {/* font 卡片 */}
      <Grid container spacing={2}>
        <Grid
          size={{
            xs: 12,
            sm: 6,
          }}>
          <TypographyBlock variant="heading" onClick={() => handleVariantClick('heading')} />
        </Grid>
        <Grid
          size={{
            xs: 12,
            sm: 6,
          }}>
          <TypographyBlock variant="body" onClick={() => handleVariantClick('body')} />
        </Grid>
      </Grid>
      {/* 字体编辑抽屉 */}
      <FontFamilySelectorDrawer open={drawerOpen} variant={selectedVariant} onClose={() => setDrawerOpen(false)} />
      {/* 字体大小设置抽屉 */}
      <FontSizeDrawer open={fontSizeDrawerOpen} onClose={() => setFontSizeDrawerOpen(false)} />
    </Box>
  );
}

export default TypographySection;
