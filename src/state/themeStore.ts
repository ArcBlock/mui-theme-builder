import { nanoid } from 'nanoid';
import { defaultThemeOptions } from 'src/siteTheme';
import type { EditorState, EditorStateOptions } from 'src/state/editor/types';
import type { Concept, Mode, PreviewSize } from 'src/types/theme';
import { loadFonts, removeByPath, setByPath } from 'src/utils';
import { create } from 'zustand';

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

  // Concepts 管理
  addConcept: (name: string, baseThemeOptions?: Concept['themeOptions']) => void;
  deleteConcept: (id: string) => void;
  duplicateConcept: (id: string) => void;
  setCurrentConcept: (id: string) => void;
  renameConcept: (id: string, name: string) => void;

  // ThemeOptions 编辑
  setThemeOption: (path: string, value: any) => void;
  setThemeOptions: (configs: { path: string; value: any }[]) => void;
  removeThemeOption: (path: string) => void;
  removeThemeOptions: (configs: { path: string }[]) => void;
  setThemePrefer: (prefer: string) => void;
  setThemeMode: (mode: Mode) => void;

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

export const useThemeStore = create<ThemeStoreState>((set, get) => ({
  // 初始状态
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
  previewSize: 'pc',
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
  duplicateConcept: (id) => {
    const concept = get().concepts.find((c) => c.id === id);
    if (concept) {
      const newConcept: Concept = {
        id: nanoid(),
        name: `${concept.name} Copy`,
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
      return {
        concepts: state.concepts.map((c) =>
          c.id === state.currentConceptId ? { ...c, themeOptions: { ...c.themeOptions, [mode]: updated } } : c,
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
      return {
        concepts: state.concepts.map((c) =>
          c.id === state.currentConceptId ? { ...c, themeOptions: { ...c.themeOptions, [mode]: updated } } : c,
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
      return {
        concepts: state.concepts.map((c) =>
          c.id === state.currentConceptId ? { ...c, themeOptions: { ...c.themeOptions, [mode]: updated } } : c,
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
      return {
        concepts: state.concepts.map((c) =>
          c.id === state.currentConceptId ? { ...c, themeOptions: { ...c.themeOptions, [mode]: updated } } : c,
        ),
      };
    });
  },
  setThemePrefer: (prefer) => {
    set((state) => {
      const current = state.concepts.find((c) => c.id === state.currentConceptId);
      if (!current) return {};
      return {
        concepts: state.concepts.map((c) =>
          c.id === state.currentConceptId ? { ...c, themeOptions: { ...c.themeOptions, prefer } } : c,
        ),
      };
    });
  },
  setThemeMode: (mode) => set({ mode }),

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
      previewSize: 'pc',
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
}));
