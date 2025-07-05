import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import useGoogleFonts from 'src/hooks/useGoogleFonts';
import { useThemeStore } from 'src/state/themeStore';
import { TextVariant } from 'src/types/theme';

import { ButtonShuffle } from '../Common/ButtonShuffle';
import TypographyBlock from './TypographyBlock';
import TypographyEditDrawer from './TypographyEditDrawer';

function TypographySection() {
  const { t } = useLocaleContext();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<TextVariant>('heading');
  const { setFontOptions } = useThemeStore();
  const { shuffleFonts } = useGoogleFonts({ category: 'All', searchQuery: '' });

  const handleVariantClick = (variant: TextVariant) => {
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
          {/* Shuffle 按钮 */}
          <ButtonShuffle onClick={handleShuffleFonts} />
        </Box>
      </Stack>
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
      <TypographyEditDrawer open={drawerOpen} variant={selectedVariant} onClose={() => setDrawerOpen(false)} />
    </Box>
  );
}

export default TypographySection;
