import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button } from '@mui/material';
import React from 'react';

import AddFontDialog from './AddFontDialog';
import TypographyVariant from './TypographyVariant';

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
  const [addFontDialogOpen, setAddFontDialogOpen] = React.useState(false);

  return (
    <Box>
      {/* 添加字体按钮 */}
      <Box sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setAddFontDialogOpen(true)}
          fullWidth
          size="small">
          {t('editor.addFont')}
        </Button>
      </Box>

      {/* 字体变体列表 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {typographyVariants.map((variant) => (
          <TypographyVariant key={variant} variant={variant} />
        ))}
      </Box>

      {/* 添加字体弹窗 */}
      <AddFontDialog open={addFontDialogOpen} onClose={() => setAddFontDialogOpen(false)} />
    </Box>
  );
}

export default TypographySection;
