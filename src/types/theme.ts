import type { ThemeOptions } from '@mui/material/styles';
import { Theme } from '@mui/material/styles';

export type Mode = 'light' | 'dark';

export interface Concept {
  id: string;
  name: string;
  themeOptions: {
    light: ThemeOptions;
    dark: ThemeOptions;
    prefer: string;
  };
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
  mode: Mode;
  fonts: string[];
  loadedFonts: Set<string>;
  previewSize: PreviewSize;
  themeConfigOpen: boolean;
  selectedComponentId: string;
  editor: EditorState;
  themeObject: Theme;

  // Concepts 管理
  addConcept: (name: string, baseThemeOptions?: Concept['themeOptions']) => void;
  deleteConcept: (id: string) => void;
  duplicateConcept: (id: string, name?: string) => void;
  setCurrentConcept: (id: string) => void;
  renameConcept: (id: string, name: string) => void;

  // ThemeOption 编辑
  setThemeOption: (path: string, value: any) => void;
  setThemeOptions: (configs: { path: string; value: any }[]) => void;
  removeThemeOption: (path: string) => void;
  removeThemeOptions: (configs: { path: string }[]) => void;
  setThemePrefer: (prefer: string) => void;
  setThemeMode: (mode: Mode) => void;
  updateThemeOptions: (themeOptions: Concept['themeOptions']) => void;
  resetStore: () => void;
  resetSiteData: () => void;

  // Colors 编辑
  setColorLock: (colorKey: string, isLocked: boolean) => void;

  // Fonts 编辑
  addFonts: (fonts: string[]) => Promise<void>;

  // Preview 查看
  setPreviewSize: (size: PreviewSize) => void;
  setSelectedComponentId: (id: string) => void;
}
