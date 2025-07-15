import { content as cssContent } from './cssTypes';
import { content as muiContent } from './muiTypes';

export const files: Record<string, string> = {
  '@mui/material/styles/index.d.ts': muiContent,
  'cssTypes/index.d.ts': cssContent,
};
