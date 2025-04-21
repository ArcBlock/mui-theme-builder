import { styled, useMediaQuery, useTheme } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import { useReactive } from 'ahooks';
import React, { Suspense, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MonacoThemeCodeEditor from 'src/components/MonacoThemeCodeEditor';
import { RootState } from 'src/state/types';

import CollapsePanel from './Display/CollapsePanel';
import EditorControls from './MonacoThemeCodeEditor/EditorControls';
import { MutableCodeEditor } from './MonacoThemeCodeEditor/types';
import ThemeTools from './ThemeTools/ThemeTools';

const drawerWidth: React.CSSProperties['width'] = 340;

function ThemeConfigDrawer() {
  const themeId = useSelector((state: RootState) => state.themeId);
  const open = useSelector((state: RootState) => state.themeConfigOpen);
  const dispatch = useDispatch();
  const expandMap = useReactive({
    themeCode: false,
    themeTools: true,
  });
  const [codeEditor, setCodeEditor] = useState<MutableCodeEditor>(null);

  const theme = useTheme();
  const permanent = useMediaQuery(theme.breakpoints.up('md')); // 常驻左侧

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
          backgroundColor: 'background.default',
        },
      }}
      open={open}
      onClose={() => dispatch({ type: 'TOGGLE_THEME_CONFIG' })}>
      <StyledGrid
        container
        direction="column"
        wrap="nowrap"
        sx={{ height: '100%', overflowX: 'hidden', overflowY: 'auto' }}>
        {/* 编辑按钮 */}
        <Grid item className="editor-controls">
          <EditorControls codeEditor={codeEditor} sx={{ height: '49px' }} />
        </Grid>
        {/* 主题工具 */}
        <Grid item>
          <CollapsePanel
            title="Theme Tools"
            expand={expandMap.themeTools}
            onToggle={(expand) => {
              expandMap.themeTools = expand;
            }}>
            <ThemeTools />
          </CollapsePanel>
        </Grid>
        {/* 主题代码 */}
        <Grid item>
          <CollapsePanel
            title="Theme Code"
            expand={expandMap.themeCode}
            onToggle={(expand) => {
              expandMap.themeCode = expand;
            }}>
            <Suspense fallback={<CircularProgress />}>
              <MonacoThemeCodeEditor key={themeId} onCreate={setCodeEditor} />
            </Suspense>
          </CollapsePanel>
        </Grid>
      </StyledGrid>
    </Drawer>
  );
}

export default ThemeConfigDrawer;

const StyledGrid = styled(Grid)(() => ({
  '.collapse-panel-header, .editor-controls': {
    position: 'sticky',
    top: 0,
    zIndex: 2,
    backgroundColor: 'transparent',
  },
  '.collapse-panel-header': {
    top: '49px',
  },
}));
