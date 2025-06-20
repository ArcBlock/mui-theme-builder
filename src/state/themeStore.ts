import { nanoid } from 'nanoid';
import { defaultThemeOptions } from 'src/siteTheme';
import type { Concept, EditorState, ThemeStoreState } from 'src/types/theme';
import { getCurrentThemeOptions, loadFonts, removeByPath, setByPath } from 'src/utils';
import { createPreviewMuiTheme } from 'src/utils';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';

const initialEditorState: EditorState = {
  colors: {},
  typography: {},
  styles: {},
};

export const useThemeStore = create(
  subscribeWithSelector<ThemeStoreState>((set, get) => {
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
      editor: initialEditorState,
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
          editor: initialEditorState,
        })),
      resetSiteData: () =>
        set(() => ({
          // 可根据实际需求重置部分状态
        })),

      // Colors 编辑
      setColorLock: (colorKey: string, isLocked: boolean) =>
        set((state) => ({
          editor: {
            ...state.editor,
            colors: {
              ...state.editor.colors,
              [colorKey]: {
                ...state.editor.colors[colorKey],
                isLocked: isLocked,
              },
            },
          },
        })),

      // Fonts 编辑
      addFonts: async (fonts) => {
        const loaded = await loadFonts(fonts);
        if (loaded) {
          set((state) => ({
            loadedFonts: new Set([...state.loadedFonts, ...fonts]),
            fonts: Array.from(new Set([...state.fonts, ...fonts])),
          }));
        }
      },

      // Preview 查看
      setPreviewSize: (size) => set({ previewSize: size }),
      setSelectedComponentId: (id) => set({ selectedComponentId: id }),
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
