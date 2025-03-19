import codeEditorSteps from './codeEditorSteps';
import componentSamplesSteps from './componentSamplesSteps';
import previewWindowSteps from './previewWindowSteps';
import savedThemesSteps from './savedThemesSteps';
import toolPanelSteps from './toolPanelSteps';

export default [
  ...toolPanelSteps,
  ...codeEditorSteps,
  ...previewWindowSteps,
  ...componentSamplesSteps,
  ...savedThemesSteps,
];
