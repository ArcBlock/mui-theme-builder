import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import { Close } from '@mui/icons-material';
import { Box, Button, Drawer, IconButton, Stack, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { PaletteColor, darken, lighten, styled } from '@mui/material/styles';
import { get } from 'lodash';
import { useMemo } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useThemeStore } from 'src/state/themeStore';

import ButtonShuffle from '../Common/ButtonShuffle';

interface ColorEditDrawerProps {
  open: boolean;
  colorType: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | null;
  onClose: () => void;
}

function ColorEditDrawer({ open, colorType, onClose }: ColorEditDrawerProps) {
  const { t } = useLocaleContext();
  const themeObject = useThemeStore((s) => s.themeObject);
  const isMobile = useMediaQuery(themeObject.breakpoints.down('md'));
  const setThemeOptions = useThemeStore((s) => s.setThemeOptions);

  const color = useMemo(() => {
    if (!colorType) return {} as PaletteColor;
    const palette = get(themeObject.palette, colorType);

    return palette;
  }, [colorType, themeObject]);

  const handleMainColorChange = (newColor: string) => {
    if (!colorType) return;

    const augmentedColor = themeObject.palette.augmentColor({ color: { main: newColor } } as any);

    setThemeOptions([
      { path: `palette.${colorType}.main`, value: newColor },
      { path: `palette.${colorType}.light`, value: augmentedColor.light },
      { path: `palette.${colorType}.dark`, value: augmentedColor.dark },
      { path: `palette.${colorType}.contrastText`, value: augmentedColor.contrastText },
    ]);
  };

  const drawerContent = (
    <Stack sx={{ p: 2, width: isMobile ? 'auto' : 320 }} spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">{t('editor.colors')}</Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Stack>

      {colorType && (
        <>
          <Box
            sx={{
              borderRadius: 2,
              bgcolor: color.main,
              '& .react-colorful__hue': {
                height: '12px',
              },
              '& .react-colorful__pointer': {
                width: '14px',
                height: '14px',
              },
            }}>
            <HexColorPicker color={color.main} style={{ width: '100%' }} onChange={handleMainColorChange} />
          </Box>
          <TextField
            label="Hex"
            value={color.main}
            size="small"
            // InputProps={{
            //   endAdornment: <Button size="small">Copy</Button>,
            // }}
            onChange={(e) => handleMainColorChange(e.target.value)}
          />
          {/* <TextField label="Name" value={colorType} size="small" disabled /> */}
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            {t('editor.shades')}
          </Typography>
          <Stack spacing={1}>
            <ShadeLabel>Light</ShadeLabel>
            <ShadeItem colorValue={color.light} />
            <ShadeLabel>Dark</ShadeLabel>
            <ShadeItem colorValue={color.dark} />
            <ShadeLabel>Contrast Text</ShadeLabel>
            <ShadeItem colorValue={color.contrastText} />
          </Stack>
        </>
      )}

      <ButtonShuffle />
    </Stack>
  );

  return (
    <Drawer anchor={isMobile ? 'bottom' : 'left'} open={open} onClose={onClose}>
      {drawerContent}
    </Drawer>
  );
}

const ShadeLabel = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.body2.fontSize,
  fontWeight: theme.typography.body2.fontWeight,
  color: theme.palette.text.secondary,
}));

function ShadeItem({ colorValue }: { colorValue: string }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        p: 1,
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
      }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box sx={{ width: 24, height: 24, borderRadius: 0.5, bgcolor: colorValue }} />
        <Box>{colorValue}</Box>
      </Stack>
    </Stack>
  );
}

export default ColorEditDrawer;
