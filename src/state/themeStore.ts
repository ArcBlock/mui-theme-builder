import { deepmerge } from '@arcblock/ux/lib/Theme';
import { deepmergeAll } from '@arcblock/ux/lib/Util';
import { DEFAULT_FONTS } from '@blocklet/theme';
import { PaletteColor, Theme } from '@mui/material/styles';
import { nanoid } from 'nanoid';
import predefinedThemes from 'src/data/predefined-themes.json';
import { getDefaultThemeConfig } from 'src/siteTheme';
import type {
  Concept,
  EditorState,
  Mode,
  PreviewSize,
  ThemePrefer,
  ThemeStoreModel,
  ThemeStoreState,
} from 'src/types/theme';
import { ensureUniqueName, loadFontsIfRequired, removeByPath, setByPath } from 'src/utils';
import { createPreviewMuiTheme } from 'src/utils';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';

export const DEFAULT_CONCEPT_ID = 'EdNkoyjQDQFY7f1gzwdat';
export const DEFAULT_CONCEPT_NAME = 'Default';
export const MODE_SPECIFIC_FIELDS = ['palette', 'components', 'shadows']; // 需要区分 light/dark 的主题配置
export const HEADING_VARIANTS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'overline'] as const;

// 默认的 font-family 字符串
export const DEFAULT_FONT_STRING = DEFAULT_FONTS.map((s) => {
  // 检查是否包含空格或特殊字符（除了连字符和数字）
  const needsQuotes = /[^\w-]/.test(s);
  return needsQuotes ? `"${s}"` : s;
}).join(', ');

// 获取主题配置字段名称
const getThemeFieldName = (path: string, mode: Mode): keyof Concept['themeConfig'] => {
  const field = path.split('.')[0];
  return MODE_SPECIFIC_FIELDS.includes(field) ? mode : 'common';
};

// 获取默认的 editor 配置
const getDefaultEditorState = (): EditorState => ({
  colors: {},
  typography: {},
  styles: {},
});

// 随机挑选一个预定义主题
const pickRandomTheme = (...exclude: Array<string | undefined | null>) => {
  const _exclude = exclude.filter(Boolean) as string[];

  if (_exclude.length === 0) {
    return predefinedThemes[Math.floor(Math.random() * predefinedThemes.length)];
  }

  const excludeSet = new Set(_exclude);
  const candidates = predefinedThemes.filter((p) => !excludeSet.has(p.name));

  if (candidates.length === 0) {
    return null;
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
};

const getDefaultState = () => ({
  concepts: [
    {
      id: DEFAULT_CONCEPT_ID,
      name: DEFAULT_CONCEPT_NAME,
      template: DEFAULT_CONCEPT_NAME,
      mode: 'light' as Mode,
      prefer: 'system' as ThemePrefer,
      themeConfig: getDefaultThemeConfig(),
      editor: getDefaultEditorState(),
      fonts: [],
    },
  ],
  currentConceptId: DEFAULT_CONCEPT_ID,
  fonts: ['Roboto'],
  loadedFonts: new Set(['Roboto']),
  previewSize: false as PreviewSize,
  selectedComponentId: 'Website',
  themeObject: createPreviewMuiTheme(deepmerge({ palette: { mode: 'light' } }, getDefaultThemeConfig().light), false),
});

export const useThemeStore = create(
  subscribeWithSelector<ThemeStoreModel>((set, get) => ({
    // # 初始状态
    ...getDefaultState(),

    // # 修改整体数据
    resetStore: () => set(() => getDefaultState()),
    resetSiteData: () =>
      set(() => ({
        // 可根据实际需求重置部分状态
      })),
    addConcept: ({ name = DEFAULT_CONCEPT_NAME, themeConfig } = {}) => {
      const { concepts, applyPredefinedTheme } = get();

      const uniqueName = ensureUniqueName(
        concepts.map((c) => c.name),
        name,
      );
      let newConcept: Concept = {
        id: nanoid(),
        name: uniqueName,
        template: DEFAULT_CONCEPT_NAME,
        mode: 'light',
        prefer: 'system',
        themeConfig: themeConfig ? { ...themeConfig } : getDefaultThemeConfig(),
        editor: getDefaultEditorState(),
      };

      // 混入预制主题色盘
      if (!themeConfig) {
        const selectedPalette = pickRandomTheme(...concepts.map((c) => c.template));

        if (selectedPalette) {
          newConcept = applyPredefinedTheme(newConcept, selectedPalette);
        }
      }

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
      const { concepts } = get();
      const concept = concepts.find((c) => c.id === id);

      if (concept) {
        const uniqueName = ensureUniqueName(
          concepts.map((c) => c.name),
          concept.name,
        );

        const newConcept: Concept = {
          id: nanoid(),
          name: uniqueName,
          template: concept.template,
          mode: concept.mode,
          prefer: concept.prefer,
          themeConfig: JSON.parse(JSON.stringify(concept.themeConfig)),
          editor: JSON.parse(JSON.stringify(concept.editor)),
        };

        set((state) => ({
          concepts: [...state.concepts, newConcept],
          currentConceptId: newConcept.id,
        }));
      }
    },
    renameConcept: (id, name) => {
      set((state) => ({
        concepts: state.concepts.map((c) => (c.id === id ? { ...c, name } : c)),
      }));
    },
    setCurrentConcept: (id) => set({ currentConceptId: id }),
    getCurrentConcept: () => {
      const { concepts, currentConceptId } = get();
      let result = concepts.find((c) => c.id === currentConceptId);

      if (!result) {
        result = getDefaultState().concepts[0];
      }

      return result;
    },
    setConcepts: ({ concepts, currentConceptId }) =>
      set(() => {
        let updates: Partial<ThemeStoreState> = {};

        if (concepts && currentConceptId) {
          updates.concepts = concepts;
          updates.currentConceptId = currentConceptId;

          // 预加载字体
          const newFonts = concepts
            .reduce<string[]>((acc, c) => {
              const { typography } = c.themeConfig.common;

              if (typography && typeof typography === 'object') {
                if (typography.fontFamily) acc.push(typography.fontFamily);
                if (typography.h1?.fontFamily) acc.push(typography.h1.fontFamily);
              }

              return acc;
            }, [])
            .flatMap((x) => (x == null ? [] : x?.replace(/"/g, '').split(',')))
            // .filter((x): x is string => !!x) // remove nulls and undefined items
            // .map(x => ) // strip out quotes and split by comma
            // .flat() // flatten the array if any font families had multiple specified
            .map((x) => x.trim()); // trim off any white space

          const loadedFonts = loadFontsIfRequired(newFonts, new Set());

          updates.loadedFonts = loadedFonts;
        }

        return updates;
      }),
    // 应用预定义主题
    applyPredefinedTheme: (concept, theme, colorKeys) => {
      const { themeObject, concepts, isPredefinedTheme } = get();
      const updates: { path: string; value: any }[] = [];
      const lockedColors = concept.editor.colors;
      let newConcept = { ...concept };

      // 同时处理 light 和 dark 模式
      (['light', 'dark'] as const).forEach((mode) => {
        const modeTheme = theme[mode];

        // 缩小 colors 范围
        let _colorKeys = [];
        if (Array.isArray(colorKeys)) {
          _colorKeys = colorKeys;
        } else if (colorKeys && typeof colorKeys === 'string') {
          _colorKeys = [colorKeys];
        } else {
          _colorKeys = Object.keys(modeTheme);
        }

        _colorKeys.forEach((key) => {
          const colorKey = key as keyof typeof modeTheme;
          // 排除已锁定的 color
          if (!lockedColors[colorKey]?.isLocked) {
            const newMainColor = modeTheme[colorKey];
            // 计算 Shades 颜色
            const augmentedColor = themeObject.palette.augmentColor({ color: { main: newMainColor } });

            Object.keys(augmentedColor).forEach((subKey) => {
              updates.push({
                path: `themeConfig.${mode}.palette.${colorKey}.${String(subKey)}`,
                value: augmentedColor[subKey as keyof PaletteColor],
              });
            });
          }
        });
      });

      if (updates.length === 0) {
        return newConcept;
      }

      // 修改主题模版名称
      let conceptName = newConcept.name;
      if (isPredefinedTheme(newConcept)) {
        conceptName = ensureUniqueName(
          concepts.map((c) => c.name),
          theme.name,
        );
        newConcept.name = conceptName;
      }

      newConcept.template = theme.name;
      newConcept.name = conceptName;

      updates.forEach(({ path, value }) => {
        newConcept = setByPath(newConcept, path, value);
      });

      return newConcept;
    },
    isPredefinedTheme(concept) {
      return concept.name === concept.template || new RegExp(`^${concept.template}\\s\\d+$`).test(concept.name);
    },

    // # ThemeOptions 编辑
    setThemeOption: (path, value) => {
      set((state) => {
        const current = state.concepts.find((c) => c.id === state.currentConceptId);
        if (!current || !path) return {};
        const { mode } = current;

        const fieldName = getThemeFieldName(path, mode);
        const themeOptions = setByPath(current.themeConfig[fieldName], path, value);
        const newThemeConfig = { ...current.themeConfig, [fieldName]: themeOptions };

        return {
          concepts: state.concepts.map((c) =>
            c.id === state.currentConceptId ? { ...c, themeConfig: newThemeConfig } : c,
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
        const themeOptions = removeByPath(current.themeConfig[fieldName], path);
        const newThemeConfig = { ...current.themeConfig, [fieldName]: themeOptions };

        return {
          concepts: state.concepts.map((c) =>
            c.id === state.currentConceptId ? { ...c, themeConfig: newThemeConfig } : c,
          ),
        };
      });
    },
    removeThemeOptions: (paths) => {
      set((state) => {
        const current = state.concepts.find((c) => c.id === state.currentConceptId);
        if (!current) return {};
        const { mode } = current;

        let newThemeOptions = { ...current.themeConfig };
        paths.forEach((p) => {
          const fieldName = getThemeFieldName(p, mode);
          newThemeOptions = removeByPath(newThemeOptions, `${fieldName}.${p}`);
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

        let newMode = current.mode;

        // 自动切换逻辑：如果禁用的模式是当前模式，则切换到另一个模式
        if (prefer === 'light' && current.mode === 'dark') {
          // 禁用 dark 模式，但当前是 dark，切换到 light
          newMode = 'light';
        } else if (prefer === 'dark' && current.mode === 'light') {
          // 禁用 light 模式，但当前是 light，切换到 dark
          newMode = 'dark';
        }

        return {
          concepts: state.concepts.map((c) => (c.id === state.currentConceptId ? { ...c, prefer, mode: newMode } : c)),
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

    // # Colors 编辑
    setColorLock: (colorKey: string, isLocked: boolean) =>
      set((state) => ({
        concepts: state.concepts.map((c) =>
          c.id === state.currentConceptId
            ? {
                ...c,
                editor: { ...c.editor, colors: { ...c.editor.colors, [colorKey]: { isLocked } } },
              }
            : c,
        ),
      })),
    shuffleColors: (colorKeys) =>
      set((state) => {
        const currentConcept = state.getCurrentConcept();
        if (!currentConcept) return {};

        const selectedPalette = pickRandomTheme(currentConcept.template);
        if (!selectedPalette) return {};

        const newConcept = state.applyPredefinedTheme(currentConcept, selectedPalette, colorKeys);

        return {
          concepts: state.concepts.map((c) => (c.id === state.currentConceptId ? newConcept : c)),
        };
      }),
    // 重置所有颜色
    resetColors: () => {
      set((state) => {
        const concept = state.getCurrentConcept();
        if (!concept) return {};

        const newConcept = { ...concept };
        newConcept.themeConfig.light = {};
        newConcept.themeConfig.dark = {};
        if (state.isPredefinedTheme(concept)) {
          newConcept.name = ensureUniqueName(
            state.concepts.map((c) => c.name),
            DEFAULT_CONCEPT_NAME,
          );
        }
        newConcept.template = DEFAULT_CONCEPT_NAME;

        return { concepts: state.concepts.map((c) => (c.id === state.currentConceptId ? newConcept : c)) };
      });
    },

    // # Fonts 编辑
    setFontOptions: (fontMap) => {
      const { setThemeOptions, themeObject, loadedFonts } = get();
      const { heading, body } = fontMap;
      const newFonts = [];
      let updates: { path: string; value: any }[] = [];

      if (body) {
        // body 字体本质上是 base 字体
        updates.push({
          path: 'typography.fontFamily',
          value: `"${body.fontFamily}", ${DEFAULT_FONT_STRING}`,
        });
        newFonts.push(body.fontFamily);
      }

      if (heading) {
        updates.push(
          ...HEADING_VARIANTS.map((v) => ({
            path: `typography.${v}.fontFamily`,
            value: `"${heading.fontFamily}", ${DEFAULT_FONT_STRING}`,
          })),
        );
        newFonts.push(heading.fontFamily);
      } else if (body) {
        // 单独修改 body 时，不能影响 Heading 字体
        const headingFontFamily = themeObject.typography.h1.fontFamily ?? DEFAULT_FONT_STRING;

        if (headingFontFamily !== body.fontFamily) {
          updates.push(
            ...HEADING_VARIANTS.map((v) => ({
              path: `typography.${v}.fontFamily`,
              value: headingFontFamily,
            })),
          );
        }
      }

      // 本地加载新字体文件
      if (newFonts.length > 0) {
        const _loadedFonts = loadFontsIfRequired(newFonts, loadedFonts);
        set(() => ({
          loadedFonts: _loadedFonts,
        }));
      }

      setThemeOptions(updates);
    },

    // # Preview 查看
    setPreviewSize: (size) => set({ previewSize: size }),
    setSelectedComponentId: (id) => set({ selectedComponentId: id }),
  })),
);

// 实时更新 themeObject
useThemeStore.subscribe(
  (state) => [state.concepts, state.currentConceptId, state.previewSize],
  () => {
    const state = useThemeStore.getState();
    const concept = state.getCurrentConcept();

    let themeObject: Theme;

    if (concept) {
      themeObject = createPreviewMuiTheme(
        deepmergeAll([
          { palette: { mode: concept.mode } },
          concept.themeConfig.common,
          concept.themeConfig[concept.mode],
        ]),
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
