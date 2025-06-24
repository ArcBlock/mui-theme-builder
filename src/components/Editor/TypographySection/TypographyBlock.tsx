import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import { Paper, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useThemeStore } from 'src/state/themeStore';
import { TextVariant } from 'src/types/theme';

interface TypographyBlockProps {
  variant: TextVariant;
  onClick: () => void;
}

function TypographyBlock({ variant, onClick }: TypographyBlockProps) {
  const { t } = useLocaleContext();
  const themeObject = useThemeStore((s) => s.themeObject);
  const fontFamily = useMemo(() => {
    if (variant === 'Heading') {
      return themeObject.typography.h1.fontFamily;
    }

    // Body
    return themeObject.typography.fontFamily;
  }, [variant, themeObject]);

  return (
    <Paper
      variant="outlined"
      onClick={onClick}
      sx={{
        p: 2,
        height: '100%',
        cursor: 'pointer',
        '&:hover': {
          borderColor: 'primary.main',
        },
      }}>
      <Stack spacing={1}>
        <Typography variant="caption" color="text.primary" sx={{ textTransform: 'capitalize' }}>
          {variant === 'Heading' ? t('editor.heading') : t('editor.body')}
        </Typography>
        <Typography variant={variant as any} sx={{ fontSize: '2em' }}>
          {fontFamily?.split(',')[0].replace(/"/g, '')}
        </Typography>
      </Stack>
    </Paper>
  );
}

export default TypographyBlock;
