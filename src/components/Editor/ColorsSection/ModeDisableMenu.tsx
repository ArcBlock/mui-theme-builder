import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Box, Button, Menu, MenuItem, styled, Typography } from '@mui/material';
import { useState } from 'react';
import { useThemeStore } from 'src/state/themeStore';
import type { ThemePrefer } from 'src/types/theme';

function ModeDisableMenu() {
  const { t } = useLocaleContext();
  const prefer = useThemeStore((s) => s.getCurrentConcept().prefer);
  const setThemePrefer = useThemeStore((s) => s.setThemePrefer);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOptionSelect = (value: ThemePrefer) => {
    setThemePrefer(value);
    handleClose();
  };

  return (
    <Box>
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
        PaperProps={{
          sx: { minWidth: 120 },
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
      </Menu>
    </Box>
  );
}

export default ModeDisableMenu;
