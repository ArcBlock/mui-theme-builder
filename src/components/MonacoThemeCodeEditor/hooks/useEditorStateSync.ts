import axios from 'axios';
import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ThemeValueChangeEvent } from 'src/components/ThemeTools/events';
import { useUpdateEditorState } from 'src/state/editor/actions';
import { RootState } from 'src/state/types';
import { getAuthHeaders, stringify } from 'src/utils';

import { MutableCodeEditor } from '../types';

export default function useEditorStateSync(codeEditor: MutableCodeEditor) {
  useSyncToStore(codeEditor);
  useSyncFromStore(codeEditor);
  useListenForThemeChangeEvent(codeEditor);
  useSyncFromRemote(codeEditor);
}

/**
 * ensure that when the code editor is updated,
 * the redux store themeInput is also updated
 */
const useSyncToStore = (codeEditor: MutableCodeEditor) => {
  const updateEditorState = useUpdateEditorState();

  useEffect(() => {
    const modelContentChangeBinding = codeEditor?.onDidChangeModelContent(() => {
      updateEditorState({ themeInput: codeEditor?.getValue() });
    });

    return () => {
      modelContentChangeBinding?.dispose();
    };
  }, [codeEditor, updateEditorState]);
};

/**
 * ensure that when the redux store themeInput is updated,
 * the code editor is also updated
 */
const useSyncFromStore = (codeEditor: MutableCodeEditor) => {
  const themeInput = useSelector((state: RootState) => state.editor.themeInput);
  const updateEditorState = useUpdateEditorState();

  useEffect(() => {
    const model = codeEditor?.getModel();

    // only modify the editor if themeInput differs from editor,
    // so as to not pollute the undo/redo stack
    if (model?.getValue() !== themeInput) {
      // push the new theme input on to the edit operations stack
      // so that undo stack is preserved
      model?.pushEditOperations([], [{ range: model.getFullModelRange(), text: themeInput }], () => null);
      // create a new undo/redo "save" point
      // model?.pushStackElement()

      // update the last saved version after update is applied
      updateEditorState({ savedVersion: model?.getAlternativeVersionId() });
    }
  }, [themeInput, codeEditor, updateEditorState]);
};

const useListenForThemeChangeEvent = (codeEditor: MutableCodeEditor) => {
  const onChangeEvent = useCallback(() => {
    const model = codeEditor?.getModel();
    model?.pushStackElement();
  }, [codeEditor]);

  useEffect(() => {
    document.addEventListener(ThemeValueChangeEvent().type, onChangeEvent);

    return () => {
      document.removeEventListener(ThemeValueChangeEvent().type, onChangeEvent);
    };
  }, [onChangeEvent]);
};

const useSyncFromRemote = (codeEditor: MutableCodeEditor) => {
  const updateEditorState = useUpdateEditorState();

  useEffect(() => {
    if (!codeEditor) return;

    const urlParams = new URLSearchParams(window.location.search);
    const blockletId = urlParams.get('id');

    axios
      .get(`${window.location.origin}/api/theme?id=${blockletId}`, {
        headers: getAuthHeaders(),
      })
      .then((res) => {
        updateEditorState({ themeInput: stringify(res.data) });
      });
  }, [codeEditor, updateEditorState]);
};
