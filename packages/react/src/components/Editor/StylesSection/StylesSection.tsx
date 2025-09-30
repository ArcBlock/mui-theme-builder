import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import { Box, Stack, Typography } from '@mui/material';
import { useMemoizedFn } from 'ahooks';
import { useThemeBuilder } from 'src/context/themeBuilder';

import BorderRadiusSelector from './BorderRadiusSelector';

function StylesSection() {
  const { t } = useLocaleContext();
  const borderRadius = useThemeBuilder((s) => s.themeObject.shape.borderRadius) as number;
  const setThemeOption = useThemeBuilder((s) => s.setThemeOption);
  const isThemeLocked = useThemeBuilder((s) => s.isThemeLocked());

  const handleBorderRadiusChange = useMemoizedFn((value: number) => {
    setThemeOption('shape.borderRadius', value);
  });

  return (
    <Box sx={{ mt: 3 }}>
      <Stack
        direction="row"
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}>
        <Typography variant="h5">{t('editor.stylesSection.title')}</Typography>
      </Stack>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
            }}>
            {t('editor.stylesSection.borderRadius')}
          </Typography>
          <BorderRadiusSelector value={borderRadius} disabled={isThemeLocked} onChange={handleBorderRadiusChange} />
        </Stack>
      </Stack>
    </Box>
  );
}

export default StylesSection;
