import { Box, Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useThemeStore } from 'src/state/themeStore';
import { PaletteColor } from '@mui/material/styles';

interface ColorBlockProps {
  colorType: string;
  onClick?: () => void;
}

function ColorBlock({ colorType, onClick }: ColorBlockProps) {
  const theme = useTheme();
  const isLocked = useThemeStore((s) => s.editor.colors[colorType]?.isLocked ?? false);
  const setColorLock = useThemeStore((s) => s.setColorLock);

  const color = theme.palette[colorType as keyof typeof theme.palette] as PaletteColor;
  const mainColor = color?.main || '#000000';
  const colorName = colorType.charAt(0).toUpperCase() + colorType.slice(1);

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        height: '100%',
        cursor: 'pointer',
        position: 'relative',
        '&:hover': {
          borderColor: 'primary.main',
          '& .lock-icon': {
            opacity: 1,
          },
        },
      }}
      onClick={onClick}>
      <Box
        className="lock-icon"
        onClick={(e) => {
          e.stopPropagation();
          setColorLock(colorType, !isLocked);
        }}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          opacity: isLocked ? 1 : 0,
          transition: 'opacity 0.2s',
          cursor: 'pointer',
          color: theme.palette.getContrastText(mainColor),
          '&:hover': {
            opacity: 1,
          },
        }}>
        {isLocked ? <LockIcon fontSize="small" /> : <LockOpenIcon fontSize="small" />}
      </Box>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        {colorName}
      </Typography>
      <Box
        sx={{
          backgroundColor: mainColor,
          borderRadius: 1,
          height: 120,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          p: 1,
          '& > *': {
            color: theme.palette.getContrastText(mainColor),
          },
        }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption">{mainColor}</Typography>
          <Typography variant="caption">main</Typography>
        </Box>
      </Box>
    </Paper>
  );
}

export default ColorBlock;
