import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { verbose } from 'src/utils';

import EditorErrors from './EditorErrors';
import './editor.css';
import useEditor from './hooks/useEditor';
import useEditorStateSync from './hooks/useEditorStateSync';
import useReadOnlyLines from './hooks/useReadOnlyLines';
import { CodeEditor, MutableCodeEditor } from './types';

export const codeEditorId = 'code-editor';

export interface MonacoThemeCodeEditorProps {
  onCreate?: (editor: CodeEditor) => void;
}

export default function MonacoThemeCodeEditor({ onCreate }: MonacoThemeCodeEditorProps) {
  const [codeEditor, setCodeEditor] = useState<MutableCodeEditor>(null);

  // set up editor and configure options
  useEditor((editor) => {
    setCodeEditor(editor);
    onCreate?.(editor);
  });
  useEditorStateSync(codeEditor);
  useReadOnlyLines(codeEditor);

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
      <Box
        id="container"
        sx={{
          height: '50vh',
          width: 1,
        }}
      />
      <EditorErrors codeEditor={codeEditor} />
    </Box>
  );
}
