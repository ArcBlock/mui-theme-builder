import { nanoid } from 'nanoid';
import { defaultThemeOptions } from 'src/siteTheme';
import type { EditorState, EditorStateOptions } from 'src/state/editor/types';
import type { Concept, Mode } from 'src/types/theme';
import { loadFonts, removeByPath, setByPath } from 'src/utils';
import { createPreviewMuiTheme } from 'src/utils';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';

import type { PreviewSize } from './types';

interface ThemeStoreState {
  concepts: Concept[];
  currentConceptId: string;
  mode: Mode;
  fonts: string[];
  loadedFonts: Set<string>;
  previewSize: PreviewSize;
  themeConfigOpen: boolean;
  selectedComponentId: string;
  editor: EditorState;
  themeObject: ReturnType<typeof createPreviewMuiTheme>;

  // Concepts 管理
  addConcept: (name: string, baseThemeOptions?: Concept['themeOptions']) => void;
  deleteConcept: (id: string) => void;
  duplicateConcept: (id: string, name?: string) => void;
  setCurrentConcept: (id: string) => void;
  renameConcept: (id: string, name: string) => void;

  // ThemeOptions 编辑
  setThemeOption: (path: string, value: any) => void;
  setThemeOptions: (configs: { path: string; value: any }[]) => void;
  removeThemeOption: (path: string) => void;
  removeThemeOptions: (configs: { path: string }[]) => void;
  setThemePrefer: (prefer: string) => void;
  setThemeMode: (mode: Mode) => void;
  updateThemeOptions: (themeOptions: Concept['themeOptions']) => void;

  // 字体
  addFonts: (fonts: string[]) => Promise<void>;

  // 预览
  setPreviewSize: (size: PreviewSize) => void;
  setSelectedComponentId: (id: string) => void;

  // 编辑器
  updateEditorState: (editorState: EditorStateOptions) => void;
  saveEditorToTheme: (code: string) => void;

  // 其它
  resetStore: () => void;
  resetSiteData: () => void;
}

// 获取当前主题配置的辅助函数
function getCurrentThemeOptions(state: ThemeStoreState) {
  const current = state.concepts.find((c) => c.id === state.currentConceptId);
  if (!current) return defaultThemeOptions[state.mode];
  return current.themeOptions[state.mode];
}

export const useThemeStore = create<ThemeStoreState>()(
  subscribeWithSelector((set, get) => {
    const cid = nanoid();

    return {
      // 初始状态
      concepts: [
        {
          id: cid,
          name: 'Concept 1',
          themeOptions: { ...defaultThemeOptions },
        },
      ],
      currentConceptId: cid,
      mode: 'light',
      fonts: ['Roboto'],
      loadedFonts: new Set(['Roboto']),
      previewSize: false,
      themeConfigOpen: false,
      selectedComponentId: 'Website',
      editor: {
        themeInput: '',
        initialVersion: 0,
        lastVersion: 0,
        currentVersion: 0,
        savedVersion: 0,
        canRedo: false,
        canUndo: false,
        errors: [],
        formatOnSave: true,
        outputTypescript: true,
      },
      themeObject: createPreviewMuiTheme(defaultThemeOptions.light, false),

      // Concepts 管理
      addConcept: (name, baseThemeOptions) => {
        const newConcept: Concept = {
          id: nanoid(),
          name,
          themeOptions: baseThemeOptions ? { ...baseThemeOptions } : { ...defaultThemeOptions },
        };
        set((state) => ({
          concepts: [...state.concepts, newConcept],
          currentConceptId: newConcept.id,
        }));
      },
      deleteConcept: (id) => {
        set((state) => {
          const newConcepts = state.concepts.filter((c) => c.id !== id);
          let newCurrentId = state.currentConceptId;
          if (state.currentConceptId === id && newConcepts.length > 0) {
            newCurrentId = newConcepts[0].id;
          }
          return {
            concepts: newConcepts,
            currentConceptId: newCurrentId,
          };
        });
      },
      duplicateConcept: (id, name) => {
        const concept = get().concepts.find((c) => c.id === id);
        if (concept) {
          const newConcept: Concept = {
            id: nanoid(),
            name: name || `${concept.name} Copy`,
            themeOptions: JSON.parse(JSON.stringify(concept.themeOptions)),
          };
          set((state) => ({
            concepts: [...state.concepts, newConcept],
            currentConceptId: newConcept.id,
          }));
        }
      },
      setCurrentConcept: (id) => set({ currentConceptId: id }),
      renameConcept: (id, name) => {
        set((state) => ({
          concepts: state.concepts.map((c) => (c.id === id ? { ...c, name } : c)),
        }));
      },

      // ThemeOptions 编辑
      setThemeOption: (path, value) => {
        set((state) => {
          const current = state.concepts.find((c) => c.id === state.currentConceptId);
          if (!current) return {};
          const { mode } = state;
          const updated = setByPath(current.themeOptions[mode], path, value);
          const newThemeOptions = { ...current.themeOptions, [mode]: updated };
          return {
            concepts: state.concepts.map((c) =>
              c.id === state.currentConceptId ? { ...c, themeOptions: newThemeOptions } : c,
            ),
          };
        });
      },
      setThemeOptions: (configs) => {
        set((state) => {
          const current = state.concepts.find((c) => c.id === state.currentConceptId);
          if (!current) return {};
          const { mode } = state;
          let updated = { ...current.themeOptions[mode] };
          configs.forEach(({ path, value }) => {
            updated = setByPath(updated, path, value);
          });
          const newThemeOptions = { ...current.themeOptions, [mode]: updated };
          return {
            concepts: state.concepts.map((c) =>
              c.id === state.currentConceptId ? { ...c, themeOptions: newThemeOptions } : c,
            ),
          };
        });
      },
      removeThemeOption: (path) => {
        set((state) => {
          const current = state.concepts.find((c) => c.id === state.currentConceptId);
          if (!current) return {};
          const { mode } = state;
          const updated = removeByPath(current.themeOptions[mode], path);
          const newThemeOptions = { ...current.themeOptions, [mode]: updated };
          return {
            concepts: state.concepts.map((c) =>
              c.id === state.currentConceptId ? { ...c, themeOptions: newThemeOptions } : c,
            ),
          };
        });
      },
      removeThemeOptions: (configs) => {
        set((state) => {
          const current = state.concepts.find((c) => c.id === state.currentConceptId);
          if (!current) return {};
          const { mode } = state;
          let updated = { ...current.themeOptions[mode] };
          configs.forEach(({ path }) => {
            updated = removeByPath(updated, path);
          });
          const newThemeOptions = { ...current.themeOptions, [mode]: updated };
          return {
            concepts: state.concepts.map((c) =>
              c.id === state.currentConceptId ? { ...c, themeOptions: newThemeOptions } : c,
            ),
          };
        });
      },
      setThemePrefer: (prefer) => {
        set((state) => {
          const current = state.concepts.find((c) => c.id === state.currentConceptId);
          if (!current) return {};
          const newThemeOptions = { ...current.themeOptions, prefer };
          return {
            concepts: state.concepts.map((c) =>
              c.id === state.currentConceptId ? { ...c, themeOptions: newThemeOptions } : c,
            ),
          };
        });
      },
      setThemeMode: (mode) => set({ mode }),
      updateThemeOptions: (themeOptions) => {
        set((state) => ({
          concepts: state.concepts.map((c) =>
            c.id === state.currentConceptId ? { ...c, themeOptions: { ...themeOptions } } : c,
          ),
        }));
      },

      // 字体
      addFonts: async (fonts) => {
        const loaded = await loadFonts(fonts);
        if (loaded) {
          set((state) => ({
            loadedFonts: new Set([...state.loadedFonts, ...fonts]),
            fonts: Array.from(new Set([...state.fonts, ...fonts])),
          }));
        }
      },

      // 预览
      setPreviewSize: (size) => set({ previewSize: size }),
      setSelectedComponentId: (id) => set({ selectedComponentId: id }),

      // 编辑器
      updateEditorState: (editorState) => {
        set((state) => ({
          editor: { ...state.editor, ...editorState },
        }));
      },
      saveEditorToTheme: () => {
        // 这里需要 parseEditorOutput，略
        // set({ ... })
      },

      // 其它
      resetStore: () =>
        set(() => ({
          concepts: [
            {
              id: nanoid(),
              name: 'Default',
              themeOptions: { ...defaultThemeOptions },
            },
          ],
          currentConceptId: '',
          mode: 'light',
          fonts: ['Roboto'],
          loadedFonts: new Set(['Roboto']),
          previewSize: false,
          themeConfigOpen: false,
          selectedComponentId: 'Website',
          editor: {
            themeInput: '',
            initialVersion: 0,
            lastVersion: 0,
            currentVersion: 0,
            savedVersion: 0,
            canRedo: false,
            canUndo: false,
            errors: [],
            formatOnSave: true,
            outputTypescript: true,
          },
        })),
      resetSiteData: () =>
        set(() => ({
          // 可根据实际需求重置部分状态
        })),
    };
  }),
);
// 监听关键状态变化，自动同步 themeObject
useThemeStore.subscribe(
  (state) => [state.concepts, state.currentConceptId, state.mode, state.previewSize],
  () => {
    const state = useThemeStore.getState();
    const currentThemeOptions = getCurrentThemeOptions(state);
    useThemeStore.setState({
      themeObject: createPreviewMuiTheme(currentThemeOptions, state.previewSize),
    });
  },
  { equalityFn: shallow }, // shallow 支持数组比较
);
