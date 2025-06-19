import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import Brightness2OutlinedIcon from '@mui/icons-material/Brightness2Outlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { Box, Button, Grid, Stack, Typography, styled } from '@mui/material';
import { useState } from 'react';
import { useThemeStore } from 'src/state/themeStore';

import ColorBlock from './ColorBlock';
import ColorEditDialog from './ColorEditDialog';
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
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleColorClick = (colorType: ColorType) => {
    setSelectedColor(colorType);
    setEditDialogOpen(true);
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
        <Typography variant="h5">Colors</Typography>
        {/* 工具栏 */}
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
          {/* 模式切换 */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'grey.100',
              borderRadius: 1.5,
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
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<ShuffleIcon style={{ color: '#6248ff' }} />}
            size="small"
            sx={{ textTransform: 'none', borderColor: 'divider' }}
            onClick={handleShuffle}>
            {t('editor.shuffle')}
          </Button>
        </Box>
      </Stack>
      {/* 颜色块网格 */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Neutrals 色块 */}
        <Grid item xs={12}>
          <NeutralColorBlock onClick={() => handleColorClick('neutral')} />
        </Grid>

        {/* 其他颜色块 */}
        {colorTypes.map((colorType) => (
          <Grid item xs={12} sm={6} key={colorType}>
            <ColorBlock colorType={colorType} onClick={() => handleColorClick(colorType)} />
          </Grid>
        ))}
      </Grid>

      {/* 颜色编辑弹窗 */}
      {selectedColor && (
        <ColorEditDialog
          open={editDialogOpen}
          colorType={selectedColor}
          onClose={() => {
            setEditDialogOpen(false);
            setSelectedColor(null);
          }}
        />
      )}
    </Box>
  );
}

export default ColorsSection;
