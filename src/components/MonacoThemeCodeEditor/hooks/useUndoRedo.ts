import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateVersionStates, useUpdateEditorState } from 'src/state/editor/actions';
import { verbose } from 'src/utils';

import { MutableCodeEditor } from '../types';

export default function useUndoRedo(codeEditor: MutableCodeEditor) {
  const updateEditorState = useUpdateEditorState();

  // handle initial configuration of undo/redo state properties
  useEffect(() => {
    const initialVersionId = codeEditor?.getModel()?.getAlternativeVersionId();

    // set initial versions
    updateEditorState({
      initialVersion: initialVersionId,
      currentVersion: initialVersionId,
      lastVersion: initialVersionId,
      savedVersion: initialVersionId,
    });
  }, [codeEditor, updateEditorState]);

  useTrackUndoRedoState(codeEditor);

  return useUndoRedoHandlers(codeEditor);
}

const useTrackUndoRedoState = (codeEditor: MutableCodeEditor) => {
  const dispatch = useDispatch();

  const handleContentChange = useCallback(() => {
    const nextVersionId = codeEditor?.getModel()?.getAlternativeVersionId() || 0;

    dispatch(updateVersionStates(nextVersionId));
  }, [codeEditor, dispatch]);

  useEffect(() => {
    // set up event handler for editor changes
    const modelContentChangeBinding = codeEditor?.onDidChangeModelContent(handleContentChange);

    return () => {
      modelContentChangeBinding?.dispose();
    };
  }, [codeEditor, handleContentChange]);
};

const useUndoRedoHandlers = (codeEditor: MutableCodeEditor) => {
  const handleRedo = useCallback(() => {
    verbose('MonacoThemeCodeEditor/hooks/useUndoRedo -> handleRedo: global redo listener fired');
    codeEditor?.trigger('MonacoThemeCodeEditor', 'redo', null);
    codeEditor?.focus();
  }, [codeEditor]);

  const handleUndo = useCallback(() => {
    verbose('MonacoThemeCodeEditor/hooks/useUndoRedo -> handleUndo: global undo listener fired');
    codeEditor?.trigger('MonacoThemeCodeEditor', 'undo', null);
    codeEditor?.focus();
  }, [codeEditor]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        if (event.code === 'KeyZ') {
          handleUndo();
        }
        if (event.code === 'KeyY') {
          handleRedo();
        }
      }
    },
    [handleRedo, handleUndo],
  );

  // set up event listener to handle Ctrl+Z or Ctrl+Y keydowns
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // return the handlers to be used on undo/redo
  return { handleRedo, handleUndo };
};
