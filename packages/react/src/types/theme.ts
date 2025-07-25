import type { ThemeOptions } from '@mui/material/styles';
import { Theme } from '@mui/material/styles';

export type Mode = 'light' | 'dark';
export type ThemePrefer = 'light' | 'dark' | 'system';
export type TextVariant = 'heading' | 'body';
export type PreviewSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
export type MainColors = 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
export type ApplyThemeOptions = {
  colorKeys?: string | string[];
  textVariants?: TextVariant | TextVariant[];
  skipCheckLock?: boolean;
};

export interface Concept {
  id: string;
  name: string; // 主题名称
  template: string; // 预制模版名称
  mode: Mode;
  prefer: ThemePrefer;
  themeConfig: {
    light: ThemeOptions;
    dark: ThemeOptions;
    common: ThemeOptions;
  };
  editor: EditorState;
}

export interface ThemeData {
  concepts: Concept[];
  currentConceptId: string;
}

export interface PredefinedTheme {
  name: string;
  light: Record<MainColors, string>;
  dark: Record<MainColors, string>;
  fonts: Partial<Record<TextVariant, { fontFamily: string }>>;
}

export interface EditorState {
  colors: {
    [key: string]: {
      isLocked: boolean;
    };
  };
  typography: {
    [key: string]: {
      isLocked: boolean;
    };
  };
  styles: {
    [key: string]: {
      isLocked: boolean;
    };
  };
}

export interface ThemeStoreState {
  concepts: Concept[];
  currentConceptId: string;
  loadedFonts: Set<string>;
  previewSize: PreviewSize;
  selectedComponentId: string;
  themeObject: Theme;
  saving: boolean;
  themeMode?: Mode;
  history: {
    concepts: Concept[];
    currentConceptId: string;
  }[];
  currentHistoryIndex: number;
  maxHistorySize: number;
}

export interface ThemeStoreModel extends ThemeStoreState {
  // # 整体设置
  resetStore: () => void;
  setSaving: (saving: boolean) => void;

  // # 历史记录管理
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  saveToHistory: () => void;
  clearHistory: () => void;

  // # Concepts 管理
  setCurrentConcept: (id: string) => void;
  getCurrentConcept: () => Concept;
  addConcept: (options?: { name?: string; themeConfig?: Concept['themeConfig'] }) => void;
  deleteConcept: (id: string) => void;
  duplicateConcept: (id: string) => void;
  renameConcept: (id: string, name: string) => void;
  setConcepts: (data: ThemeData) => void;
  applyTheme: (concept: Concept, theme: PredefinedTheme, options?: ApplyThemeOptions) => Concept;
  applyColors: (
    concept: Concept,
    theme: Pick<PredefinedTheme, 'light' | 'dark'>,
    options?: ApplyThemeOptions,
  ) => Concept;
  applyTypography: (concept: Concept, theme: Pick<PredefinedTheme, 'fonts'>, options?: ApplyThemeOptions) => Concept;
  isPredefinedTheme: (concept: Concept) => boolean;
  shuffleTheme: () => void;

  // # ThemeOption 编辑
  setThemeOption: (path: string, value: any) => void;
  setThemeOptions: (configs: { path: string; value: any }[]) => void;
  removeThemeOption: (path: string) => void;
  removeThemeOptions: (paths: string[]) => void;
  setThemePrefer: (prefer: ThemePrefer) => void;
  setThemeMode: (mode: Mode, options?: { root?: boolean }) => void;
  getThemeMode: () => Mode;
  shouldShowThemeMode: () => boolean;
  getCurrentThemeOptions: () => ThemeOptions;
  updateThemeConfig: (themeConfig: Concept['themeConfig']) => void;
  getThemeData: () => ThemeData;

  // # Colors 编辑
  setColorLock: (colorKey: string, isLocked: boolean) => void;
  shuffleColors: (colorKeys?: string | string[]) => void;
  resetColors: () => void;

  // # Fonts 编辑
  fetchFonts: (concepts: Concept | Concept[]) => Set<string>;
  setFontLock: (variant: TextVariant, isLocked: boolean) => void;
  setFontOptions: (fonts: Partial<Record<TextVariant, { fontFamily: string }>>) => void;

  // # Preview 查看
  setPreviewSize: (size: PreviewSize) => void;
  setSelectedComponentId: (id: string) => void;
}
