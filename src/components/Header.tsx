import { AppBar, AppBarProps, Box, Toolbar } from '@mui/material';

import { ConceptMenu } from './Header/ConceptMenu';
import { HeaderActions } from './Header/HeaderActions';
import PreviewSizeControls from './Header/PreviewSizeControls';
import SampleNavigation from './Header/SampleNavigation';

export interface HeaderProps extends AppBarProps {}

export default function Header({ sx, ...props }: HeaderProps) {
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
        <ConceptMenu />
        {/* 菜单按钮 */}
        <HeaderActions />
        <Box sx={{ flexGrow: 1 }} />
        {/* Samples 导航 */}
        <SampleNavigation />
        {/* 预览窗口导航 */}
        <PreviewSizeControls />
      </Toolbar>
    </AppBar>
  );
}
