import { Box, BoxProps } from '@mui/material';
import React from 'react';

export const toolPanelId = 'theme-tool-panel';

interface Props extends BoxProps {
  children: React.ReactNode;
}
function ToolPanel({ children, sx, ...props }: Props) {
  return (
    <Box
      id={toolPanelId}
      sx={{
        flexGrow: 1,
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        ...sx,
      }}
      {...props}>
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}>
        {children}
      </Box>
    </Box>
  );
}

export default ToolPanel;
