import FileCopyIcon from '@mui/icons-material/FileCopy';
import RedoIcon from '@mui/icons-material/Redo';
import SaveIcon from '@mui/icons-material/Save';
import UndoIcon from '@mui/icons-material/Undo';
import { Box, BoxProps, IconButton, Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useCanSave } from 'src/state/selectors';
import { RootState } from 'src/state/types';

import EditorButton from './EditorSettings';
import useSave from './hooks/useSave';
import useUndoRedo from './hooks/useUndoRedo';
import { MutableCodeEditor } from './types';

interface EditorControlsProps extends BoxProps {
  codeEditor: MutableCodeEditor;
}

export default function EditorControls({ codeEditor, sx, ...rest }: EditorControlsProps) {
  // TODO: undo/redo 目前不能很好的跟 Theme Tools 联动，暂时屏蔽
  const canUndo = useSelector((state: RootState) => state.editor.canUndo);
  const canRedo = useSelector((state: RootState) => state.editor.canRedo);
  const canSave = useCanSave();
  const [saveStatus, setSaveStatus] = useState<{ open: boolean; success: boolean }>({ open: false, success: false });

  // set Save and Undo/Redo listeners, and get handlers
  const handleSave = useSave(codeEditor);
  const { handleRedo, handleUndo } = useUndoRedo(codeEditor);

  const onSave = async () => {
    try {
      await handleSave();
      setSaveStatus({ open: true, success: true });
    } catch (error) {
      setSaveStatus({ open: true, success: false });
    }
  };

  return (
    <Box
      sx={{
        px: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #dedede',
        ...sx,
      }}
      {...rest}>
      <Box sx={{ display: 'flex' }}>
        <EditorButton />
        <CopyButton />
        <Tooltip title="Undo (Ctrl + Z)">
          <span>
            <IconButton disabled={!canUndo} onClick={handleUndo} size="small">
              <UndoIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Redo (Ctrl + Y)">
          <span>
            <IconButton disabled={!canRedo} onClick={handleRedo} size="small">
              <RedoIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Save Changes (Ctrl + S)">
          <span>
            <IconButton onClick={onSave} size="small">
              <SaveIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
      <Typography variant="body2" color={canSave ? 'textPrimary' : 'textSecondary'} display="inline">
        {canSave ? '* Unsaved Changes' : 'All changes saved'}
      </Typography>
      <Snackbar
        open={saveStatus.open}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={() => setSaveStatus((prev) => ({ ...prev, open: false }))}>
        <Alert variant="filled" severity={saveStatus.success ? 'success' : 'error'}>
          {saveStatus.success ? 'Save successful!' : 'Save failed, please try again'}
        </Alert>
      </Snackbar>
    </Box>
  );
}

function CopyButton() {
  const themeInput = useSelector((state: RootState) => state.editor.themeInput);
  const outputTypescript = useSelector((state: RootState) => state.editor.outputTypescript);
  const [open, setOpen] = useState(false);
  const copyToClipboard = () => {
    let codeToCopy = themeInput;
    if (!outputTypescript) {
      // naively strip out typescript (first three lines)
      codeToCopy = ['export const themeOptions = {', ...themeInput.split('\n').slice(3)].join('\n');
    }
    navigator.clipboard.writeText(codeToCopy).then(() => setOpen(true));
  };

  return (
    <>
      <Tooltip title="Copy theme code">
        <IconButton onClick={copyToClipboard} size="small">
          <FileCopyIcon />
        </IconButton>
      </Tooltip>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={() => setOpen(false)}>
        <Alert variant="filled" severity="success">
          Copied theme code to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
}
