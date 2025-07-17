import { deepmerge } from '@arcblock/ux/lib/Theme';
import { deepmergeAll } from '@arcblock/ux/lib/Util';
import { DEFAULT_FONTS } from '@blocklet/theme';
import { PaletteColor, Theme } from '@mui/material/styles';
import cloneDeep from 'lodash/cloneDeep';
import { nanoid } from 'nanoid';
import predefinedThemes from 'src/data/predefined-themes.json';
import type {
  Concept,
  EditorState,
  Mode,
  PreviewSize,
  ThemePrefer,
  ThemeStoreModel,
  ThemeStoreState,
} from 'src/types/theme';
import {
  createPreviewMuiTheme,
  ensureUniqueName,
  getDefaultThemeConfig,
  isSingle,
  loadFontsIfRequired,
  removeByPath,
  setByPath,
} from 'src/utils';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';

export const DEFAULT_CONCEPT_ID = 'EdNkoyjQDQFY7f1gzwdat';
export const DEFAULT_CONCEPT_NAME = 'Default';
export const MODE_SPECIFIC_FIELDS = ['palette', 'components', 'shadows']; // 需要区分 light/dark 的主题配置
export const HEADING_VARIANTS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'overline'] as const;
export const BODY_VARIANTS = ['body1', 'body2'] as const;

// 默认的 font-family 字符串
export const DEFAULT_FONT_STRING = DEFAULT_FONTS.map((s) => {
  // 检查是否包含空格或特殊字符（除了连字符和数字）
  const needsQuotes = /[^\w-]/.test(s);
  return needsQuotes ? `"${s}"` : s;
}).join(',');

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
  saving: false,
  // 历史记录相关
  history: [],
  currentHistoryIndex: -1,
  maxHistorySize: 50,
});

/** 创建 zustand store 实例 */
export default function createStore() {
  const store = create(
    subscribeWithSelector<ThemeStoreModel>((set, get) => ({
      // # 初始状态
      ...getDefaultState(),

      // # 整体设置
      resetStore: () => {
        const { saveToHistory } = get();

        set((state) => {
          const currentConcept = state.getCurrentConcept();
          if (!currentConcept) return {};

          return {
            concepts: state.concepts.map((c) =>
              c.id === state.currentConceptId
                ? {
                    ...c,
                    themeConfig: getDefaultThemeConfig(),
                    editor: getDefaultEditorState(),
                  }
                : c,
            ),
          };
        });

        // 保存到历史记录
        saveToHistory();
      },
      setSaving: (saving) => set({ saving }),
      getThemeData: () => {
        const { concepts, currentConceptId } = get();

        return {
          concepts: cloneDeep(concepts),
          currentConceptId,
        };
      },

      // # 历史记录管理
      saveToHistory: () => {
        const { concepts, currentConceptId } = get();

        // 深拷贝当前状态
        const stateToSave = {
          concepts: JSON.parse(JSON.stringify(concepts)),
          currentConceptId,
        };

        set((state) => {
          const { history, currentHistoryIndex, maxHistorySize } = state;

          // 如果当前不在历史记录的最后位置，则截断后面的记录
          const newHistory = history.slice(0, currentHistoryIndex + 1);

          // 添加新的历史记录
          newHistory.push(stateToSave);

          // 如果超过最大历史记录数，删除最老的记录
          if (newHistory.length > maxHistorySize) {
            newHistory.shift();
          }

          return {
            history: newHistory,
            currentHistoryIndex: newHistory.length - 1,
          };
        });
      },

      undo: () => {
        const { canUndo } = get();
        if (!canUndo()) return;

        set((state) => {
          const newIndex = state.currentHistoryIndex - 1;
          const stateToRestore = state.history[newIndex];

          if (stateToRestore) {
            return {
              concepts: stateToRestore.concepts,
              currentConceptId: stateToRestore.currentConceptId,
              currentHistoryIndex: newIndex,
            };
          }

          return {};
        });
      },

      redo: () => {
        const { canRedo } = get();
        if (!canRedo()) return;

        set((state) => {
          const newIndex = state.currentHistoryIndex + 1;
          const stateToRestore = state.history[newIndex];

          if (stateToRestore) {
            return {
              concepts: stateToRestore.concepts,
              currentConceptId: stateToRestore.currentConceptId,
              currentHistoryIndex: newIndex,
            };
          }

          return {};
        });
      },

      canUndo: () => {
        const state = get();
        return state.currentHistoryIndex > 0;
      },

      canRedo: () => {
        const state = get();
        return state.currentHistoryIndex < state.history.length - 1;
      },

      clearHistory: () => {
        set({
          history: [],
          currentHistoryIndex: -1,
        });
      },

      // # Concepts 管理
      addConcept: ({ name = DEFAULT_CONCEPT_NAME, themeConfig } = {}) => {
        const { concepts, applyTheme, saveToHistory } = get();

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
            newConcept = applyTheme(newConcept, selectedPalette);
          }
        }

        set((state) => ({
          concepts: [...state.concepts, newConcept],
          currentConceptId: newConcept.id,
        }));

        // 保存到历史记录
        saveToHistory();
      },
      deleteConcept: (id) => {
        const { saveToHistory } = get();

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

        // 保存到历史记录
        saveToHistory();
      },
      duplicateConcept: (id) => {
        const { concepts, saveToHistory } = get();
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

          // 保存到历史记录
          saveToHistory();
        }
      },
      renameConcept: (id, name) => {
        const { saveToHistory } = get();

        set((state) => ({
          concepts: state.concepts.map((c) => (c.id === id ? { ...c, name } : c)),
        }));

        // 保存到历史记录
        saveToHistory();
      },
      setCurrentConcept: (id) => {
        const { saveToHistory } = get();

        set({ currentConceptId: id });

        // 切换概念时保存到历史记录
        saveToHistory();
      },
      getCurrentConcept: () => {
        const { concepts, currentConceptId } = get();
        let result = concepts.find((c) => c.id === currentConceptId);

        if (!result) {
          [result] = getDefaultState().concepts;
        }

        return result;
      },
      setConcepts: ({ concepts, currentConceptId }) => {
        const { fetchFonts, clearHistory, saveToHistory } = get();

        set(() => {
          const updates: Partial<ThemeStoreState> = {};

          if (concepts && currentConceptId) {
            updates.concepts = concepts;
            updates.currentConceptId = currentConceptId;
            updates.loadedFonts = fetchFonts(concepts);
          }

          return updates;
        });

        // setConcepts 比较特殊，只在第一次同步远程数据时使用，并作为 history 的起点
        clearHistory();
        saveToHistory();
      },
      // 使用某个预定义主题
      applyTheme: (concept, theme, options = {}) => {
        const { concepts, applyColors, applyTypography, isPredefinedTheme } = get();
        const { colorKeys } = options;

        // 应用 colors
        let newConcept = applyColors(concept, theme, { colorKeys });
        // 应用 fonts
        newConcept = applyTypography(newConcept, theme);

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

        return newConcept;
      },
      // 批量使用颜色
      applyColors: (concept, theme, { colorKeys, skipCheckLock } = {}) => {
        const { themeObject } = get();
        const updates: { path: string; value: any }[] = [];
        const lockedColors = concept.editor.colors;

        let newConcept = { ...concept };

        // 修改 light 和 dark 的颜色
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
            if (skipCheckLock || !lockedColors[colorKey]?.isLocked) {
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

        updates.forEach(({ path, value }) => {
          newConcept = setByPath(newConcept, path, value);
        });

        return newConcept;
      },
      // 应批量使用字体
      applyTypography: (concept, theme, { textVariants, skipCheckLock } = {}) => {
        const { themeObject } = get();
        const updates: { path: string; value: any }[] = [];
        const lockedTypographys = concept.editor.typography;

        let newConcept = { ...concept };

        // 缩小范围
        let _textVariants = Object.keys(theme.fonts);
        if (textVariants) {
          _textVariants = Array.isArray(textVariants) ? textVariants : [textVariants];
        }

        let body: { fontFamily: string } | undefined;
        let heading: { fontFamily: string } | undefined;

        _textVariants.forEach((variant) => {
          if (skipCheckLock || !lockedTypographys[variant]?.isLocked) {
            if (variant === 'body') {
              body = theme.fonts[variant];
            } else if (variant === 'heading') {
              heading = theme.fonts[variant];
            }
          }
        });

        // 修改 body
        if (body) {
          // body 字体本质上是 base 字体
          updates.push({
            path: 'themeConfig.common.typography.fontFamily',
            value:
              body.fontFamily === DEFAULT_FONT_STRING
                ? DEFAULT_FONT_STRING
                : `"${body.fontFamily}", ${DEFAULT_FONT_STRING}`,
          });
        }
        // 修改 heading
        if (heading) {
          const headingFontFamily = heading.fontFamily;
          updates.push(
            ...HEADING_VARIANTS.map((v) => ({
              path: `themeConfig.common.typography.${v}.fontFamily`,
              value:
                headingFontFamily === DEFAULT_FONT_STRING
                  ? DEFAULT_FONT_STRING
                  : `"${headingFontFamily}", ${DEFAULT_FONT_STRING}`,
            })),
          );
        } else if (body) {
          // 单独修改 body，不能影响 Heading 字体
          const headingFontFamily = themeObject.typography.h1.fontFamily ?? DEFAULT_FONT_STRING;

          if (headingFontFamily !== body.fontFamily) {
            updates.push(
              ...HEADING_VARIANTS.map((v) => ({
                path: `themeConfig.common.typography.${v}.fontFamily`,
                value: headingFontFamily,
              })),
            );
          }
        }

        if (updates.length === 0) {
          return newConcept;
        }

        updates.forEach(({ path, value }) => {
          newConcept = setByPath(newConcept, path, value);
        });

        return newConcept;
      },
      isPredefinedTheme(concept) {
        return concept.name === concept.template || new RegExp(`^${concept.template}\\s\\d+$`).test(concept.name);
      },
      shuffleTheme: () => {
        const { concepts, applyTheme, getCurrentConcept, fetchFonts, saveToHistory } = get();
        const currentConcept = getCurrentConcept();
        if (!currentConcept) return;

        const selected = pickRandomTheme(currentConcept.template);
        if (!selected) return;

        const newConcept = applyTheme(currentConcept, selected);
        const loadedFonts = fetchFonts(newConcept);

        set(() => ({
          concepts: concepts.map((c) => (c.id === currentConcept.id ? newConcept : c)),
          loadedFonts,
        }));

        // 保存到历史记录
        saveToHistory();
      },

      // # ThemeOptions 编辑
      setThemeOption: (path, value) => {
        const { saveToHistory } = get();

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

        // 保存到历史记录
        saveToHistory();
      },
      setThemeOptions: (configs) => {
        const { saveToHistory } = get();

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

        // 保存到历史记录
        saveToHistory();
      },
      removeThemeOption: (path) => {
        const { saveToHistory } = get();

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

        // 保存到历史记录
        saveToHistory();
      },
      removeThemeOptions: (paths) => {
        const { saveToHistory } = get();

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

        // 保存到历史记录
        saveToHistory();
      },
      setThemePrefer: (prefer) => {
        const { saveToHistory } = get();

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
            concepts: state.concepts.map((c) =>
              c.id === state.currentConceptId ? { ...c, prefer, mode: newMode } : c,
            ),
          };
        });

        // 保存到历史记录
        saveToHistory();
      },
      setThemeMode: (mode) => {
        const { saveToHistory } = get();

        set((state) => {
          const current = state.concepts.find((c) => c.id === state.currentConceptId);
          if (!current) return {};
          return { concepts: state.concepts.map((c) => (c.id === state.currentConceptId ? { ...c, mode } : c)) };
        });

        // 保存到历史记录
        saveToHistory();
      },
      updateThemeConfig: (themeConfig) => {
        const { saveToHistory } = get();

        set((state) => ({
          concepts: state.concepts.map((c) =>
            c.id === state.currentConceptId ? { ...c, themeConfig: { ...themeConfig } } : c,
          ),
        }));

        // 保存到历史记录
        saveToHistory();
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
      shuffleColors: (colorKeys) => {
        const { saveToHistory } = get();

        set((state) => {
          const currentConcept = state.getCurrentConcept();
          if (!currentConcept) return {};

          const selected = pickRandomTheme(currentConcept.template);
          if (!selected) return {};

          const newConcept = state.applyColors(currentConcept, selected, {
            colorKeys,
            skipCheckLock: isSingle(colorKeys),
          });

          return {
            concepts: state.concepts.map((c) => (c.id === state.currentConceptId ? newConcept : c)),
          };
        });

        // 保存到历史记录
        saveToHistory();
      },
      // 重置所有颜色
      resetColors: () => {
        const { saveToHistory } = get();

        set((state) => {
          const concept = state.getCurrentConcept();
          if (!concept) return {};

          const newConcept = { ...concept };
          newConcept.themeConfig.light = {};
          newConcept.themeConfig.dark = {};
          newConcept.template = DEFAULT_CONCEPT_NAME;

          return { concepts: state.concepts.map((c) => (c.id === state.currentConceptId ? newConcept : c)) };
        });

        // 保存到历史记录
        saveToHistory();
      },

      // # Fonts 编辑
      fetchFonts: (concepts) => {
        const { loadedFonts } = get();
        const _concepts = Array.isArray(concepts) ? concepts : [concepts];

        if (_concepts.length === 0) return loadedFonts;

        const allFonts = _concepts
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

        return loadFontsIfRequired(allFonts, loadedFonts);
      },
      setFontLock: (variant, isLocked) =>
        set((state) => ({
          concepts: state.concepts.map((c) =>
            c.id === state.currentConceptId
              ? {
                  ...c,
                  editor: { ...c.editor, typography: { ...c.editor.typography, [variant]: { isLocked } } },
                }
              : c,
          ),
        })),
      setFontOptions: (fonts) => {
        const { applyTypography, getCurrentConcept, fetchFonts, saveToHistory } = get();

        const newConcept = applyTypography(
          getCurrentConcept(),
          { fonts },
          { skipCheckLock: isSingle(Object.keys(fonts)) },
        );
        const loadedFonts = fetchFonts(newConcept);

        set((state) => ({
          concepts: state.concepts.map((c) => (c.id === state.currentConceptId ? newConcept : c)),
          loadedFonts,
        }));

        // 保存到历史记录
        saveToHistory();
      },

      // # Preview 查看
      setPreviewSize: (size) => set({ previewSize: size }),
      setSelectedComponentId: (id) => set({ selectedComponentId: id }),
    })),
  );

  // 实时更新 themeObject
  store.subscribe(
    (state) => [state.concepts, state.currentConceptId, state.previewSize],
    () => {
      const state = store.getState();
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

      store.setState({ themeObject });
    },
    { equalityFn: shallow }, // shallow 支持数组比较
  );

  // 目前 history 采用的是每次保存修改后的 state。因此一开始压入一个初始 state，以支持 undo 操作
  store.getState().saveToHistory();

  return store;
}
