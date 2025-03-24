import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from 'src/state/types';

import PreviewSizeControls from './PreviewWindow/PreviewSizeControls';
import PreviewWrapper from './PreviewWindow/PreviewWrapper';

function MainWindow() {
  const previewComponent = useSelector((state: RootState) => state.previewComponent);

  return (
    <Box sx={{ overflowY: 'auto', height: 1, padding: 2, position: 'relative' }}>
      <Box sx={{ bgcolor: '#fff' }}>
        <PreviewWrapper>{previewComponent || null}</PreviewWrapper>
        <PreviewSizeControls />
      </Box>
    </Box>
  );
}

export default MainWindow;
