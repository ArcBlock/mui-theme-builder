import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import Brightness2OutlinedIcon from '@mui/icons-material/Brightness2Outlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { Box, Grid, Stack, Typography, styled } from '@mui/material';
import { useState } from 'react';
import useMobile from 'src/hooks/useMobile';
import { useThemeStore } from 'src/state/themeStore';

import { ButtonShuffle } from '../Common/ButtonShuffle';
import { ColorBlock } from './ColorBlock';
import { ColorEditDrawer, colorTypes } from './ColorEditDrawer';
import { NeutralColorBlock, type NeutralColorType } from './NeutralColorBlock';

type ColorType = (typeof colorTypes)[number] | NeutralColorType;

const ToggleButton = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  borderRadius: theme.shape.borderRadius,
  padding: `${theme.spacing(0.5)} ${theme.spacing(1.4)}`,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&.is-active': {
    backgroundColor: theme.palette.background.default,
  },
}));

function ColorsSection() {
  const { t } = useLocaleContext();
  const mode = useThemeStore((s) => s.getCurrentConcept().mode);
  const isMobile = useMobile();
  const setThemeMode = useThemeStore((s) => s.setThemeMode);
  const shuffleColors = useThemeStore((s) => s.shuffleColors);
  const [selectedColor, setSelectedColor] = useState<ColorType | null>(null);

  const handleColorClick = (colorType: ColorType) => {
    setSelectedColor(colorType);
  };

  const handleShuffle = () => {
    shuffleColors();
  };

  const handleModeChange = (newMode: 'light' | 'dark') => {
    setThemeMode(newMode);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        {/* 标题 */}
        <Typography variant="h5">{t('editor.colorSection.title')}</Typography>
        {/* 工具栏 */}
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
          {/* 模式切换 */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'grey.100',
              borderRadius: 1,
              gap: '2px',
              p: '2px',
            }}>
            <ToggleButton className={mode === 'light' ? 'is-active' : ''} onClick={() => handleModeChange('light')}>
              <LightModeOutlinedIcon style={{ fontSize: 18 }} />
            </ToggleButton>
            <ToggleButton className={mode === 'dark' ? 'is-active' : ''} onClick={() => handleModeChange('dark')}>
              <Brightness2OutlinedIcon style={{ fontSize: 18 }} />
            </ToggleButton>
          </Box>
          {/* Shuffle 按钮 */}
          <ButtonShuffle onClick={handleShuffle} />
        </Box>
      </Stack>
      {/* 颜色块网格 */}
      {!isMobile && (
        <Stack direction="row" alignItems="stretch">
          {/* Neutrals 色块 */}
          <NeutralColorBlock sx={{ width: '25%', flexShrink: 0 }} onClick={(key) => handleColorClick(key)} />
          {/* 其他颜色块 */}
          <Stack direction="row" sx={{ flexGrow: 1, flexWrap: 'wrap', mt: -1 }}>
            {colorTypes.map((colorType) => (
              <Box key={colorType} sx={{ width: '33.33%', pl: 1, pt: 1, flexShrink: 0 }}>
                <ColorBlock colorType={colorType} onClick={() => handleColorClick(colorType)} />
              </Box>
            ))}
          </Stack>
        </Stack>
      )}
      {isMobile && (
        <>
          <Stack direction="row" spacing={1} mb={1}>
            <NeutralColorBlock sx={{ flex: '1 0 0' }} onClick={(key) => handleColorClick(key)} />
            <Stack spacing={1} sx={{ flex: '1 0 0' }}>
              {colorTypes.slice(0, 2).map((colorType) => (
                <Box key={colorType} sx={{ flexGrow: 1 }}>
                  <ColorBlock colorType={colorType} onClick={() => handleColorClick(colorType)} />
                </Box>
              ))}
            </Stack>
          </Stack>
          <Grid container spacing={1}>
            {colorTypes.slice(2).map((colorType) => (
              <Grid item xs={6} key={colorType}>
                <ColorBlock colorType={colorType} onClick={() => handleColorClick(colorType)} />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* 颜色编辑弹窗 */}
      <ColorEditDrawer open={!!selectedColor} colorType={selectedColor} onClose={() => setSelectedColor(null)} />
    </Box>
  );
}

export default ColorsSection;
