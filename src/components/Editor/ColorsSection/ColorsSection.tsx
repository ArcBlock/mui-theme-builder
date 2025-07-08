import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import BlockIcon from '@mui/icons-material/Block';
import Brightness2OutlinedIcon from '@mui/icons-material/Brightness2Outlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { Box, Grid, Stack, Typography, styled, useTheme } from '@mui/material';
import { useRef, useState } from 'react';
import useDomSize from 'src/hooks/useDomSize';
import useMobile from 'src/hooks/useMobile';
import { useThemeStore } from 'src/state/themeStore';

import { ButtonShuffle } from '../Common/ButtonShuffle';
import { ColorBlock } from './ColorBlock';
import { ColorEditDrawer, colorTypes } from './ColorEditDrawer';
import { ColorsSettingMenu } from './ColorsSettingMenu';
import { NeutralColorBlock, type NeutralColorType } from './NeutralColorBlock';

type ColorType = (typeof colorTypes)[number] | NeutralColorType;

const ToggleButton = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  borderRadius: theme.shape.borderRadius,
  padding: `${theme.spacing(0.5)} ${theme.spacing(1.4)}`,
  position: 'relative',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&.is-active': {
    backgroundColor: theme.palette.background.default,
  },
  '&.is-disabled': {
    cursor: 'not-allowed',
    opacity: 0.6,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
}));

function ColorsSection() {
  const { t } = useLocaleContext();
  const theme = useTheme();
  const concept = useThemeStore((s) => s.getCurrentConcept());
  const { mode, prefer } = concept;
  const isMobile = useMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth } = useDomSize(containerRef);
  const setThemeMode = useThemeStore((s) => s.setThemeMode);
  const shuffleColors = useThemeStore((s) => s.shuffleColors);
  const [selectedColor, setSelectedColor] = useState<ColorType | null>(null);

  // 布局模式判断
  const getLayoutMode = () => {
    if (isMobile || containerWidth < 600) return 'small';
    if (containerWidth < 720) return 'middle';
    return 'large';
  };

  const layoutMode = getLayoutMode();

  const handleColorClick = (colorType: ColorType) => {
    setSelectedColor(colorType);
  };

  const handleShuffle = () => {
    shuffleColors();
  };

  const handleModeChange = (newMode: 'light' | 'dark') => {
    // 检查是否被禁用
    if (prefer === 'light' && newMode === 'dark') {
      return; // dark 模式被禁用
    }
    if (prefer === 'dark' && newMode === 'light') {
      return; // light 模式被禁用
    }
    setThemeMode(newMode);
  };

  // 检查模式是否被禁用
  const isLightDisabled = prefer === 'dark';
  const isDarkDisabled = prefer === 'light';

  // 渲染颜色块网格
  const renderColorGrid = () => {
    switch (layoutMode) {
      case 'large':
        return (
          <Stack
            direction="row"
            sx={{
              alignItems: 'stretch',
            }}>
            <NeutralColorBlock sx={{ width: '25%', flexShrink: 0 }} onClick={(key) => handleColorClick(key)} />
            <Stack direction="row" sx={{ flexGrow: 1, flexWrap: 'wrap', mt: -1 }}>
              {colorTypes.map((colorType) => (
                <Box key={colorType} sx={{ width: '33.33%', pl: 1, pt: 1, flexShrink: 0 }}>
                  <ColorBlock colorType={colorType} onClick={() => handleColorClick(colorType)} />
                </Box>
              ))}
            </Stack>
          </Stack>
        );
      case 'middle':
        return (
          <Stack
            direction="row"
            sx={{
              alignItems: 'stretch',
            }}>
            <NeutralColorBlock sx={{ width: '33.33%', flexShrink: 0 }} onClick={(key) => handleColorClick(key)} />
            <Stack direction="row" sx={{ flexGrow: 1, flexWrap: 'wrap', mt: -1 }}>
              {colorTypes.map((colorType) => (
                <Box key={colorType} sx={{ width: '50%', pl: 1, pt: 1, flexShrink: 0 }}>
                  <ColorBlock colorType={colorType} onClick={() => handleColorClick(colorType)} />
                </Box>
              ))}
            </Stack>
          </Stack>
        );
      case 'small':
        return (
          <>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                mb: 1,
              }}>
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
                <Grid key={colorType} size={6}>
                  <ColorBlock colorType={colorType} onClick={() => handleColorClick(colorType)} />
                </Grid>
              ))}
            </Grid>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Box ref={containerRef}>
      <Stack
        direction="row"
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}>
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
            <ToggleButton
              title={t('editor.colorSection.lightMode')}
              className={`${mode === 'light' ? 'is-active' : ''} ${isLightDisabled ? 'is-disabled' : ''}`}
              onClick={() => handleModeChange('light')}>
              {isLightDisabled ? (
                <BlockIcon style={{ fontSize: 18, color: theme.palette.error.main }} />
              ) : (
                <LightModeOutlinedIcon style={{ fontSize: 18 }} />
              )}
            </ToggleButton>
            <ToggleButton
              title={t('editor.colorSection.darkMode')}
              className={`${mode === 'dark' ? 'is-active' : ''} ${isDarkDisabled ? 'is-disabled' : ''}`}
              onClick={() => handleModeChange('dark')}>
              {isDarkDisabled ? (
                <BlockIcon style={{ fontSize: 18, color: theme.palette.error.main }} />
              ) : (
                <Brightness2OutlinedIcon style={{ fontSize: 18 }} />
              )}
            </ToggleButton>
          </Box>
          {/* 其它设置 */}
          <ColorsSettingMenu />
          {/* Shuffle 按钮 */}
          <ButtonShuffle onClick={handleShuffle} />
        </Box>
      </Stack>
      {/* 颜色块网格 */}
      {renderColorGrid()}
      {/* 颜色编辑弹窗 */}
      <ColorEditDrawer open={!!selectedColor} colorType={selectedColor} onClose={() => setSelectedColor(null)} />
    </Box>
  );
}

export default ColorsSection;
