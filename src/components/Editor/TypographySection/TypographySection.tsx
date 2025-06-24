import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { TextVariant } from 'src/types/theme';

import { ButtonShuffle } from '../Common/ButtonShuffle';
import TypographyBlock from './TypographyBlock';
import TypographyEditDrawer from './TypographyEditDrawer';

function TypographySection() {
  const { t } = useLocaleContext();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<TextVariant | null>(null);

  const handleVariantClick = (variant: TextVariant) => {
    setSelectedVariant(variant);
    setDrawerOpen(true);
  };

  return (
    <Box sx={{ mt: 3 }}>
      {/* 标题 */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        {/* 标题 */}
        <Typography variant="h5">{t('editor.typography')}</Typography>
        {/* 工具栏 */}
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
          {/* Shuffle 按钮 */}
          <ButtonShuffle />
        </Box>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6} key="base">
          <TypographyBlock variant="Heading" onClick={() => handleVariantClick('Heading')} />
        </Grid>
        <Grid item xs={12} md={6} key="base">
          <TypographyBlock variant="Body" onClick={() => handleVariantClick('Body')} />
        </Grid>
      </Grid>

      {/* 字体编辑抽屉 */}
      <TypographyEditDrawer open={drawerOpen} variant={selectedVariant} onClose={() => setDrawerOpen(false)} />
    </Box>
  );
}

export default TypographySection;
