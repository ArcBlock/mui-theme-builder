import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Box, Button, Divider, Menu, MenuItem, Typography } from '@mui/material';
import { useMemoizedFn } from 'ahooks';
import { useState } from 'react';
import { useThemeBuilder } from 'src/context/themeBuilder';
import type { ThemePrefer } from 'src/types/theme';

export function ColorsSettingMenu() {
  const { t } = useLocaleContext();
  const prefer = useThemeBuilder((s) => s.getCurrentConcept().prefer);
  const setThemePrefer = useThemeBuilder((s) => s.setThemePrefer);
  const resetColors = useThemeBuilder((s) => s.resetColors);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = useMemoizedFn((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  });

  const handleClose = useMemoizedFn(() => {
    setAnchorEl(null);
  });

  const handleOptionSelect = useMemoizedFn((value: ThemePrefer) => {
    setThemePrefer(value);
    handleClose();
  });

  const handleResetColors = useMemoizedFn(() => {
    resetColors();
    handleClose();
  });

  return (
    <>
      <Button
        onClick={handleClick}
        variant="outlined"
        size="small"
        color="inherit"
        sx={{
          color: 'text.secondary',
          borderColor: 'divider',
          minWidth: 'auto',
          height: '30px',
          px: 1,
        }}>
        <SettingsOutlinedIcon style={{ fontSize: 18 }} />
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            sx: { minWidth: 120 },
          },
        }}>
        <MenuItem onClick={() => handleOptionSelect('system')} selected={prefer === 'system'}>
          <Typography variant="body2">{t('editor.colorSection.modeDisable.none')}</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleOptionSelect('light')} selected={prefer === 'light'}>
          <Typography variant="body2">{t('editor.colorSection.modeDisable.dark')}</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleOptionSelect('dark')} selected={prefer === 'dark'}>
          <Typography variant="body2">{t('editor.colorSection.modeDisable.light')}</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleResetColors}>
          <Typography variant="body2">{t('editor.colorSection.reset')}</Typography>
        </MenuItem>
      </Menu>
    </>
  );
}
