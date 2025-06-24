import type { ThemeOptions } from '@mui/material/styles';
import { Theme } from '@mui/material/styles';

export type Mode = 'light' | 'dark';
export type ThemePrefer = 'light' | 'dark' | 'system';
export type TextVariant = 'heading' | 'body';

export interface Concept {
  id: string;
  name: string;
  mode: Mode;
  prefer: ThemePrefer;
  themeConfig: {
    light: ThemeOptions;
    dark: ThemeOptions;
    common: ThemeOptions;
  };
  editor: EditorState;
}

export type PreviewSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;

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
  fonts: string[];
  loadedFonts: Set<string>;
  previewSize: PreviewSize;
  selectedComponentId: string;
  themeObject: Theme;
  lastShuffledPaletteIndex: number;
  lastShuffleResult: { headingFont?: string; bodyFont?: string };

  // Concepts 管理
  addConcept: (name: string, baseThemeOptions?: Concept['themeConfig']) => void;
  deleteConcept: (id: string) => void;
  duplicateConcept: (id: string, name?: string) => void;
  setCurrentConcept: (id: string) => void;
  getCurrentConcept: () => Concept;
  renameConcept: (id: string, name: string) => void;

  // ThemeOption 编辑
  setThemeOption: (path: string, value: any) => void;
  setThemeOptions: (configs: { path: string; value: any }[]) => void;
  removeThemeOption: (path: string) => void;
  removeThemeOptions: (configs: { path: string }[]) => void;
  setThemePrefer: (prefer: ThemePrefer) => void;
  setThemeMode: (mode: Mode) => void;
  updateThemeConfig: (themeConfig: Concept['themeConfig']) => void;
  getCurrentThemeOptions: () => ThemeOptions;

  // 整体设置
  resetStore: () => void;
  resetSiteData: () => void;
  syncRemoteData: (data: { concepts: Concept[]; currentConceptId: string }) => void;

  // Colors 编辑
  setColorLock: (colorKey: string, isLocked: boolean) => void;
  shuffleColors: (colorKeys?: string | string[]) => void;

  // Fonts 编辑
  addFonts: (fonts: string[]) => Promise<void>;
  setFontOptions: (fontMap: Partial<Record<TextVariant, { fontFamily: string }>>) => void;

  // Preview 查看
  setPreviewSize: (size: PreviewSize) => void;
  setSelectedComponentId: (id: string) => void;
}
