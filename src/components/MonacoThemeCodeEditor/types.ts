import * as monaco from 'monaco-editor';

export type MutableEditorRefType = React.RefObject<monaco.editor.IStandaloneCodeEditor | null>;
export type EditorRefType = React.RefObject<monaco.editor.IStandaloneCodeEditor>;
export type MutableCodeEditor = monaco.editor.IStandaloneCodeEditor | null;
export type CodeEditor = monaco.editor.IStandaloneCodeEditor;
