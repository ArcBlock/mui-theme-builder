import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import ButtonShuffle from '../Common/ButtonShuffle';
import TypographyBlock from './TypographyBlock';
import TypographyEditDrawer from './TypographyEditDrawer';

const typographyVariants = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'body1',
  'body2',
  'subtitle1',
  'subtitle2',
  'button',
  'caption',
  'overline',
] as const;

function TypographySection() {
  const { t } = useLocaleContext();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  const handleVariantClick = (variant: string) => {
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
          <TypographyBlock variant="base" onClick={() => handleVariantClick('base')} />
        </Grid>
      </Grid>

      {/* 字体变体列表 */}
      {/* <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {typographyVariants.map((variant) => (
          <TypographyVariant key={variant} variant={variant} />
        ))}
      </Box> */}

      {/* 添加字体按钮 */}
      {/* <Box sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setAddFontDialogOpen(true)}
          fullWidth
          size="small">
          {t('editor.addFont')}
        </Button>
      </Box> */}

      {/* 字体编辑抽屉 */}
      <TypographyEditDrawer open={drawerOpen} variant={selectedVariant} onClose={() => setDrawerOpen(false)} />
    </Box>
  );
}

export default TypographySection;
