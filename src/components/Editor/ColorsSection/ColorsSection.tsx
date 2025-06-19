import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { Box, Button, Grid, IconButton, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import { useThemeStore } from 'src/state/themeStore';

import ColorBlock from './ColorBlock';
import ColorEditDialog from './ColorEditDialog';

const colorTypes = ['neutral', 'primary', 'secondary', 'success', 'error', 'info', 'warning'] as const;
type ColorType = (typeof colorTypes)[number];

function ColorsSection() {
  const { t } = useLocaleContext();
  const mode = useThemeStore((s) => s.mode);
  const setThemeMode = useThemeStore((s) => s.setThemeMode);
  const [lockedColors, setLockedColors] = useState<Set<ColorType>>(new Set());
  const [selectedColor, setSelectedColor] = useState<ColorType | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleColorClick = (colorType: ColorType) => {
    setSelectedColor(colorType);
    setEditDialogOpen(true);
  };

  const handleLockToggle = (colorType: ColorType) => {
    const newLocked = new Set(lockedColors);
    if (newLocked.has(colorType)) {
      newLocked.delete(colorType);
    } else {
      newLocked.add(colorType);
    }
    setLockedColors(newLocked);
  };

  const handleShuffle = () => {
    // TODO: 实现 shuffle 逻辑，只改变未锁定的颜色
    // console.log('Shuffle colors, locked:', Array.from(lockedColors));
  };

  const handleModeChange = (newMode: 'light' | 'dark') => {
    setThemeMode(newMode);
  };

  return (
    <Box>
      {/* 模式切换 */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {t('editor.lightMode')} / {t('editor.darkMode')}
        </Typography>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(e, newMode) => newMode && handleModeChange(newMode)}
          size="small">
          <ToggleButton value="light">{t('editor.lightMode')}</ToggleButton>
          <ToggleButton value="dark">{t('editor.darkMode')}</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* 颜色块网格 */}
      <Grid container spacing={1} sx={{ mb: 2 }}>
        {colorTypes.map((colorType) => (
          <Grid item xs={6} sm={4} key={colorType}>
            <Box sx={{ position: 'relative' }}>
              <ColorBlock colorType={colorType} onClick={() => handleColorClick(colorType)} />
              <Tooltip title={lockedColors.has(colorType) ? t('editor.unlock') : t('editor.lock')}>
                <IconButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLockToggle(colorType);
                  }}>
                  {lockedColors.has(colorType) ? <LockIcon fontSize="small" /> : <LockOpenIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Shuffle 按钮 */}
      <Button variant="outlined" startIcon={<ShuffleIcon />} onClick={handleShuffle} fullWidth size="small">
        {t('editor.shuffle')}
      </Button>

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
