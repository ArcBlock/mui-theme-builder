import { Box } from '@mui/material';
import { useThemeStore } from 'src/state/themeStore';

import { getSampleComponent } from '../Samples';
import PreviewWrapper from './PreviewWrapper';

function PreviewWindow() {
  const selectedComponentId = useThemeStore((s) => s.selectedComponentId);
  const previewComponent = getSampleComponent(selectedComponentId);

  return (
    <Box className="preview-window" sx={{ padding: 2, position: 'relative' }}>
      <PreviewWrapper>{previewComponent || null}</PreviewWrapper>
    </Box>
  );
}

export default PreviewWindow;
