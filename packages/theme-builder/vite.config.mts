/* eslint-disable import/no-extraneous-dependencies */
import react from '@vitejs/plugin-react';
import { codeInspectorPlugin } from 'code-inspector-plugin';
import path, { join } from 'path';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isDevelopment = mode === 'development';
  const projRoot = join(__dirname, '../../');
  const arcblockUxBasePath = env.ARCBLOCK_UX_BASE_PATH;
  const themeBuilderReactPath = path.resolve(__dirname, '../react/src');
  const alias: Record<string, string> = {};
  const precompilationExclude: string[] = [];

  if (isDevelopment) {
    alias['src'] = themeBuilderReactPath;
    alias['@blocklet/theme-builder-react'] = join(themeBuilderReactPath, 'index.tsx');

    if (arcblockUxBasePath) {
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
        alias[x] = join(projRoot, `./node_modules/${x}`);
      }

      precompilationExclude.push('@blocklet/ui-react');
    }
  }

  return {
    base: './',
    plugins: [
      react(),
      svgr(),
      codeInspectorPlugin({
        bundler: 'vite',
      }),
    ],
    define: {
      global: 'window',
    },
    resolve: {
      alias,
    },
    optimizeDeps: {
      exclude: precompilationExclude,
    },
    server: {
      port: 3001,
      open: true,
      fs: {
        allow: [process.cwd(), themeBuilderReactPath, arcblockUxBasePath].filter(Boolean),
      },
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
