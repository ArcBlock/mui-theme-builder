import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, AppBarProps, Box, Button, IconButton, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Samples from 'src/components/Samples';
import { RootState } from 'src/state/types';

import PreviewSizeControls from './PreviewWindow/PreviewSizeControls';

export interface HeaderProps extends AppBarProps {}

export default function Header({ sx, ...props }: HeaderProps) {
  const dispatch = useDispatch();
  const selectedComponentId = useSelector((state: RootState) => state.selectedComponentId);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSampleSelect = (id: string) => {
    dispatch({
      type: 'SET_PREVIEW_COMPONENT',
      payload: {
        id,
      },
    });
  };

  return (
    <AppBar
      position="static"
      color="default"
      sx={{
        backgroundColor: 'background.default',
        boxShadow: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.secondary',
        ...sx,
      }}
      {...props}>
      <Toolbar
        sx={{
          display: 'flex',
          minHeight: {
            xs: '48px',
            sm: '48px',
          },
          overflowX: 'auto',
        }}>
        {/* 切换配置 Drawer */}
        {isMobile && (
          <IconButton
            size="small"
            color="inherit"
            aria-label="toggle theme config"
            onClick={() => dispatch({ type: 'TOGGLE_THEME_CONFIG' })}
            sx={{ p: 0.5 }}>
            <MenuIcon sx={{ fontSize: '20px' }} />
          </IconButton>
        )}
        {/* Demo 导航 */}
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          {Samples.map(({ id, title }) => (
            <Button
              key={id}
              onClick={() => handleSampleSelect(id)}
              color={selectedComponentId === id ? 'primary' : 'inherit'}
              sx={{
                mx: 1,
                px: 1,
                py: 1,
                fontWeight: selectedComponentId === id ? 'medium' : 'normal',
                backgroundColor: selectedComponentId === id ? 'action.selected' : 'transparent',
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: selectedComponentId === id ? 'action.focus' : 'action.hover',
                },
                transition: 'background-color 0.3s',
                textTransform: 'none', // 确保按钮内容不大写
              }}>
              {title}
            </Button>
          ))}
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <PreviewSizeControls />
      </Toolbar>
    </AppBar>
  );
}
