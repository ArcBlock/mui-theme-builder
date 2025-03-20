/* eslint-disable import/no-extraneous-dependencies */
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
// @ts-ignore
import { createBlockletPlugin } from 'vite-plugin-blocklet';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react(), createBlockletPlugin(), svgr(), monacoEditorPlugin({})],
    resolve: {
      alias: {
        src: path.resolve(__dirname, './src'),
      },
    },
    base: '/',
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
