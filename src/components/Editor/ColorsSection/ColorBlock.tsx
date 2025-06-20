import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Box, Paper, Stack, Typography } from '@mui/material';
import { PaletteColor } from '@mui/material/styles';
import { useCallback } from 'react';
import { useThemeStore } from 'src/state/themeStore';

interface ColorBlockProps {
  colorType: string;
  onClick?: () => void;
}

function ColorBlock({ colorType, onClick }: ColorBlockProps) {
  const themeObject = useThemeStore((s) => s.themeObject);
  const isLocked = useThemeStore((s) => s.editor.colors[colorType]?.isLocked ?? false);
  const setColorLock = useThemeStore((s) => s.setColorLock);

  const color = themeObject.palette[colorType as keyof typeof themeObject.palette] as PaletteColor;
  const mainColor = color?.main || themeObject.palette.grey[200];

  const toggleLock = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      setColorLock(colorType, !isLocked);
    },
    [colorType, isLocked, setColorLock],
  );

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        borderRadius: 1.5,
        backgroundColor: mainColor,
        '& .lock': {
          p: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 1,
          color: themeObject.palette.getContrastText(mainColor),
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        },
        '& .lock-open': {
          opacity: 0,
          transition: 'opacity 0.2s',
        },
        '&:hover': {
          borderColor: 'primary.main',
          '& .lock-open': {
            opacity: 1,
          },
        },
      }}
      onClick={onClick}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        {/* Color Name */}
        <Typography variant="subtitle1"></Typography>
        {/* Lock Icon */}
        <Box className={`lock ${isLocked ? '' : 'lock-open'}`} onClick={toggleLock}>
          {isLocked ? <LockIcon style={{ fontSize: 14 }} /> : <LockOpenIcon style={{ fontSize: 14 }} />}
        </Box>
      </Stack>
      <Box flexGrow={1} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: themeObject.palette.getContrastText(mainColor),
        }}>
        <Typography sx={{ fontSize: 18 }}>{mainColor}</Typography>
        <Typography sx={{ fontSize: 12, borderRadius: 1, padding: 1, backgroundColor: 'action.hover' }}>
          {colorType}
        </Typography>
      </Box>
    </Paper>
  );
}

export default ColorBlock;
