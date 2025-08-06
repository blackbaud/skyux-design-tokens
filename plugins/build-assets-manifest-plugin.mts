import type { Plugin } from 'vite';
import { fixAssetsUrl } from './shared/assets-utils.mts';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { AssetsConfig } from './shared/assets-config';

function transformSrc(src: string): string {
  return src.startsWith('~/assets') ? fixAssetsUrl('./', src) : src;
}

function transformAssetsJson(code: string): string | null {
  try {
    const assetsConfig: AssetsConfig = JSON.parse(code);

    // Resolve asset paths in fonts
    if (assetsConfig.fonts) {
      for (const fontConfig of assetsConfig.fonts) {
        fontConfig.src = transformSrc(fontConfig.src);
      }
    }

    // Resolve asset paths in images
    if (assetsConfig.images) {
      for (const imageConfig of Object.values(assetsConfig.images)) {
        imageConfig.src = transformSrc(imageConfig.src);
      }
    }

    return JSON.stringify(assetsConfig, null, 2);
  } catch (error) {
    console.error('Error transforming assets.json:', error);
    return null;
  }
}

export function buildAssetsManifestPlugin(): Plugin {
  return {
    name: 'build-assets-manifest',
    async generateBundle() {
      const assetsJsonPath = join('public', 'assets', 'assets.json');

      if (!existsSync(assetsJsonPath)) {
        console.warn('assets.json not found in public/assets folder');
        return;
      }

      try {
        const assetsContent = await readFile(assetsJsonPath, 'utf-8');

        if (!assetsContent) {
          console.warn('assets.json is empty');
          return;
        }

        const transformedContent = transformAssetsJson(assetsContent);

        if (!transformedContent) {
          console.warn('Failed to transform assets.json');
          return;
        }

        this.emitFile({
          type: 'asset',
          fileName: 'assets/assets.json',
          source: transformedContent,
        });
      } catch (error) {
        console.error('Error processing assets.json:', error);
      }
    },
  };
}
