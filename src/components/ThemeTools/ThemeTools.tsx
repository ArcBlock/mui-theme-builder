import FontIcon from '@mui/icons-material/FontDownload';
import PaletteIcon from '@mui/icons-material/Palette';
import SnippetsIcon from '@mui/icons-material/PlaylistAdd';
import TypographyIcon from '@mui/icons-material/TextFields';
import { Box } from '@mui/material';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import React, { useState } from 'react';

import FontTools from './FontTools/FontTools';
import PaletteTools from './PaletteTools/PaletteTools';
import SnippetTools from './SnippetTools';
import ToolPanel from './ToolPanel';
import TypographyTools from './TypographyTools/TypographyTools';

export const paletteToolsId = 'palette-tools-nav';
export const fontToolsId = 'font-tools-nav';
export const typographyToolsId = 'typography-tools-nav';
export const snippetToolsId = 'snippet-tools-nav';

const toolPanels: Array<{
  label: string;
  icon: React.ReactNode;
  tools: any;
  id: string;
}> = [
  {
    label: 'Palette',
    icon: <PaletteIcon />,
    tools: PaletteTools,
    id: paletteToolsId,
  },
  {
    label: 'Typography',
    icon: <TypographyIcon />,
    tools: TypographyTools,
    id: typographyToolsId,
  },
  {
    label: 'Fonts',
    icon: <FontIcon />,
    tools: FontTools,
    id: fontToolsId,
  },
  {
    label: 'Snippets',
    icon: <SnippetsIcon />,
    tools: SnippetTools,
    id: snippetToolsId,
  },
];

export default function ThemeTools() {
  const [bottomNavIndex, setBottomNavIndex] = useState(0);

  const currentTool = toolPanels[bottomNavIndex];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 1,
        overflow: 'auto',
      }}>
      <BottomNavigation
        value={bottomNavIndex}
        showLabels
        sx={{
          bgcolor: 'background.default',
          borderBottom: 1,
          borderBottomColor: 'divider',
          height: 'auto',
          width: 'calc(100% - 1px)', // to prevent scroll bar
        }}
        onChange={(event, newValue) => setBottomNavIndex(newValue)}>
        {toolPanels.map((panel, index) => (
          <BottomNavigationAction
            // eslint-disable-next-line react/no-array-index-key
            key={`${index}-${panel.label}`}
            id={panel.id}
            label={panel.label}
            value={index}
            icon={panel.icon}
            sx={{
              height: '48px',
            }}
          />
        ))}
      </BottomNavigation>
      <ToolPanel sx={{ borderBottom: 1, borderBottomColor: 'divider' }}>
        <currentTool.tools />
      </ToolPanel>
    </Box>
  );
}
