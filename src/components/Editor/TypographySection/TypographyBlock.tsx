import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { IconButton, Paper, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import { defaultDarkTheme, defaultLightTheme } from 'src/siteTheme';
import { DEFAULT_FONT_STRING, HEADING_VARIANTS, useThemeStore } from 'src/state/themeStore';
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
  const setFontOptions = useThemeStore((s) => s.setFontOptions);

  const actions = useMemo(() => {
    const isDark = themeObject.palette.mode === 'dark';

    if (variant === 'heading') {
      return {
        getFontFamily: () => themeObject.typography.h1.fontFamily,
        getDefaultFontFamily: () =>
          isDark ? defaultDarkTheme.typography.h1.fontFamily : defaultLightTheme.typography.h1.fontFamily,
        resetFontFamily: () => {
          if (themeObject.typography.fontFamily === DEFAULT_FONT_STRING) {
            removeThemeOptions(HEADING_VARIANTS.map((v) => `typography.${v}.fontFamily`));
          } else {
            setFontOptions({ heading: { fontFamily: DEFAULT_FONT_STRING } });
          }
        },
        getLabel: () => t('editor.typographySection.heading'),
      };
    }

    // body
    return {
      getFontFamily: () => themeObject.typography.fontFamily,
      getDefaultFontFamily: () =>
        isDark ? defaultDarkTheme.typography.fontFamily : defaultLightTheme.typography.fontFamily,
      resetFontFamily: () => removeThemeOption('typography.fontFamily'),
      getLabel: () => t('editor.typographySection.body'),
    };
  }, [variant, themeObject, removeThemeOption, removeThemeOptions, t]);

  const fontFamily = actions.getFontFamily();
  const defaultFontFamily = actions.getDefaultFontFamily();

  const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    actions.resetFontFamily();
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
          {actions.getLabel()}
        </Typography>
        <Typography variant={variant as any} sx={{ fontSize: '2em' }}>
          {fontFamily?.split(',')[0].replace(/"/g, '')}
        </Typography>
      </Stack>
    </Paper>
  );
}

export default TypographyBlock;
