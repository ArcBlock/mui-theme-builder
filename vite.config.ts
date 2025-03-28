/* eslint-disable import/no-extraneous-dependencies */
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
// @ts-ignore
import monacoEditorPlugin from 'vite-plugin-monaco-editor';
import svgr from 'vite-plugin-svgr';

const monacoEditorPublicPath = 'monacoeditorwork';

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    base: './',
    plugins: [
      react(),
      svgr(),
      monacoEditorPlugin({
        publicPath: monacoEditorPublicPath,
        customDistPath: (root, buildOutDir) => path.resolve(buildOutDir, monacoEditorPublicPath),
      }),
    ],
    define: {
      global: 'window',
    },
    resolve: {
      alias: {
        src: path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3001,
      open: true,
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./tests/setup.ts'],
      css: true,
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
    },
  };
});
