import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Collapse, IconButton } from '@mui/material';
import * as monaco from 'monaco-editor';
import { useEffect, useRef, useState } from 'react';
import { verbose } from 'src/utils';

import EditorControls from './EditorControls';
import EditorErrors from './EditorErrors';
import './editor.css';
import useEditor from './hooks/useEditor';
import useEditorStateSync from './hooks/useEditorStateSync';
import useReadOnlyLines from './hooks/useReadOnlyLines';
import useSave from './hooks/useSave';
import useUndoRedo from './hooks/useUndoRedo';

export const codeEditorId = 'code-editor';

function MonacoThemeCodeEditor() {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // set up editor and configure options
  useEditor(editorRef);
  useEditorStateSync(editorRef);
  useReadOnlyLines(editorRef);

  // set Save and Undo/Redo listeners, and get handlers
  const handleSave = useSave(editorRef);
  const { handleRedo, handleUndo } = useUndoRedo(editorRef);

  useEffect(() => {
    return () => {
      verbose('MonacoThemeCodeEditor unmounted');
    };
  }, []);

  return (
    <Box
      id="code-editor"
      sx={{
        height: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}>
      <EditorControls onUndo={handleUndo} onRedo={handleRedo} onSave={handleSave} />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          cursor: 'pointer',
        }}
        onClick={() => setIsExpanded(!isExpanded)}>
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <IconButton size="small">{isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
          <Box sx={{ ml: 1, fontWeight: 'medium' }}>Theme Code</Box>
        </Box>
      </Box>
      <Collapse in={isExpanded} sx={{ width: 1 }}>
        <Box
          id="container"
          sx={{
            height: 'calc(100% - 48px)',
            minHeight: '30vh',
            width: 1,
          }}
        />
      </Collapse>
      <EditorErrors editorRef={editorRef} />
    </Box>
  );
}

export default MonacoThemeCodeEditor;
