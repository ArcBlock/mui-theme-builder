import Typography from '@mui/material/Typography';
import { componentNavDrawerId } from 'src/components/ComponentNavDrawer';
import { componentsTabId } from 'src/components/MainWindow';

import TutorialTooltip from '../TutorialTooltip';
import { useSwitchToTab } from './hooks';
import { increment } from './length';

function ComponentsTabTutorialStep() {
  useSwitchToTab('components');
  return (
    <>
      <TutorialTooltip anchorId={componentsTabId} placement="bottom">
        <Typography variant="h5">This is the Components Tab</Typography>
        <Typography>View your theme on the Material-UI components</Typography>
      </TutorialTooltip>
      <TutorialTooltip anchorId={componentNavDrawerId} placement="right">
        Click a component name to navigate to it
      </TutorialTooltip>
    </>
  );
}

const steps = [ComponentsTabTutorialStep];
increment(steps.length);

export default steps;
