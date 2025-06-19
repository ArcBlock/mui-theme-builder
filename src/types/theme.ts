import type { ThemeOptions } from '@mui/material/styles';

export type PreviewSize = 'pc' | 'mobile';
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
