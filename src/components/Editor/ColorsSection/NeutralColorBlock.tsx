import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import { Box, Paper, PaperProps, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useThemeStore } from 'src/state/themeStore';
import { getByPath } from 'src/utils';

export const neutralColorTypes = [
  'background.default',
  'background.paper',
  'divider',
  'text.hint',
  'text.disabled',
  'text.secondary',
  'text.primary',
] as const;

export type NeutralColorType = (typeof neutralColorTypes)[number];

export interface NeutralColorBlockProps extends Omit<PaperProps, 'onClick'> {
  onClick?: (key: NeutralColorType) => void;
}

export function NeutralColorBlock({ onClick, sx, ...props }: NeutralColorBlockProps) {
  const { t } = useLocaleContext();
  const themeObject = useThemeStore((s) => s.themeObject);
  const neutralColors = useMemo(() => {
    const { palette } = themeObject;

    return neutralColorTypes.map((key) => ({ key, value: getByPath(palette, key) }));
  }, [themeObject]);

  return (
    <Paper
      variant="outlined"
      sx={{
        height: '100%',
        borderRadius: 1.5,
        overflow: 'hidden',
        ...sx,
      }}
      {...props}>
      <Typography variant="subtitle1" sx={{ py: 1.5, px: 1 }}>
        {t('editor.colorSection.neutral.title')}
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
              cursor: 'pointer',
              border: '1px solid',
              borderColor: 'transparent',
              '&:hover': {
                borderColor: 'primary.main',
              },
            }}
            onClick={() => onClick?.(key)}>
            <Typography>{value}</Typography>
            <Typography>{t(`editor.colorSection.neutral.${key.split('.').pop()}`)}</Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
