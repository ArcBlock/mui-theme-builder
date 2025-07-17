import { join } from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: join(__dirname, 'lib.ts'),
      formats: ['umd'],
      name: 'themeBuilder',
      fileName: () => 'index.js',
    },
    emptyOutDir: false,
  },
});
