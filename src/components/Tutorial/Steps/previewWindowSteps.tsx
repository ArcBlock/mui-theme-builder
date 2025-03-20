import Typography from '@mui/material/Typography';
import { previewTabId } from 'src/components/MainWindow';
import { previewSizeControlsId } from 'src/components/PreviewWindow/PreviewSizeControls';
import { previewNavTabsId } from 'src/components/PreviewWindow/PreviewWindow';

import TutorialTooltip from '../TutorialTooltip';
import { useSwitchToTab } from './hooks';
import { increment } from './length';

function PreviewTabTutorialStep() {
  useSwitchToTab('preview');
  return (
    <TutorialTooltip anchorId={previewTabId} placement="bottom">
      <Typography variant="h5">This is the Preview Tab</Typography>
    </TutorialTooltip>
  );
}

function SiteSamplesTutorialStep() {
  useSwitchToTab('preview');
  return (
    <>
      <TutorialTooltip anchorId={previewNavTabsId} placement="bottom">
        Use these tabs to view your theme on a variety of site templates
      </TutorialTooltip>
      <TutorialTooltip anchorId={previewSizeControlsId} placement="right">
        View your theme on multiple screen sizes
      </TutorialTooltip>
    </>
  );
}

const steps = [PreviewTabTutorialStep, SiteSamplesTutorialStep];
increment(steps.length);

export default steps;
