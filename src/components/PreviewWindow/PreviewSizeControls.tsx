import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import TabletIcon from '@mui/icons-material/TabletAndroid';
import { BottomNavigation, BottomNavigationAction, Paper, useMediaQuery, useTheme } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPreviewSize } from 'src/state/actions';
import { PreviewSize, RootState } from 'src/state/types';

export const previewSizeControlsId = 'preview-size-controls';

function PreviewSizeControls() {
  const previewSize = useSelector((state: RootState) => state.previewSize);
  const dispatch = useDispatch();
  const handleOnChange = useCallback((_: unknown, value: PreviewSize) => dispatch(setPreviewSize(value)), [dispatch]);

  const theme = useTheme();
  const screenIsMdDown = useMediaQuery(theme.breakpoints.down('lg'));

  // spoof a 'xs' screen size on the preview theme
  // when the user's screen is md breakpoint and below
  useEffect(
    function previewSizeFromScreen() {
      if (screenIsMdDown) {
        handleOnChange(null, 'xs');
      }
    },
    [screenIsMdDown, handleOnChange],
  );

  return screenIsMdDown ? null : (
    <Paper
      elevation={8}
      square
      sx={{
        padding: 1,
        bgcolor: 'background.default',
        position: 'absolute',
        bottom: 0,
        left: 0,
        zIndex: 1,
      }}>
      <BottomNavigation
        id={previewSizeControlsId}
        value={previewSize}
        onChange={handleOnChange}
        sx={{
          height: 'auto',
          flexDirection: 'column',
          gap: 1,
        }}
        showLabels>
        <BottomNavigationAction
          sx={{ padding: 0, minWidth: '60px' }}
          label="Phone"
          value="xs"
          icon={<SmartphoneIcon />}
        />
        <BottomNavigationAction sx={{ padding: 0, minWidth: '60px' }} label="Tablet" value="sm" icon={<TabletIcon />} />
        <BottomNavigationAction
          sx={{ padding: 0, minWidth: '60px' }}
          label="Desktop"
          value={false}
          icon={<DesktopWindowsIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
}

export default PreviewSizeControls;
