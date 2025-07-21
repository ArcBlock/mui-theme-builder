import ResponsiveHeader from '@arcblock/ux/lib/Header/responsive-header';
import { Box } from '@mui/material';
import LogoNotext from 'src/images/store-logo-notext.svg?react';

import HeaderAddons from './HeaderAddons';

export default function Header() {
  return (
    <Box
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        '.MuiContainer-root': {
          maxWidth: 'unset',
        },
      }}>
      <ResponsiveHeader logo={<LogoNotext />} addons={<HeaderAddons />} />
    </Box>
  );
}
