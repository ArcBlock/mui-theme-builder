import { AppBar, AppBarProps, Box, Toolbar } from '@mui/material';
import useMobile from 'src/hooks/useMobile';
import { ThemeData } from 'src/types/theme';

import { ConceptMenu } from './Header/ConceptMenu';
import { HeaderActions } from './Header/HeaderActions';

export interface HeaderProps extends AppBarProps {
  onSave?: (themeData: ThemeData) => Promise<void>;
}

export default function Header({ sx, onSave, ...props }: HeaderProps) {
  const isMobile = useMobile();

  return (
    <AppBar
      position="sticky"
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
          px: (theme) => `${theme.spacing(2)} !important`,
          minHeight: {
            xs: '48px',
            sm: '48px',
          },
          overflowX: 'auto',
        }}>
        {/* 主题管理菜单 */}
        <Box sx={{ marginLeft: -1 }}>
          <ConceptMenu />
        </Box>
        {isMobile && <Box sx={{ flexGrow: 1 }} />}
        {/* 菜单按钮 */}
        <HeaderActions onSave={onSave} />
      </Toolbar>
    </AppBar>
  );
}
