import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import { Box, Paper, PaperProps, Typography } from '@mui/material';
import { useThemeStore } from 'src/state/themeStore';

interface NeutralColorBlockProps extends PaperProps {
  onClick?: () => void;
}

function NeutralColorBlock({ onClick, sx, ...props }: NeutralColorBlockProps) {
  const themeObject = useThemeStore((s) => s.themeObject);
  const { t } = useLocaleContext();
  const { palette } = themeObject;
  const neutralColors = [
    { key: 'background.default', value: palette.background.default },
    { key: 'background.paper', value: palette.background.paper },
    { key: 'divider', value: palette.divider },
    { key: 'text.hint', value: palette.text.hint },
    { key: 'text.disabled', value: palette.text.disabled },
    { key: 'text.secondary', value: palette.text.secondary },
    { key: 'text.primary', value: palette.text.primary },
  ];

  return (
    <Paper
      variant="outlined"
      sx={{
        height: '100%',
        cursor: 'pointer',
        borderRadius: 1.5,
        overflow: 'hidden',
        '&:hover': {
          borderColor: 'primary.main',
        },
        ...sx,
      }}
      {...props}
      onClick={onClick}>
      <Typography variant="subtitle1" sx={{ py: 1.5, px: 1 }}>
        {t('editor.neutral')}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {neutralColors.map(({ key, value }) => (
          <Box
            key={key}
            sx={{
              height: 36,
              backgroundColor: value,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 1,
              '& > *': {
                color: themeObject.palette.getContrastText(value),
                fontSize: '0.75rem',
              },
            }}>
            <Typography>{value}</Typography>
            <Typography>{key.split('.').pop()}</Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

export default NeutralColorBlock;
