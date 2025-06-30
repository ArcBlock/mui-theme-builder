import type { ThemeOptions } from '@mui/material/styles';
import { Theme } from '@mui/material/styles';

export type Mode = 'light' | 'dark';
export type ThemePrefer = 'light' | 'dark' | 'system';
export type TextVariant = 'heading' | 'body';
export type PreviewSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
export type MainColors = 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';

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

export interface PredefinedTheme {
  name: string;
  light: Record<MainColors, string>;
  dark: Record<MainColors, string>;
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
}

export interface ThemeStoreModel extends ThemeStoreState {
  // 整体设置
  resetStore: () => void;
  resetSiteData: () => void;

  // Concepts 管理
  setCurrentConcept: (id: string) => void;
  getCurrentConcept: () => Concept;
  addConcept: (options?: { name?: string; themeConfig?: Concept['themeConfig'] }) => void;
  deleteConcept: (id: string) => void;
  duplicateConcept: (id: string) => void;
  renameConcept: (id: string, name: string) => void;
  setConcepts: (data: { concepts: Concept[]; currentConceptId: string }) => void;
  applyPredefinedTheme: (concept: Concept, theme: PredefinedTheme, colorKeys?: string | string[]) => Concept;
  isPredefinedTheme: (concept: Concept) => boolean;

  // ThemeOption 编辑
  setThemeOption: (path: string, value: any) => void;
  setThemeOptions: (configs: { path: string; value: any }[]) => void;
  removeThemeOption: (path: string) => void;
  removeThemeOptions: (paths: string[]) => void;
  setThemePrefer: (prefer: ThemePrefer) => void;
  setThemeMode: (mode: Mode) => void;
  updateThemeConfig: (themeConfig: Concept['themeConfig']) => void;
  getCurrentThemeOptions: () => ThemeOptions;

  // Colors 编辑
  setColorLock: (colorKey: string, isLocked: boolean) => void;
  shuffleColors: (colorKeys?: string | string[]) => void;
  resetColors: () => void;

  // Fonts 编辑
  setFontOptions: (fontMap: Partial<Record<TextVariant, { fontFamily: string }>>) => void;

  // Preview 查看
  setPreviewSize: (size: PreviewSize) => void;
  setSelectedComponentId: (id: string) => void;
}
