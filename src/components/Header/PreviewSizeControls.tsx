import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import TabletMacIcon from '@mui/icons-material/TabletMac';
import { BottomNavigation, BottomNavigationAction, useMediaQuery, useTheme } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { useThemeStore } from 'src/state/themeStore';
import type { PreviewSize } from 'src/state/types';

export const previewSizeControlsId = 'preview-size-controls';

function PreviewSizeControls() {
  const previewSize = useThemeStore((s) => s.previewSize);
  const setPreviewSize = useThemeStore((s) => s.setPreviewSize);
  const handleOnChange = useCallback((_: unknown, value: PreviewSize) => setPreviewSize(value), [setPreviewSize]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  useEffect(() => {
    if (isMobile) {
      handleOnChange(null, 'xs');
    } else if (isTablet) {
      handleOnChange(null, 'sm');
    } else {
      handleOnChange(null, false);
    }
  }, [isMobile, isTablet, handleOnChange]);

  return isMobile || isTablet ? null : (
    <BottomNavigation
      id={previewSizeControlsId}
      value={previewSize}
      onChange={handleOnChange}
      sx={{
        height: 'auto',
        flexDirection: 'row',
        gap: 1,

        backgroundColor: 'background.default',
      }}
      showLabels>
      <BottomNavigationAction sx={{ p: 1, minWidth: '32px' }} value="xs" icon={<SmartphoneIcon />} />
      <BottomNavigationAction sx={{ p: 1, minWidth: '32px' }} value="sm" icon={<TabletMacIcon />} />
      <BottomNavigationAction sx={{ p: 1, minWidth: '32px' }} value={false} icon={<DesktopWindowsIcon />} />
    </BottomNavigation>
  );
}

export default PreviewSizeControls;
