import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { buildStylesPlugin } from './plugins/build-styles-plugin.mjs';
import { buildStyleDictionaryPlugin } from './plugins/build-style-dictionary-plugin.mjs';
import { preparePackagePlugin } from './plugins/prepare-package-plugin.mjs';

export default ({ mode }) => {
  const viteEnv = loadEnv(mode, process.cwd());

  return defineConfig({
    build: {
      lib: {
        entry: path.resolve(__dirname, 'src/dev/main.ts'),
        name: 'SkyuxDesignTokens',
        fileName() {
          return `bundles/design-tokens.global.min.js`;
        },
        formats: ['es'],
      },
    },
    preview: {
      open: true,
    },
    server: {
      https: viteEnv.VITE_DEV_CERT
        ? {
            cert: viteEnv.VITE_DEV_CERT,
            key: viteEnv.VITE_DEV_KEY,
          }
        : undefined,
      open: true,
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      },
    },
    test: {
      name: 'Design Tokens',
      environment: 'node',
      root: path.resolve(__dirname),
      mockReset: true,
    },
    plugins: [
      buildStylesPlugin(),
      buildStyleDictionaryPlugin(),
      preparePackagePlugin(),
    ],
  });
};
