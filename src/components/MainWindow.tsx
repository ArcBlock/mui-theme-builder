import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from 'src/state/types';

import PreviewWrapper from './PreviewWindow/PreviewWrapper';
import { getSampleComponent } from './Samples';

function MainWindow() {
  const selectedComponentId = useSelector((state: RootState) => state.selectedComponentId);
  const previewComponent = getSampleComponent(selectedComponentId);

  return (
    <Box sx={{ overflowY: 'auto', height: 1, padding: 2, position: 'relative' }}>
      <Box sx={{ bgcolor: 'background.default' }}>
        <PreviewWrapper>{previewComponent || null}</PreviewWrapper>
      </Box>
    </Box>
  );
}

export default MainWindow;
