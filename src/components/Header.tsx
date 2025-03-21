import { AppBar, AppBarProps, Box, Link, Toolbar, Typography } from '@mui/material';
import muiVersion from 'src/muiVersion';

import PreviewSizeControls from './PreviewWindow/PreviewSizeControls';

function Header(props: AppBarProps) {
  return (
    <AppBar position="static" color="default" style={{ backgroundColor: '#fff' }} {...props}>
      <Toolbar
        sx={{
          display: 'flex',
          minHeight: {
            xs: '48px',
            sm: '48px',
          },
        }}>
        <Typography sx={{ lineHeight: '1.25rem', mr: 2 }}>MUI Theme Builder</Typography>
        <PreviewSizeControls />
        <Box sx={{ flexGrow: 1 }} />
        <Link
          href="https://v5.mui.com/material-ui/customization/default-theme/"
          target="_blank"
          rel="noreferrer"
          underline="hover">
          {`@mui/material@${muiVersion}`}
        </Link>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
