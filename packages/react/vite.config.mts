import react from '@vitejs/plugin-react';
import { codeInspectorPlugin } from 'code-inspector-plugin';
import fg from 'fast-glob';
import path, { join } from 'path';
import { defineConfig, loadEnv } from 'vite';
import dts from 'vite-plugin-dts';
import noBundlePlugin from 'vite-plugin-no-bundle';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';
  const arcblockUxBasePath = env.ARCBLOCK_UX_BASE_PATH;
  const alias: Record<string, string> = {};
  const precompilationExclude: string[] = [];

  if (!isProduction && arcblockUxBasePath) {
    // eslint-disable-next-line no-console
    console.log('enable debug with UX');

    const hoistedLibs: string[] = [
      // ux repo 中其他的包
      '@arcblock/bridge',
      '@arcblock/icons',
      '@arcblock/react-hooks',
      '@arcblock/nft-display',
      // ux repo 中 使用到 server repo 的包
      '@blocklet/meta',
      '@blocklet/js-sdk',
      // 带有公共 context 的包
      'react',
      'react-router-dom',
      '@emotion/react',
      '@emotion/styled',
      '@mui/icons-material',
      '@mui/material',
    ];

    alias['@arcblock/ux/lib'] = `${arcblockUxBasePath}/packages/ux/src`;
    alias['@arcblock/did-connect/lib'] = `${arcblockUxBasePath}/packages/did-connect/src`;
    alias['@blocklet/ui-react/lib'] = `${arcblockUxBasePath}/packages/blocklet-ui-react/src`;
    alias['@blocklet/ui-react'] = `${arcblockUxBasePath}/packages/blocklet-ui-react`;
    alias['@blocklet/theme'] = `${arcblockUxBasePath}/packages/blocklet-theme/src`;

    for (const x of hoistedLibs) {
      alias[x] = join(process.cwd(), `./node_modules/${x}`);
    }

    precompilationExclude.push('@blocklet/ui-react');
  }

  return {
    resolve: {
      alias: {
        src: path.resolve(__dirname, './src'),
        ...alias,
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
        fileName: (format, entryName) => `${entryName}.js`,
      },
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        external: ['@sentry/browser'],
      },
    },
    optimizeDeps: {
      exclude: precompilationExclude,
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
