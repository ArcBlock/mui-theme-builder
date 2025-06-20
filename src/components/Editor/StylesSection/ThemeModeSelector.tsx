import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import { Box, Paper, Stack, Typography, styled } from '@mui/material';
import { ThemePrefer } from 'src/types/theme';

const OptionPaper = styled(Paper)(({ theme }) => ({
  border: '1px solid',
  borderColor: theme.palette.divider,
  padding: theme.spacing(1.5),
  cursor: 'pointer',
  flex: 1,
  '&.Mui-selected': {
    borderColor: theme.palette.primary.main,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

interface ThemeModeSelectorProps {
  value?: ThemePrefer;
  onChange: (value: ThemePrefer) => void;
}

function ThemeModeSelector({ value = 'light', onChange }: ThemeModeSelectorProps) {
  const { t } = useLocaleContext();
  return (
    <Stack direction="row" spacing={2}>
      <OptionPaper elevation={0} className={value === 'light' ? 'Mui-selected' : ''} onClick={() => onChange('light')}>
        <Stack spacing={1} direction="row" alignItems="center">
          <Box
            sx={{
              height: 24,
              width: 24,
              bgcolor: 'grey.100',
              borderRadius: 64,
              border: '1px solid',
              borderColor: 'divider',
            }}
          />
          <Typography variant="body2">{t('editor.lightMode')}</Typography>
        </Stack>
      </OptionPaper>
      <OptionPaper elevation={0} className={value === 'dark' ? 'Mui-selected' : ''} onClick={() => onChange('dark')}>
        <Stack spacing={1} direction="row" alignItems="center">
          <Box sx={{ height: 24, width: 24, bgcolor: 'grey.800', borderRadius: 64 }} />
          <Typography variant="body2">{t('editor.darkMode')}</Typography>
        </Stack>
      </OptionPaper>
      <OptionPaper elevation={0} className={value === 'system' ? 'Mui-selected' : ''} onClick={() => onChange('system')}>
        <Stack spacing={1} direction="row" alignItems="center">
          <Box
            sx={{
              height: 24,
              width: 24,
              borderRadius: 64,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
            }}>
            <Box sx={{ flex: 1, bgcolor: 'grey.100' }} />
            <Box sx={{ flex: 1, bgcolor: 'grey.800' }} />
          </Box>
          <Typography variant="body2">{t('editor.systemPrefer')}</Typography>
        </Stack>
      </OptionPaper>
    </Stack>
  );
}

export default ThemeModeSelector;
