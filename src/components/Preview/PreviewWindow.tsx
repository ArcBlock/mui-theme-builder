import { Box } from '@mui/material';
import { useThemeStore } from 'src/state/themeStore';

import { getSampleComponent } from '../Samples';
import PreviewWrapper from './PreviewWrapper';

function PreviewWindow() {
  const selectedComponentId = useThemeStore((s) => s.selectedComponentId);
  const previewComponent = getSampleComponent(selectedComponentId);

  return (
    <Box sx={{ height: 1, padding: 2, position: 'relative' }}>
      <Box sx={{ bgcolor: 'background.default' }}>
        <PreviewWrapper>{previewComponent || null}</PreviewWrapper>
      </Box>
    </Box>
  );
}

export default PreviewWindow;
