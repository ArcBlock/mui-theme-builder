import { Box, Switch, Typography } from '@mui/material';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/state/types';

import { ThemeValueChangeEvent } from '../events';

export default function ThemeTypeInput() {
  const mode = useSelector((state: RootState) => state.mode);
  const dispatch = useDispatch();

  const toggleThemeType = useCallback(() => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    dispatch({ type: 'SET_THEME_MODE', mode: newMode });
    document.dispatchEvent(ThemeValueChangeEvent());
  }, [dispatch, mode]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}>
      <Typography variant="body2" color={mode === 'dark' ? 'textSecondary' : 'textPrimary'}>
        Light
      </Typography>
      <Switch checked={mode === 'dark'} onClick={toggleThemeType} sx={{ color: '#fff' }} color="default" />
      <Typography variant="body2" color={mode === 'light' ? 'textSecondary' : 'textPrimary'}>
        Dark
      </Typography>
    </Box>
  );
}
