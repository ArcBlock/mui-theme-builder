import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import { Box, Paper, PaperProps, Typography, useTheme } from '@mui/material';
import { useMemo } from 'react';
import { useThemeBuilder } from 'src/context/themeBuilder';
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

export function NeutralColorBlock({ onClick = undefined, sx, ...props }: NeutralColorBlockProps) {
  const { t } = useLocaleContext();
  const theme = useTheme();
  const themeObject = useThemeBuilder((s) => s.themeObject);
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
              },
              cursor: 'pointer',
              border: '1px solid',
              borderColor: 'transparent',
              '&:hover': {
                borderColor: 'primary.main',
                '&:last-child': {
                  borderRadius: 1.5,
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                },
              },
            }}
            onClick={() => onClick?.(key)}>
            <Typography sx={{ fontSize: '14px' }}>{value}</Typography>
            <Typography sx={{ fontSize: '14px' }}>
              {t(`editor.colorSection.neutral.${key.split('.').pop()}`)}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
