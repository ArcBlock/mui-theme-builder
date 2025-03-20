import Typography from '@mui/material/Typography';
import { savedThemesTabId } from 'src/components/MainWindow';
import { addThemeButtonId } from 'src/components/SavedThemes/AddThemeButton';
import { defaultThemesId } from 'src/components/SavedThemes/DefaultThemes';
import { savedThemeListId } from 'src/components/SavedThemes/SavedThemeList';

import TutorialTooltip from '../TutorialTooltip';
import { useSwitchToTab } from './hooks';
import { increment } from './length';

function SavedThemesTabTutorialStep() {
  useSwitchToTab('saved');
  return (
    <TutorialTooltip anchorId={savedThemesTabId} placement="bottom">
      <Typography variant="h5">This is the Saved Themes Tab</Typography>
    </TutorialTooltip>
  );
}

function AddNewThemesTutorialStep() {
  // eslint-disable-next-line no-console
  console.log(defaultThemesId);

  return (
    <>
      <TutorialTooltip anchorId={savedThemeListId} placement="right">
        <Typography>Switch between your saved themes here.</Typography>
        <Typography>You can rename, or delete them here too</Typography>
      </TutorialTooltip>
      <TutorialTooltip anchorId={defaultThemesId} placement="bottom">
        Add sample themes here to check them out
      </TutorialTooltip>
      <TutorialTooltip anchorId={addThemeButtonId} placement="top">
        Add a new blank theme here
      </TutorialTooltip>
    </>
  );
}

const steps = [SavedThemesTabTutorialStep, AddNewThemesTutorialStep];
increment(steps.length);

export default steps;
