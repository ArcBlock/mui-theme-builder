import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { IconButton, Paper, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import { defaultDarkTheme, defaultLightTheme } from 'src/siteTheme';
import { HEADING_VARIANTS, useThemeStore } from 'src/state/themeStore';
import { TextVariant } from 'src/types/theme';

interface TypographyBlockProps {
  variant: TextVariant;
  onClick: () => void;
}

function TypographyBlock({ variant, onClick }: TypographyBlockProps) {
  const { t } = useLocaleContext();
  const themeObject = useThemeStore((s) => s.themeObject);
  const removeThemeOption = useThemeStore((s) => s.removeThemeOption);
  const removeThemeOptions = useThemeStore((s) => s.removeThemeOptions);

  // 当前值
  const fontFamily = useMemo(() => {
    if (variant === 'heading') {
      return themeObject.typography.h1.fontFamily;
    }

    // Body
    return themeObject.typography.fontFamily;
  }, [variant, themeObject]);

  // 默认值
  const defaultFontFamily = useMemo(() => {
    if (variant === 'heading') {
      return themeObject.mode === 'dark'
        ? defaultDarkTheme.typography.h1.fontFamily
        : defaultLightTheme.typography.h1.fontFamily;
    }
    return themeObject.mode === 'dark'
      ? defaultDarkTheme.typography.fontFamily
      : defaultLightTheme.typography.fontFamily;
  }, [variant, themeObject]);

  const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (variant === 'heading') {
      removeThemeOptions(HEADING_VARIANTS.map((v) => `typography.${v}.fontFamily`));
    } else {
      removeThemeOption('typography.fontFamily');
    }
  };

  return (
    <Paper
      variant="outlined"
      onClick={onClick}
      sx={{
        position: 'relative',
        p: 2,
        height: '100%',
        cursor: 'pointer',
        '&:hover': {
          borderColor: 'primary.main',
        },
      }}>
      {fontFamily !== defaultFontFamily && (
        <IconButton sx={{ position: 'absolute', top: 2, right: 2 }} onClick={handleReset}>
          <RestartAltIcon sx={{ fontSize: 20 }} />
        </IconButton>
      )}
      <Stack spacing={1}>
        <Typography variant="subtitle1" color="text.primary" sx={{ textTransform: 'capitalize' }}>
          {variant === 'heading' ? t('editor.typographySection.heading') : t('editor.typographySection.body')}
        </Typography>
        <Typography variant={variant as any} sx={{ fontSize: '2em' }}>
          {fontFamily?.split(',')[0].replace(/"/g, '')}
        </Typography>
      </Stack>
    </Paper>
  );
}

export default TypographyBlock;
