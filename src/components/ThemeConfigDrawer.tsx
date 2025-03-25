import { useMediaQuery, useTheme } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import { useReactive } from 'ahooks';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MonacoThemeCodeEditor from 'src/components/MonacoThemeCodeEditor';
import { RootState } from 'src/state/types';

import CollapsePanel from './Display/CollapsePanel';
import ThemeTools from './ThemeTools/ThemeTools';

const drawerWidth: React.CSSProperties['width'] = 400;

function ThemeConfigDrawer() {
  const themeId = useSelector((state: RootState) => state.themeId);
  const open = useSelector((state: RootState) => state.themeConfigOpen);
  const dispatch = useDispatch();
  const expandMap = useReactive({
    themeTools: true,
  });

  const theme = useTheme();
  const permanent = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Drawer
      variant={permanent ? 'permanent' : 'temporary'}
      anchor="left"
      sx={{
        width: drawerWidth,
        height: '100%',
        maxWidth: '90vw',
        overflow: 'hidden',
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          overflowY: 'visible',
          zIndex: theme.zIndex.drawer + 2,
          maxWidth: '90vw',
        },
      }}
      open={open}
      onClose={() => dispatch({ type: 'TOGGLE_THEME_CONFIG' })}>
      <Grid container direction="column" wrap="nowrap" sx={{ height: '100%', overflowX: 'hidden', overflowY: 'auto' }}>
        <Grid
          item
          sx={{
            flexShrink: 1,
          }}>
          {/* Use themeId as key so that editor is torn down and rebuilt with new theme */}
          <MonacoThemeCodeEditor key={themeId} />
        </Grid>
        <Grid
          item
          sx={{
            flexGrow: 1,
          }}>
          <CollapsePanel
            sx={{ height: '100%' }}
            title="Theme Tools"
            expand={expandMap.themeTools}
            onToggle={(expand) => {
              expandMap.themeTools = expand;
            }}>
            <ThemeTools />
          </CollapsePanel>
        </Grid>
      </Grid>
    </Drawer>
  );
}

export default ThemeConfigDrawer;
