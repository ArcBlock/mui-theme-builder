import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createBlockletPlugin } from 'vite-plugin-blocklet';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';
import svgr from 'vite-plugin-svgr';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react(), createBlockletPlugin(), svgr(), monacoEditorPlugin({
        // 配置需要支持的语言
        languages: ['javascript', 'css', 'html', 'typescript'],
        // 自定义 Monaco Editor 的配置
        customDistPath: (root) => path.join(root, 'dist', 'monaco-editor'),
      }),],
  };
});
