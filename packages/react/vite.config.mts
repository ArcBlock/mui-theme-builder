/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { codeInspectorPlugin } from 'code-inspector-plugin';
import fg from 'fast-glob';
import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import noBundlePlugin from 'vite-plugin-no-bundle';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react({ jsxRuntime: 'automatic' }),
    svgr({
      include: ['**/*.svg', '**/*.svg?react'],
    }),
    dts({
      entryRoot: 'src',
      exclude: ['**/*.stories.*', '**/*.test.*', '**/demo/**'],
      tsconfigPath: './tsconfig.json',
    }),
    noBundlePlugin({
      root: 'src',
      copy: ['**/*.png', '**/*.gif', '**/*.jpg', '**/*.jpeg', '**/*.d.ts', '**/*.css'],
    }),
    codeInspectorPlugin({
      bundler: 'vite',
    }),
  ],
  build: {
    lib: {
      entry: fg.sync('src/**/*.{tsx,ts,jsx,js}', {
        ignore: ['**/stories/**', '**/demo/**', '**/*.d.ts', '**/*.stories.*'],
      }),
      formats: ['es'],
      fileName: (_, entryName) => `${entryName}.js`,
    },
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: ['@sentry/browser'],
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    css: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
});
