/* eslint-disable import/no-extraneous-dependencies */
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
// @ts-ignore
import { createBlockletPlugin } from 'vite-plugin-blocklet';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';
import svgr from 'vite-plugin-svgr';

const monacoEditorPublicPath = 'monacoeditorwork';

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    base: '/hosted/theme-builder',
    plugins: [
      react(),
      // createBlockletPlugin(),
      svgr(),
      monacoEditorPlugin({
        publicPath: monacoEditorPublicPath,
        customDistPath: (root, buildOutDir) => path.resolve(buildOutDir, monacoEditorPublicPath),
      }),
    ],
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
