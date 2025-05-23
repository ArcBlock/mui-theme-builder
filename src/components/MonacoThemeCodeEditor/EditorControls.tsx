import { Confirm } from '@arcblock/ux/lib/Dialog';
import Toast from '@arcblock/ux/lib/Toast';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ReplayIcon from '@mui/icons-material/Replay';
// import RedoIcon from '@mui/icons-material/Redo';
// import UndoIcon from '@mui/icons-material/Undo';
import SaveIcon from '@mui/icons-material/Save';
import { Box, BoxProps, IconButton } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetStore } from 'src/state/actions';
import { useCanSave } from 'src/state/selectors';
import { RootState } from 'src/state/types';

import EditorSettings from './EditorSettings';
import useSave from './hooks/useSave';
import useUndoRedo from './hooks/useUndoRedo';
import { MutableCodeEditor } from './types';

interface EditorControlsProps extends BoxProps {
  codeEditor: MutableCodeEditor;
}

export function CopyButton() {
  const themeInput = useSelector((state: RootState) => state.editor.themeInput);
  const outputTypescript = useSelector((state: RootState) => state.editor.outputTypescript);

  const copyToClipboard = () => {
    let codeToCopy = themeInput;
    if (!outputTypescript) {
      // naively strip out typescript (first three lines)
      codeToCopy = ['export const themeOptions = {', ...themeInput.split('\n').slice(3)].join('\n');
    }
    navigator.clipboard.writeText(codeToCopy).then(() => {
      Toast.success('Copied theme code to clipboard!');
    });
  };

  return (
    <Tooltip title="Copy theme code">
      <IconButton onClick={copyToClipboard} size="small">
        <FileCopyIcon sx={{ color: 'text.primary' }} />
      </IconButton>
    </Tooltip>
  );
}

export function ResetButton() {
  const dispatch = useDispatch();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleReset = () => {
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    dispatch(resetStore());
    Toast.success('Theme has been reset to default settings');
    setConfirmOpen(false);
  };

  return (
    <>
      <Tooltip title="Reset to Default Theme">
        <span>
          <IconButton onClick={handleReset} size="small">
            <ReplayIcon sx={{ color: 'text.primary' }} />
          </IconButton>
        </span>
      </Tooltip>
      <Confirm
        open={confirmOpen}
        title="Reset Theme"
        confirmButton={{ props: { variant: 'contained' }, text: 'Confirm' }}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}>
        Are you sure you want to reset the theme settings? This will discard all unsaved changes.
      </Confirm>
    </>
  );
}

export default function EditorControls({ codeEditor, sx, ...rest }: EditorControlsProps) {
  // TODO: undo/redo 目前不能很好的跟 Theme Tools 联动，暂时屏蔽
  // const canUndo = useSelector((state: RootState) => state.editor.canUndo);
  // const canRedo = useSelector((state: RootState) => state.editor.canRedo);
  const canSave = useCanSave();

  // set Save and Undo/Redo listeners, and get handlers
  const handleSave = useSave(codeEditor);
  useUndoRedo(codeEditor);
  // const { handleRedo, handleUndo } = useUndoRedo(codeEditor);

  const onSave = async () => {
    try {
      await handleSave();
      Toast.success('Theme saved successfully. Please refresh the page to apply changes.');
    } catch (error) {
      Toast.error('Save failed, please try again');
    }
  };

  return (
    <Box
      sx={{
        px: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.default',
        ...sx,
      }}
      {...rest}>
      <Box sx={{ display: 'flex' }}>
        <EditorSettings />
        <CopyButton />
        <ResetButton />
        {/* <Tooltip title="Undo (Ctrl + Z)">
          <span>
            <IconButton disabled={!canUndo} onClick={handleUndo} size="small">
              <UndoIcon sx={{ color: 'text.primary' }} />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Redo (Ctrl + Y)">
          <span>
            <IconButton disabled={!canRedo} onClick={handleRedo} size="small">
              <RedoIcon sx={{ color: 'text.primary' }} />
            </IconButton>
          </span>
        </Tooltip> */}
        <Tooltip title="Save Changes (Ctrl + S)">
          <span>
            <IconButton onClick={onSave} size="small">
              <SaveIcon sx={{ color: 'text.primary' }} />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
      <Typography variant="body2" color={canSave ? 'text.primary' : 'text.secondary'} display="inline">
        {canSave ? '* Unsaved Changes' : 'All changes saved'}
      </Typography>
    </Box>
  );
}
