import axios from 'axios';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ThemeValueChangeEvent } from 'src/components/ThemeTools/events';
import { useUpdateEditorState } from 'src/state/editor/actions';
import { RootState } from 'src/state/types';
import { getAuthHeaders, stringify } from 'src/utils';

import { EditorRefType } from '../types';

export default function useEditorStateSync(editorRef: EditorRefType) {
  useSyncToStore(editorRef);
  useSyncFromStore(editorRef);
  useListenForThemeChangeEvent(editorRef);
  useSyncFromRemote(editorRef);
}

/**
 * ensure that when the code editor is updated,
 * the redux store themeInput is also updated
 */
const useSyncToStore = (editorRef: EditorRefType) => {
  const updateEditorState = useUpdateEditorState();

  useEffect(() => {
    const modelContentChangeBinding = editorRef.current?.onDidChangeModelContent(() => {
      updateEditorState({ themeInput: editorRef.current?.getValue() });
    });

    return () => {
      modelContentChangeBinding?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

/**
 * ensure that when the redux store themeInput is updated,
 * the code editor is also updated
 */
const useSyncFromStore = (editorRef: EditorRefType) => {
  const themeInput = useSelector((state: RootState) => state.editor.themeInput);
  const updateEditorState = useUpdateEditorState();
  useEffect(() => {
    const model = editorRef.current?.getModel();

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
  }, [themeInput, editorRef, updateEditorState]);
};

const useListenForThemeChangeEvent = (editorRef: EditorRefType) => {
  const onChangeEvent = () => {
    const model = editorRef.current?.getModel();
    model?.pushStackElement();
  };
  useEffect(() => {
    document.addEventListener(ThemeValueChangeEvent().type, onChangeEvent);

    return () => {
      document.removeEventListener(ThemeValueChangeEvent().type, onChangeEvent);
    };
  });
};

const useSyncFromRemote = (editorRef: EditorRefType) => {
  const updateEditorState = useUpdateEditorState();

  useEffect(() => {
    if (!editorRef.current) return;

    const urlParams = new URLSearchParams(window.location.search);
    const blockletId = urlParams.get('id');

    axios
      .get(`${window.location.origin}/api/theme?id=${blockletId}`, {
        headers: getAuthHeaders(),
      })
      .then((res) => {
        updateEditorState({ themeInput: stringify(res.data) });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
