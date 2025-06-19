import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import { Box, Typography } from '@mui/material';
import { useThemeStore } from 'src/state/themeStore';

interface ColorBlockProps {
  colorType: 'neutral' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  onClick?: () => void;
}

function ColorBlock({ colorType, onClick }: ColorBlockProps) {
  const { t } = useLocaleContext();
  const currentConcept = useThemeStore((s) => {
    const { concepts } = s;
    const { currentConceptId } = s;
    return concepts.find((c) => c.id === currentConceptId);
  });
  const mode = useThemeStore((s) => s.mode);

  // 获取颜色值
  const getColorValue = () => {
    if (!currentConcept) return '#000000';

    const themeOptions = currentConcept.themeOptions[mode];
    if (!themeOptions?.palette) return '#000000';

    switch (colorType) {
      case 'neutral':
        return themeOptions.palette.background?.default || '#ffffff';
      case 'primary':
        return themeOptions.palette.primary?.main || '#1976d2';
      case 'secondary':
        return themeOptions.palette.secondary?.main || '#dc004e';
      case 'success':
        return themeOptions.palette.success?.main || '#2e7d32';
      case 'error':
        return themeOptions.palette.error?.main || '#d32f2f';
      case 'info':
        return themeOptions.palette.info?.main || '#0288d1';
      case 'warning':
        return themeOptions.palette.warning?.main || '#ed6c02';
      default:
        return '#000000';
    }
  };

  const colorValue = getColorValue();

  return (
    <Box
      onClick={onClick}
      sx={{
        width: '100%',
        height: 60,
        backgroundColor: colorValue,
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        cursor: onClick ? 'pointer' : 'default',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        p: 1,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': onClick
          ? {
              transform: 'translateY(-2px)',
              boxShadow: 2,
            }
          : {},
      }}>
      <Typography
        variant="caption"
        sx={{
          color: colorType === 'neutral' ? 'text.primary' : 'white',
          fontWeight: 500,
          textShadow: colorType === 'neutral' ? 'none' : '0 1px 2px rgba(0,0,0,0.3)',
        }}>
        {t(`editor.${colorType}`)}
      </Typography>
    </Box>
  );
}

export default ColorBlock;
