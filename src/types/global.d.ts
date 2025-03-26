declare module 'vite-plugin-blocklet';
declare module '@arcblock/did-connect/*';

declare module '@mui/material/colors' {
  export const amber: Record<number | string, string>;
  export const blue: Record<number | string, string>;
  export const blueGrey: Record<number | string, string>;
  export const brown: Record<number | string, string>;
  export const common: Record<number | string, string>;
  export const cyan: Record<number | string, string>;
  export const deepOrange: Record<number | string, string>;
  export const deepPurple: Record<number | string, string>;
  export const green: Record<number | string, string>;
  export const grey: Record<number | string, string>;
  export const indigo: Record<number | string, string>;
  export const lightBlue: Record<number | string, string>;
  export const lightGreen: Record<number | string, string>;
  export const lime: Record<number | string, string>;
  export const orange: Record<number | string, string>;
  export const pink: Record<number | string, string>;
  export const purple: Record<number | string, string>;
  export const red: Record<number | string, string>;
  export const teal: Record<number | string, string>;
  export const yellow: Record<number | string, string>;
}

declare module '*.png' {
  const value: any;
  export = value;
}
declare module '*.webp' {
  const value: any;
  export = value;
}

declare global {
  interface Window {
    blocklet: Record<string, any>;
  }
}
