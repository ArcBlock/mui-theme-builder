import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Box, IconButton, Paper, Stack, Typography } from '@mui/material';
import { PaletteColor } from '@mui/material/styles';
import { useMemoizedFn } from 'ahooks';
import useMobile from 'src/hooks/useMobile';
import { defaultDarkTheme, defaultLightTheme } from 'src/siteTheme';
import { useThemeStore } from 'src/state/themeStore';
import { getByPath } from 'src/utils';

import { IconButtonLock } from '../Common/IconButtonLock';
import { IconButtonShuffle } from '../Common/IconButtonShuffle';

export interface ColorBlockProps {
  colorType: string;
  onClick?: () => void;
}

export function ColorBlock({ colorType, onClick }: ColorBlockProps) {
  const { t } = useLocaleContext();
  const isMobile = useMobile();
  const themeObject = useThemeStore((s) => s.themeObject);
  const isLocked = useThemeStore((s) => s.getCurrentConcept().editor.colors[colorType]?.isLocked ?? false);
  const setColorLock = useThemeStore((s) => s.setColorLock);
  const removeThemeOption = useThemeStore((s) => s.removeThemeOption);
  const shuffleColors = useThemeStore((s) => s.shuffleColors);

  const isDark = themeObject.palette.mode === 'dark';
  const defaultColor = isDark
    ? getByPath(defaultDarkTheme, `palette.${colorType}.main`)
    : getByPath(defaultLightTheme, `palette.${colorType}.main`);
  const color = themeObject.palette[colorType as keyof typeof themeObject.palette] as PaletteColor;
  const mainColor = color?.main || themeObject.palette.grey[200];
  const actionColor = themeObject.palette.getContrastText(mainColor);

  const handleReset = useMemoizedFn((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    removeThemeOption(`palette.${colorType}`);
  });

  const toggleLock = useMemoizedFn((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setColorLock(colorType, !isLocked);
  });

  const handleShuffle = useMemoizedFn((e) => {
    e.stopPropagation();
    shuffleColors(colorType);
  });

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
        '& .action': {
          opacity: isMobile ? 1 : 0,
          transition: 'opacity 0.2s',
          '&.is-locked': {
            opacity: 1,
          },
        },
        '&:hover': {
          borderColor: 'primary.main',
          '& .action': {
            opacity: 1,
          },
        },
      }}
      onClick={onClick}>
      <Stack
        direction="row"
        sx={{
          position: 'absolute',
          top: 8,
          right: 4,
        }}>
        {/* Reset Icon */}
        {mainColor !== defaultColor && (
          <IconButton className="action" title={t('editor.reset')} onClick={handleReset}>
            <RestartAltIcon sx={{ fontSize: 20, color: actionColor }} />
          </IconButton>
        )}
        {/* Shuffle Icon */}
        <IconButtonShuffle color={actionColor} onClick={handleShuffle} />
        {/* Lock Icon */}
        <IconButtonLock lock={isLocked} color={actionColor} onClick={toggleLock} />
      </Stack>
      <Box
        sx={{
          flexGrow: 1,
          minHeight: 40
        }} />
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
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
