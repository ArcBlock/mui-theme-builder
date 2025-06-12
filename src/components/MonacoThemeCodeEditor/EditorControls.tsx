import { Confirm } from '@arcblock/ux/lib/Dialog';
import Toast from '@arcblock/ux/lib/Toast';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
// import RedoIcon from '@mui/icons-material/Redo';
// import UndoIcon from '@mui/icons-material/Undo';
import SaveIcon from '@mui/icons-material/Save';
import { Box, BoxProps, IconButton } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { useLatest } from 'ahooks';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetStore } from 'src/state/actions';
// import { useCanSave } from 'src/state/selectors';
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

export function ResetButton({ codeEditor }: { codeEditor: MutableCodeEditor }) {
  const dispatch = useDispatch();
  const handleSave = useSave(codeEditor);
  const latestHandleSave = useLatest(handleSave);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleReset = () => {
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    dispatch(resetStore());
    setConfirmOpen(false);
    setLoading(true);

    // @FixMe resetStore 更新状态是异步的 + handleSave 会被闭包缓存。这里暂时使用 setTimeout 和 useLatest 解决问题 save 状态不一致问题。
    setTimeout(() => {
      latestHandleSave
        .current()
        .then(() => {
          Toast.success('Theme has been reset to default settings. Please refresh the page to apply changes.');
        })
        .catch((error) => {
          Toast.error(`Reset failed: ${error}`);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 100);
  };

  return (
    <>
      <Tooltip title="Reset to Default Theme">
        <span>
          <IconButton
            onClick={handleReset}
            disabled={loading}
            size="small"
            sx={{
              '&:hover': {
                backgroundColor: 'warning.lighter',
                '& .MuiSvgIcon-root': {
                  color: 'warning.main',
                },
              },
            }}>
            <RestartAltIcon sx={{ color: 'warning.light' }} />
          </IconButton>
        </span>
      </Tooltip>
      <Confirm
        open={confirmOpen}
        title="Reset Theme"
        confirmButton={{
          props: {
            variant: 'contained',
            color: 'warning',
          },
          text: 'Reset',
        }}
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
  // const canSave = useCanSave();

  // set Save and Undo/Redo listeners, and get handlers
  const handleSave = useSave(codeEditor);
  useUndoRedo(codeEditor);
  // const { handleRedo, handleUndo } = useUndoRedo(codeEditor);

  const onSave = async () => {
    try {
      await handleSave();
      Toast.success('Theme saved successfully. Please refresh the page to apply changes.');
    } catch (error) {
      Toast.error(`Save failed: ${error}`);
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
        <ResetButton codeEditor={codeEditor} />
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
      {/* <Typography variant="body2" color={canSave ? 'text.primary' : 'text.secondary'} display="inline">
        {canSave ? '* Unsaved Changes' : 'All changes saved'}
      </Typography> */}
    </Box>
  );
}
