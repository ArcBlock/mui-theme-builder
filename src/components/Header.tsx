import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, AppBarProps, Box, Button, IconButton, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import Samples from 'src/components/Samples';
import { useThemeStore } from 'src/state/themeStore';

import ConceptMenu from './Header/ConceptMenu';
import PreviewSizeControls from './PreviewWindow/PreviewSizeControls';

export interface HeaderProps extends AppBarProps {}

export default function Header({ sx, ...props }: HeaderProps) {
  const selectedComponentId = useThemeStore((s) => s.selectedComponentId);
  const setSelectedComponentId = useThemeStore((s) => s.setSelectedComponentId);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSampleSelect = (id: string) => {
    setSelectedComponentId(id);
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
        {/* 主题管理菜单 */}
        <Box sx={{ mr: 2 }}>
          <ConceptMenu />
        </Box>

        {/* 切换配置 Drawer */}
        {isMobile && (
          <IconButton
            size="small"
            color="inherit"
            aria-label="toggle theme config"
            onClick={() => {
              /* TODO: 实现移动端配置切换 */
            }}
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
