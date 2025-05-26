import { Box, Button, ButtonGroup } from '@mui/material';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/state/types';

import { ThemeValueChangeEvent } from '../events';

export default function ThemeTypeInput() {
  const mode = useSelector((state: RootState) => state.mode);
  const dispatch = useDispatch();

  const toggleThemeType = useCallback(
    (newMode: 'light' | 'dark') => {
      if (newMode === mode) return;
      dispatch({ type: 'SET_THEME_MODE', mode: newMode });
      document.dispatchEvent(ThemeValueChangeEvent());
    },
    [dispatch, mode],
  );

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}>
      <ButtonGroup
        size="small"
        sx={{
          '& .MuiButton-root': {
            minWidth: '60px',
            textTransform: 'none',
            borderColor: 'divider',
            '&.Mui-selected': {
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            },
          },
        }}>
        <Button
          variant={mode === 'light' ? 'contained' : 'outlined'}
          onClick={() => toggleThemeType('light')}
          sx={{
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          }}>
          Light
        </Button>
        <Button
          variant={mode === 'dark' ? 'contained' : 'outlined'}
          onClick={() => toggleThemeType('dark')}
          sx={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          }}>
          Dark
        </Button>
      </ButtonGroup>
    </Box>
  );
}
