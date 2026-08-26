import type { Plugin, Rollup } from 'vite';

export interface ComboCssPluginOptions {
  /**
   * The bundle-relative fileName to emit, e.g. `bundles/base-blackbaud-public-api-combo.css`.
   */
  fileName: string;
  /**
   * The bundle-relative fileNames of the CSS assets to concatenate, in order.
   * Each must already have been emitted by an earlier plugin's `generateBundle` hook.
   */
  sourceFileNames: string[];
}

export function buildComboCssPlugin(options: ComboCssPluginOptions): Plugin {
  const { fileName, sourceFileNames } = options;

  return {
    name: 'build-combo-css',
    generateBundle(_outputOptions, bundle) {
      const source = sourceFileNames
        .map((sourceFileName) => {
          const asset = bundle[sourceFileName] as
            | Rollup.OutputAsset
            | undefined;

          if (!asset || asset.type !== 'asset') {
            throw new Error(
              `Cannot build combo file "${fileName}": expected "${sourceFileName}" to already be emitted as a CSS asset.`,
            );
          }

          return asset.source as string;
        })
        .join('\n');

      this.emitFile({
        type: 'asset',
        fileName,
        source,
      });
    },
  };
}
