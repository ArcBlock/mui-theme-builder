import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import { Box, Stack, Typography } from '@mui/material';
import { useThemeStore } from 'src/state/themeStore';

import ButtonShuffle from '../Common/ButtonShuffle';
import BorderRadiusSelector from './BorderRadiusSelector';
import ThemeModeSelector from './ThemeModeSelector';

function StylesSection() {
  const { t } = useLocaleContext();
  const borderRadius = useThemeStore((s) => s.themeObject.shape.borderRadius) as number;
  const concept = useThemeStore((s) => s.concepts.find((c) => c.id === s.currentConceptId));
  const setThemeOption = useThemeStore((s) => s.setThemeOption);
  const setThemePrefer = useThemeStore((s) => s.setThemePrefer);

  const handleBorderRadiusChange = (value: number) => {
    setThemeOption('shape.borderRadius', value);
  };

  const handleModeChange = (prefer: 'light' | 'dark' | 'system') => {
    setThemePrefer(prefer);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">{t('editor.styles')}</Typography>
        {/* 目前 Styles 的 Shuffle 没有太大意义 */}
        {/* <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
          <ButtonShuffle />
        </Box> */}
      </Stack>

      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="body2" color="text.secondary">
            {t('editor.borderRadius')}
          </Typography>
          <BorderRadiusSelector value={borderRadius} onChange={handleBorderRadiusChange} />
        </Stack>

        <Stack spacing={1}>
          <Typography variant="body2" color="text.secondary">
            {t('editor.themePrefer')}
          </Typography>
          <ThemeModeSelector value={concept?.themeOptions.prefer} onChange={handleModeChange} />
        </Stack>
      </Stack>
    </Box>
  );
}

export default StylesSection;
