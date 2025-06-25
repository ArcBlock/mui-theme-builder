import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import { Box, Stack, Typography } from '@mui/material';
import { useThemeStore } from 'src/state/themeStore';

import BorderRadiusSelector from './BorderRadiusSelector';

function StylesSection() {
  const { t } = useLocaleContext();
  const borderRadius = useThemeStore((s) => s.themeObject.shape.borderRadius) as number;
  const setThemeOption = useThemeStore((s) => s.setThemeOption);

  const handleBorderRadiusChange = (value: number) => {
    setThemeOption('shape.borderRadius', value);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">{t('editor.stylesSection.title')}</Typography>
      </Stack>

      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="body2" color="text.secondary">
            {t('editor.stylesSection.borderRadius')}
          </Typography>
          <BorderRadiusSelector value={borderRadius} onChange={handleBorderRadiusChange} />
        </Stack>
      </Stack>
    </Box>
  );
}

export default StylesSection;
