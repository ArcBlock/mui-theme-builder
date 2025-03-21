import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import TabletIcon from '@mui/icons-material/TabletAndroid';
import { BottomNavigation, BottomNavigationAction, useMediaQuery, useTheme } from '@mui/material';
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
    <BottomNavigation
      id={previewSizeControlsId}
      value={previewSize}
      onChange={handleOnChange}
      sx={{
        height: 'auto',
        bgcolor: 'background.default',
        flexDirection: 'row',
      }}
      showLabels>
      <BottomNavigationAction label="Phone" value="xs" icon={<SmartphoneIcon />} />
      <BottomNavigationAction label="Tablet" value="sm" icon={<TabletIcon />} />
      <BottomNavigationAction label="Desktop" value={false} icon={<DesktopWindowsIcon />} />
    </BottomNavigation>
  );
}

export default PreviewSizeControls;
