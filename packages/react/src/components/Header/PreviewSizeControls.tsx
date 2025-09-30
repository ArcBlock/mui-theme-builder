import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import TabletMacIcon from '@mui/icons-material/TabletMac';
import { BottomNavigation, BottomNavigationAction, useMediaQuery, useTheme } from '@mui/material';
import { useMemoizedFn } from 'ahooks';
import { useEffect } from 'react';
import { useThemeBuilder } from 'src/context/themeBuilder';
import { PreviewSize } from 'src/types/theme';

export const previewSizeControlsId = 'preview-size-controls';

function PreviewSizeControls() {
  const previewSize = useThemeBuilder((s) => s.previewSize);
  const setPreviewSize = useThemeBuilder((s) => s.setPreviewSize);
  const handleOnChange = useMemoizedFn((_: unknown, value: PreviewSize) => setPreviewSize(value));

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
        backgroundColor: 'background.paper',
        boxShadow: 1,
      }}
      showLabels>
      <BottomNavigationAction sx={{ p: 1, minWidth: '32px' }} value="xs" icon={<SmartphoneIcon />} />
      <BottomNavigationAction sx={{ p: 1, minWidth: '32px' }} value="sm" icon={<TabletMacIcon />} />
      <BottomNavigationAction sx={{ p: 1, minWidth: '32px' }} value={false} icon={<LaptopMacIcon />} />
    </BottomNavigation>
  );
}

export default PreviewSizeControls;
