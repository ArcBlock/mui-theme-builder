import { deepmerge } from '@arcblock/ux/lib/Theme';
import { PaletteColor, Theme } from '@mui/material/styles';
import { nanoid } from 'nanoid';
import { predefinedPalettes } from 'src/constants/predefinedPalettes';
import { getDefaultThemeConfig } from 'src/siteTheme';
import type { Concept, EditorState, Mode, PreviewSize, ThemePrefer, ThemeStoreState } from 'src/types/theme';
import { loadFonts, removeByPath, setByPath } from 'src/utils';
import { createPreviewMuiTheme } from 'src/utils';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';

const initialEditorState: EditorState = {
  colors: {},
  typography: {},
  styles: {},
};

export const DEFAULT_CONCEPT_ID = 'EdNkoyjQDQFY7f1gzwdat';
export const DEFAULT_CONCEPT_NAME = 'Concept 1';
export const MODE_SPECIFIC_FIELDS = ['palette', 'components', 'shadows']; // 需要区分 light/dark 的主题配置

// 获取主题配置字段名称
const getThemeFieldName = (path: string, mode: Mode): keyof Concept['themeConfig'] => {
  const field = path.split('.')[0];
  return MODE_SPECIFIC_FIELDS.includes(field) ? mode : 'common';
};

const getDefaultState = () => ({
  concepts: [
    {
      id: DEFAULT_CONCEPT_ID,
      name: DEFAULT_CONCEPT_NAME,
      mode: 'light' as Mode,
      prefer: 'system' as ThemePrefer,
      themeConfig: getDefaultThemeConfig(),
    },
  ],
  currentConceptId: DEFAULT_CONCEPT_ID,
  fonts: ['Roboto'],
  loadedFonts: new Set(['Roboto']),
  previewSize: false as PreviewSize,
  selectedComponentId: 'Website',
  editor: initialEditorState,
});

export const useThemeStore = create(
  subscribeWithSelector<ThemeStoreState>((set, get) => ({
    // # 初始状态
    ...getDefaultState(),
    themeObject: createPreviewMuiTheme(deepmerge({ palette: { mode: 'light' } }, getDefaultThemeConfig().light), false),

    // # Concepts 管理
    addConcept: (name, sourceThemeConfig) => {
      const newConcept: Concept = {
        id: nanoid(),
        name,
        mode: 'light',
        prefer: 'system',
        themeConfig: sourceThemeConfig ? { ...sourceThemeConfig } : getDefaultThemeConfig(),
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
          mode: concept.mode,
          prefer: concept.prefer,
          themeConfig: JSON.parse(JSON.stringify(concept.themeConfig)),
        };
        set((state) => ({
          concepts: [...state.concepts, newConcept],
          currentConceptId: newConcept.id,
        }));
      }
    },
    setCurrentConcept: (id) => set({ currentConceptId: id }),
    getCurrentConcept: () => {
      let result = get().concepts.find((c) => c.id === get().currentConceptId);

      if (!result) {
        result = getDefaultState().concepts[0];
      }

      return result;
    },
    renameConcept: (id, name) => {
      set((state) => ({
        concepts: state.concepts.map((c) => (c.id === id ? { ...c, name } : c)),
      }));
    },

    // # ThemeOptions 编辑
    setThemeOption: (path, value) => {
      set((state) => {
        const current = state.concepts.find((c) => c.id === state.currentConceptId);
        if (!current || !path) return {};
        const { mode } = current;

        const fieldName = getThemeFieldName(path, mode);
        const updated = setByPath(current.themeConfig[fieldName], path, value);
        const newThemeOptions = { ...current.themeConfig, [fieldName]: updated };

        return {
          concepts: state.concepts.map((c) =>
            c.id === state.currentConceptId ? { ...c, themeConfig: newThemeOptions } : c,
          ),
        };
      });
    },
    setThemeOptions: (configs) => {
      set((state) => {
        const current = state.concepts.find((c) => c.id === state.currentConceptId);
        if (!current) return {};
        const { mode } = current;

        let newThemeOptions = { ...current.themeConfig };

        configs.forEach(({ path, value }) => {
          const fieldName = getThemeFieldName(path, mode);
          newThemeOptions = setByPath(newThemeOptions, `${fieldName}.${path}`, value);
        });

        return {
          concepts: state.concepts.map((c) =>
            c.id === state.currentConceptId ? { ...c, themeConfig: newThemeOptions } : c,
          ),
        };
      });
    },
    removeThemeOption: (path) => {
      set((state) => {
        const current = state.concepts.find((c) => c.id === state.currentConceptId);
        if (!current || !path) return {};
        const { mode } = current;

        const fieldName = getThemeFieldName(path, mode);
        const updated = removeByPath(current.themeConfig[fieldName], path);
        const newThemeOptions = { ...current.themeConfig, [fieldName]: updated };

        return {
          concepts: state.concepts.map((c) =>
            c.id === state.currentConceptId ? { ...c, themeConfig: newThemeOptions } : c,
          ),
        };
      });
    },
    removeThemeOptions: (configs) => {
      set((state) => {
        const current = state.concepts.find((c) => c.id === state.currentConceptId);
        if (!current) return {};
        const { mode } = current;

        let newThemeOptions = { ...current.themeConfig };
        configs.forEach(({ path }) => {
          const fieldName = getThemeFieldName(path, mode);
          newThemeOptions = removeByPath(newThemeOptions, `${fieldName}.${path}`);
        });

        return {
          concepts: state.concepts.map((c) =>
            c.id === state.currentConceptId ? { ...c, themeConfig: newThemeOptions } : c,
          ),
        };
      });
    },
    setThemePrefer: (prefer) => {
      set((state) => {
        const current = state.concepts.find((c) => c.id === state.currentConceptId);
        if (!current) return {};

        const newThemeOptions = { ...current.themeConfig, prefer };

        return {
          concepts: state.concepts.map((c) =>
            c.id === state.currentConceptId ? { ...c, themeConfig: newThemeOptions } : c,
          ),
        };
      });
    },
    setThemeMode: (mode) => {
      set((state) => {
        const current = state.concepts.find((c) => c.id === state.currentConceptId);
        if (!current) return {};
        return { concepts: state.concepts.map((c) => (c.id === state.currentConceptId ? { ...c, mode } : c)) };
      });
    },
    updateThemeConfig: (themeConfig) => {
      set((state) => ({
        concepts: state.concepts.map((c) =>
          c.id === state.currentConceptId ? { ...c, themeConfig: { ...themeConfig } } : c,
        ),
      }));
    },
    getCurrentThemeOptions: () => {
      const concept = get().getCurrentConcept();
      return concept.themeConfig[concept.mode];
    },

    // # 修改整体数据
    resetStore: () => set(() => getDefaultState()),
    resetSiteData: () =>
      set(() => ({
        // 可根据实际需求重置部分状态
      })),
    syncRemoteData: ({ concepts, currentConceptId }) =>
      set(() => {
        let updates: Partial<ThemeStoreState> = {};

        if (concepts && currentConceptId) {
          updates.concepts = concepts;
          updates.currentConceptId = currentConceptId;
        }

        return updates;
      }),

    // # Colors 编辑
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
    shuffleColors: () =>
      set((state) => {
        const lockedColors = state.editor.colors;
        const { mode, concepts, currentConceptId, themeObject } = state;
        const currentConcept = concepts.find((c) => c.id === currentConceptId);

        if (!currentConcept) return {};

        const randomIndex = Math.floor(Math.random() * predefinedPalettes.length);
        const selectedPalette = predefinedPalettes[randomIndex][mode];

        const updates: { path: string; value: any }[] = [];

        Object.keys(selectedPalette).forEach((key) => {
          const colorKey = key as keyof typeof selectedPalette;
          if (!lockedColors[colorKey]?.isLocked) {
            const newMainColor = selectedPalette[colorKey];
            const augmentedColor = themeObject.palette.augmentColor({ color: { main: newMainColor } });

            Object.keys(augmentedColor).forEach((subKey) => {
              updates.push({
                path: `palette.${colorKey}.${subKey}`,
                value: augmentedColor[subKey as keyof PaletteColor],
              });
            });
          }
        });

        if (updates.length === 0) {
          return {};
        }

        const newThemeOptions = { ...currentConcept.themeConfig };
        updates.forEach(({ path, value }) => {
          setByPath(newThemeOptions[mode], path, value);
        });

        const newConcepts = concepts.map((c) =>
          c.id === currentConceptId ? { ...c, themeConfig: newThemeOptions } : c,
        );

        return { concepts: newConcepts };
      }),

    // # Fonts 编辑
    addFonts: async (fonts) => {
      const loaded = await loadFonts(fonts);
      if (loaded) {
        set((state) => ({
          loadedFonts: new Set([...state.loadedFonts, ...fonts]),
          fonts: Array.from(new Set([...state.fonts, ...fonts])),
        }));
      }
    },

    // # Preview 查看
    setPreviewSize: (size) => set({ previewSize: size }),
    setSelectedComponentId: (id) => set({ selectedComponentId: id }),
  })),
);

// 自动同步 themeObject
useThemeStore.subscribe(
  (state) => [state.concepts, state.currentConceptId, state.previewSize],
  () => {
    const state = useThemeStore.getState();
    const concept = state.getCurrentConcept();

    let themeObject: Theme;

    if (concept) {
      themeObject = createPreviewMuiTheme(
        deepmerge({ palette: { mode: concept.mode } }, concept.themeConfig[concept.mode]),
        state.previewSize,
      );
    } else {
      themeObject = createPreviewMuiTheme(
        deepmerge({ palette: { mode: 'light' } }, getDefaultThemeConfig().light),
        state.previewSize,
      );
    }

    useThemeStore.setState({ themeObject });
  },
  { equalityFn: shallow }, // shallow 支持数组比较
);
