import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

import ThemeWrapper from './ThemeWrapper';

function MainWindow() {
  return (
    <Box sx={{ overflowY: 'auto', height: 1, padding: 2 }}>
      <Box sx={{ bgcolor: '#fff' }}>
        <ThemeWrapper>
          <Outlet />
        </ThemeWrapper>
      </Box>
    </Box>
  );
}

export default MainWindow;
