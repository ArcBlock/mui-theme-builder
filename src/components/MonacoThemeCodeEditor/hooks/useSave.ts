import axios from 'axios';
import * as monaco from 'monaco-editor';
import { useCallback, useEffect } from 'react';
// custom theme config
import { useDispatch, useSelector } from 'react-redux';
import { saveEditorToTheme, updateEditorState } from 'src/state/editor/actions';
import { parseEditorOutput } from 'src/state/editor/parser';
import { RootState } from 'src/state/types';
import { getAuthHeaders, verbose } from 'src/utils';

import { EditorRefType } from '../types';

/**
 * Transpile the editor and return any semantic or syntactic
 * errors as well as the emitted code
 * @param editorRef - ref of the monaco-editor
 * @returns [semanticDiagnostics: Diagnostic[], syntacticDiagnostics: Diagnostic[], emittedOutput: any]
 */
async function validateInput(editorRef: EditorRefType) {
  // get the JS output of the typescript inside the code editor
  const model = editorRef.current?.getModel();
  if (!model) return [null, null, null];
  const worker = await monaco.languages.typescript.getTypeScriptWorker();
  const proxy = await worker(model.uri);

  // get the current semantic errors, and the emitted output
  return Promise.all([
    proxy.getSemanticDiagnostics(model.uri.toString()),
    proxy.getSyntacticDiagnostics(model.uri.toString()),
    proxy.getEmitOutput(model.uri.toString()),
  ]);
}

/**
 * Run the formatDocument action on the monaco editor
 * @param editorRef - ref of the monaco-editor
 * @returns true if document was formatted, false otherwise
 */
async function formatInput(editorRef: EditorRefType) {
  try {
    await editorRef.current?.getAction('editor.action.formatDocument').run();
    return true;
  } catch (err) {
    verbose('MonacoThemeCodeEditor/hooks/useSave -> formatInput: Error formatting document', err);
  }
  return false;
}

/**
 * Create a handler for saving the code editor contents to the theme options,
 * create an event listener for the Ctrl + S key combo, and return the
 * handler for saving code editor contents
 * @param editorRef
 * @returns Function that handles saving code editor contents
 */
export default function useSave(editorRef: EditorRefType) {
  const formatOnSave = useSelector((state: RootState) => state.editor.formatOnSave);
  const dispatch = useDispatch();
  const handleSave = useCallback(async () => {
    // clear existing errors first
    dispatch(updateEditorState({ errors: [] }));

    // format document if required
    if (formatOnSave) await formatInput(editorRef);

    const [semanticDiagnostics, syntacticDiagnostics, emittedOutput] = await validateInput(editorRef);

    // if there are semantic errors, prevent saving, else save to redux store
    const errors = [...syntacticDiagnostics, ...semanticDiagnostics];
    if (errors.length > 0) {
      // handle errors
      dispatch(
        updateEditorState({
          errors,
        }),
      );
    } else {
      dispatch(saveEditorToTheme(emittedOutput.outputFiles[0].text));
      // update the saved version
      dispatch(
        updateEditorState({
          savedVersion: editorRef.current?.getModel()?.getAlternativeVersionId(),
        }),
      );
    }

    // save to Blocklet.settings.theme
    const urlParams = new URLSearchParams(window.location.search);
    const blockletId = urlParams.get('id');
    await axios.post(
      `${window.location.origin}/api/theme?id=${blockletId}`,
      {
        theme: parseEditorOutput(emittedOutput.outputFiles[0].text),
      },
      {
        headers: getAuthHeaders(),
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, formatOnSave]);

  useSaveKey(editorRef, handleSave);

  return handleSave;
}

/**
 * Add an event listener for the Ctrl + S key combo that saves the editor contents
 * to the saved theme options
 * @param editorRef
 * @param onSave
 */
export const useSaveKey = (editorRef: EditorRefType, onSave: Function) => {
  useEffect(() => {
    // save key action in the monaco editor
    const actionBinding = editorRef.current?.addAction({
      id: 'save-editor-contents',
      label: 'Save Editor Theme Contents',
      // eslint-disable-next-line no-bitwise
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S],
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1,
      run: () => onSave(),
    });

    // global save key listener
    const handleGlobalSave = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.code === 'KeyS') {
        event.preventDefault();
        onSave();
      }
    };
    window.addEventListener('keydown', handleGlobalSave);

    return () => {
      actionBinding?.dispose();
      window.removeEventListener('keydown', handleGlobalSave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSave]);
};
