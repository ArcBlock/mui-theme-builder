import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import Brightness2OutlinedIcon from '@mui/icons-material/Brightness2Outlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { Box, Button, Grid, Stack, Typography, styled } from '@mui/material';
import { useState } from 'react';
import { useThemeStore } from 'src/state/themeStore';

import ButtonShuffle from '../Common/ButtonShuffle';
import ColorBlock from './ColorBlock';
import ColorEditDrawer from './ColorEditDrawer';
import NeutralColorBlock from './NeutralColorBlock';

const colorTypes = ['primary', 'secondary', 'success', 'error', 'info', 'warning'] as const;
type ColorType = (typeof colorTypes)[number] | 'neutral';

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
  const mode = useThemeStore((s) => s.mode);
  const setThemeMode = useThemeStore((s) => s.setThemeMode);
  const [selectedColor, setSelectedColor] = useState<ColorType | null>(null);

  const handleColorClick = (colorType: ColorType) => {
    setSelectedColor(colorType);
  };

  const handleShuffle = () => {
    // TODO: 实现 shuffle 逻辑，只改变未锁定的颜色
  };

  const handleModeChange = (newMode: 'light' | 'dark') => {
    setThemeMode(newMode);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        {/* 标题 */}
        <Typography variant="h5">{t('editor.colors')}</Typography>
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
      <Stack direction="row" alignItems="stretch">
        {/* Neutrals 色块 */}
        <NeutralColorBlock sx={{ width: '25%', flexShrink: 0 }} onClick={() => handleColorClick('neutral')} />
        {/* 其他颜色块 */}
        <Stack direction="row" sx={{ flexGrow: 1, flexWrap: 'wrap', mt: -1 }}>
          {colorTypes.map((colorType) => (
            <Box key={colorType} sx={{ width: '33.33%', pl: 1, pt: 1, flexShrink: 0 }}>
              <ColorBlock colorType={colorType} onClick={() => handleColorClick(colorType)} />
            </Box>
          ))}
        </Stack>
      </Stack>

      {/* 颜色编辑弹窗 */}
      {selectedColor !== 'neutral' && (
        <ColorEditDrawer open={!!selectedColor} colorType={selectedColor} onClose={() => setSelectedColor(null)} />
      )}
    </Box>
  );
}

export default ColorsSection;
