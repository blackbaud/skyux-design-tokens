import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { buildStylesPlugin } from './plugins/build-styles-plugin.mjs';
import { buildComboCssPlugin } from './plugins/build-combo-css-plugin.mts';
import {
  buildAssetsManifestPlugin,
  buildStyleDictionaryPlugin,
  preparePackagePlugin,
} from '@blackbaud/skyux-branding-builder';
import { tokenConfig } from './src/tokens/token-config.mts';

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
      buildStyleDictionaryPlugin(tokenConfig),
      buildComboCssPlugin({
        fileName: 'bundles/base_public-api.css',
        sourceFileNames: ['bundles/base.css', 'bundles/public-api.css'],
      }),
      buildComboCssPlugin({
        fileName: 'bundles/base_blackbaud_public-api.css',
        sourceFileNames: [
          'bundles/base.css',
          'bundles/blackbaud.css',
          'bundles/public-api.css',
        ],
      }),
      buildAssetsManifestPlugin(tokenConfig.projectName),
      preparePackagePlugin(__dirname),
    ],
  });
};
