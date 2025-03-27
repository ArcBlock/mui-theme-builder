import axios from 'axios';
import * as monaco from 'monaco-editor';
import { useCallback, useEffect } from 'react';
// custom theme config
import { useDispatch, useSelector } from 'react-redux';
import useSchemaKey from 'src/hooks/use-schema-key';
import { saveEditorToTheme, updateEditorState } from 'src/state/editor/actions';
import { parseEditorOutput } from 'src/state/editor/parser';
import { RootState } from 'src/state/types';
import { getAuthHeaders, isDev, verbose } from 'src/utils';

import { MutableCodeEditor } from '../types';

/**
 * Transpile the editor and return any semantic or syntactic
 * errors as well as the emitted code
 * @returns [semanticDiagnostics: Diagnostic[], syntacticDiagnostics: Diagnostic[], emittedOutput: any]
 */
async function validateInput(codeEditor: MutableCodeEditor) {
  // get the JS output of the typescript inside the code editor
  const model = codeEditor?.getModel();
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
 * @returns true if document was formatted, false otherwise
 */
async function formatInput(codeEditor: MutableCodeEditor) {
  try {
    await codeEditor?.getAction('editor.action.formatDocument').run();
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
 */
export default function useSave(codeEditor: MutableCodeEditor) {
  const dispatch = useDispatch();
  const schemaKey = useSchemaKey();
  const formatOnSave = useSelector((state: RootState) => state.editor.formatOnSave);
  const mode = useSelector((state: RootState) => state.mode);
  const themeOptions = useSelector((state: RootState) => state.themeOptions);

  const handleSave = useCallback(async () => {
    if (!codeEditor) return;

    // clear existing errors first
    dispatch(updateEditorState({ errors: [] }));

    // format document if required
    if (formatOnSave) await formatInput(codeEditor);

    const [semanticDiagnostics, syntacticDiagnostics, emittedOutput] = await validateInput(codeEditor);

    // if there are semantic errors, prevent saving, else save to redux store
    // @ts-expect-error
    const errors = [...syntacticDiagnostics, ...semanticDiagnostics];

    if (errors.length > 0) {
      // handle errors
      dispatch(
        updateEditorState({
          errors,
        }),
      );
    } else {
      const code = emittedOutput.outputFiles[0].text;

      // 更新 root state
      dispatch(saveEditorToTheme(code));
      dispatch(
        updateEditorState({
          savedVersion: codeEditor?.getModel()?.getAlternativeVersionId(),
        }),
      );

      // 保存到远端
      if (!isDev) {
        const parsedTheme = parseEditorOutput(code);
        const updatedThemeOptions = {
          ...themeOptions,
          [mode]: parsedTheme,
        };

        await axios.post(
          schemaKey,
          {
            theme: updatedThemeOptions,
          },
          {
            headers: getAuthHeaders(),
          },
        );
      }
    }
  }, [codeEditor, dispatch, formatOnSave, schemaKey, mode, themeOptions]);

  useSaveKey(codeEditor, handleSave);

  return handleSave;
}

/**
 * Add an event listener for the Ctrl + S key combo that saves the editor contents
 * to the saved theme options
 */
export const useSaveKey = (codeEditor: MutableCodeEditor, onSave: Function) => {
  useEffect(() => {
    // save key action in the monaco editor
    const actionBinding = codeEditor?.addAction({
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
  }, [codeEditor, onSave]);
};
