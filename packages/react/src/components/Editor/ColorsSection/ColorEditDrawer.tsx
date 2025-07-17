import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import { Close } from '@mui/icons-material';
import { Box, Drawer, IconButton, Stack, Typography, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import { get } from 'lodash';
import { useMemo } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useThemeBuilder } from 'src/context/themeBuilder';
import { getByPath } from 'src/utils';

import { ButtonShuffle } from '../Common/ButtonShuffle';
import { HexColorField } from './HexColorField';
import type { NeutralColorType } from './NeutralColorBlock';

const ColorPickerWrapper = styled(Box)(() => ({
  '& .react-colorful__hue': {
    height: '12px',
  },
  '& .react-colorful__pointer': {
    width: '14px',
    height: '14px',
  },
}));

const ShadeLabel = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.body2.fontSize,
  fontWeight: theme.typography.body2.fontWeight,
  color: theme.palette.text.secondary,
}));

function ShadeItem({ colorValue }: { colorValue: string }) {
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 1,
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
      }}>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'center',
        }}>
        <Box sx={{ width: 24, height: 24, borderRadius: 0.5, bgcolor: colorValue }} />
        <Box>{colorValue}</Box>
      </Stack>
    </Stack>
  );
}

export const colorTypes = ['primary', 'secondary', 'success', 'error', 'info', 'warning'] as const;
export type MainColorType = (typeof colorTypes)[number];
export type ColorType = MainColorType | NeutralColorType;

function isMainColor(colorType: ColorType | null): colorType is MainColorType {
  return !!colorType && colorTypes.includes(colorType as MainColorType);
}

export interface ColorEditDrawerProps {
  open: boolean;
  colorType: ColorType | null;
  onClose: () => void;
}

export function ColorEditDrawer({ open, colorType, onClose }: ColorEditDrawerProps) {
  const { t } = useLocaleContext();
  const themeObject = useThemeBuilder((s) => s.themeObject);
  const isMobile = useMediaQuery(themeObject.breakpoints.down('md'));
  const setThemeOptions = useThemeBuilder((s) => s.setThemeOptions);
  const removeThemeOption = useThemeBuilder((s) => s.removeThemeOption);
  const shuffleColors = useThemeBuilder((s) => s.shuffleColors);

  const mainColor = useMemo(() => {
    if (isMainColor(colorType)) {
      const palette = get(themeObject.palette, colorType);

      return palette;
    }
    return null;
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

  const neutralColor = useMemo<string | null>(() => {
    if (colorType && !isMainColor(colorType)) {
      // 比如 background.default
      const value = getByPath(themeObject.palette, colorType);

      return value;
    }
    return null;
  }, [colorType, themeObject]);

  const handleNeutralColorChange = (newColor: string) => {
    if (!colorType) return;

    setThemeOptions([{ path: `palette.${colorType}`, value: newColor }]);
  };

  const handleShuffleColor = () => {
    if (!colorType) return;
    if (mainColor) {
      shuffleColors(colorType);
    }
  };

  const drawerContent = (
    <Stack sx={{ p: 2, width: isMobile ? 'auto' : 320 }} spacing={2}>
      <Stack
        direction="row"
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Typography variant="h6">{t('editor.colorSection.title')}</Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Stack>

      {mainColor && (
        <>
          <ColorPickerWrapper>
            <HexColorPicker color={mainColor.main} style={{ width: '100%' }} onChange={handleMainColorChange} />
          </ColorPickerWrapper>
          <HexColorField
            path={`palette.${colorType}.main`}
            onChange={(v) => handleMainColorChange(v)}
            onReset={(p) => removeThemeOption(p)}
          />
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            {t('editor.colorSection.shades')}
          </Typography>
          <Stack spacing={1}>
            <ShadeLabel>{t('editor.colorSection.light')}</ShadeLabel>
            <ShadeItem colorValue={mainColor.light} />
            <ShadeLabel>{t('editor.colorSection.dark')}</ShadeLabel>
            <ShadeItem colorValue={mainColor.dark} />
            <ShadeLabel>{t('editor.colorSection.contrastText')}</ShadeLabel>
            <ShadeItem colorValue={mainColor.contrastText} />
          </Stack>
          {/* 随机颜色 */}
          <ButtonShuffle sx={{ mt: 1 }} onClick={handleShuffleColor} />
        </>
      )}
      {neutralColor && (
        <>
          <ColorPickerWrapper>
            <HexColorPicker color={neutralColor} style={{ width: '100%' }} onChange={handleNeutralColorChange} />
          </ColorPickerWrapper>
          <HexColorField
            path={`palette.${colorType}`}
            onChange={(v) => handleNeutralColorChange(v)}
            onReset={(p) => removeThemeOption(p)}
          />
        </>
      )}
    </Stack>
  );

  return (
    <Drawer
      anchor={isMobile ? 'bottom' : 'left'}
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: { sx: { backgroundColor: 'transparent' } },
      }}>
      {drawerContent}
    </Drawer>
  );
}
