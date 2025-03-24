import { AppBar, Box, Button, Toolbar } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Samples from 'src/components/Samples';
import { RootState } from 'src/state/types';

function Header() {
  const dispatch = useDispatch();
  const selectedComponentId = useSelector((state: RootState) => state.selectedComponentId);

  const handleSampleSelect = (id: string, component: React.ReactNode) => {
    dispatch({
      type: 'SET_PREVIEW_COMPONENT',
      payload: {
        id,
        component,
      },
    });
  };

  return (
    <AppBar
      position="static"
      color="default"
      sx={{
        backgroundColor: '#fff',
        boxShadow: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}>
      <Toolbar
        sx={{
          display: 'flex',
          minHeight: {
            xs: '48px',
            sm: '48px',
          },
          overflowX: 'auto',
        }}>
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          {Samples.map(({ id, title, component }) => (
            <Button
              key={id}
              onClick={() => handleSampleSelect(id, component)}
              color={selectedComponentId === id ? 'primary' : 'inherit'}
              sx={{
                mx: 1,
                px: 2,
                py: 1,
                fontWeight: selectedComponentId === id ? 'medium' : 'normal',
                backgroundColor: selectedComponentId === id ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: selectedComponentId === id ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0, 0, 0, 0.04)',
                },
                transition: 'background-color 0.3s',
                textTransform: 'none', // 确保按钮内容不大写
              }}>
              {title}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
