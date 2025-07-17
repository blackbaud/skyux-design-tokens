import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';
import packageJson from '../../package.json' with { type: 'json' };

interface FontAsset {
  family: string;
  src: string;
  weight: string;
  style: string;
}

interface AssetsConfig {
  fonts?: FontAsset[];
}

export function fixAssetsUrlValue(
  basePath: string | undefined,
  value: string,
): string {
  const effectiveBasePath = getBasePath(basePath);

  if (effectiveBasePath !== undefined) {
    if (effectiveBasePath === basePath) {
      // Local path - replace ~/assets/ with the base path
      value = value
        .replace(/~\/assets\//g, effectiveBasePath)
        .replaceAll("'", "\'");
    } else {
      // CDN path - replace ~/ with the CDN base path
      value = value.replace(/~\//g, effectiveBasePath).replaceAll("'", "\'");
    }
  }

  return `url('${value}')`;
}

export async function generateAssetsCss(basePath: string): Promise<string> {
  const assetsJsonPath = join('public', 'assets', 'assets.json');
  const effectiveBasePath = getBasePath(basePath);

  try {
    // Check if assets.json exists
    if (!existsSync(assetsJsonPath)) {
      console.warn('assets.json not found in public/assets folder');
      return '';
    }

    // Read and parse assets.json
    const assetsContent = await readFile(assetsJsonPath, 'utf-8');
    const assetsConfig: AssetsConfig = JSON.parse(assetsContent);

    if (!assetsConfig.fonts || assetsConfig.fonts.length === 0) {
      console.warn('No fonts found in assets.json');
      return '';
    }

    // Generate CSS font declarations
    const fontFaceDeclarations = assetsConfig.fonts
      .map((font) => {
        return `@font-face {
  font-family: '${font.family}';
  src: ${fixAssetsUrlValue(effectiveBasePath, font.src)};
  font-weight: ${font.weight};
  font-style: ${font.style};
  font-display: swap;
}`;
      })
      .join('\n\n');

    return fontFaceDeclarations;
  } catch (error) {
    console.error('Error generating font CSS:', error);
    throw error;
  }
}

function getBasePath(basePath: string | undefined): string | undefined {
  const packageVersion = process.env.PACKAGEJSON_VERSION;
  const packageNameParts = packageJson.name.split('/');
  const packageName = packageNameParts[packageNameParts.length - 1];

  if (packageVersion) {
    return `https://sky.blackbaudcdn.net/static/${packageName}/${packageVersion}/`;
  }
  return basePath;
}
