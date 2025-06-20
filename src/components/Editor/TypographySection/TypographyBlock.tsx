import { Paper, Stack, Typography } from '@mui/material';
import { useThemeStore } from 'src/state/themeStore';

interface TypographyBlockProps {
  variant: string;
  onClick: () => void;
}

function TypographyBlock({ variant, onClick }: TypographyBlockProps) {
  const themeObject = useThemeStore((s) => s.themeObject);
  const typographyStyle =
    variant === 'base'
      ? themeObject.typography
      : (themeObject.typography[variant as keyof typeof themeObject.typography] as any);

  const { fontFamily, fontSize, fontWeight } = typographyStyle;

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
          {variant}
        </Typography>
        <Typography variant={variant as any} sx={{ fontSize: '2em', fontWeight: fontWeight }}>
          {fontFamily?.split(',')[0].replace(/"/g, '')}
        </Typography>
      </Stack>
    </Paper>
  );
}

export default TypographyBlock;
