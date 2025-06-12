import { Theme } from '@mui/material';
import { ThemeOptions } from '@mui/material/styles';

import { EditorState } from './editor/types';

export interface RootState {
  editor: EditorState;
  themeId: string;
  themeObject: Theme;
  themeOptions: {
    light: ThemeOptions;
    dark: ThemeOptions;
    prefer: string;
  };
  fonts: string[];
  mode: 'light' | 'dark';
  loadedFonts: Set<string>;
  previewSize: PreviewSize;
  themeConfigOpen: boolean;
  selectedComponentId: string;
}

export interface EndRootState extends Omit<RootState, 'loadedFonts'> {
  loadedFonts: string[];
}
export type PreviewSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
