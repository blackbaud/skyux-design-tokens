import { sync } from 'glob';
import { Plugin } from 'vite';
import path from 'path';
import StyleDictionary, { Config, PlatformConfig } from 'style-dictionary';
import { getTransforms, register } from '@tokens-studio/sd-transforms';
import {
  tokenConfig,
  TokenConfig,
  TokenSet,
  ReferenceTokenSet,
  Breakpoint,
} from '../src/tokens/token-config.mts';

interface SkyStyleDictionaryConfig extends Config {
  platforms: {
    css: PlatformConfig;
  };
}

interface GeneratedFile {
  output: unknown;
  destination: string | undefined;
}

const DEFAULT_SD_CONFIG: SkyStyleDictionaryConfig = {
  preprocessors: ['tokens-studio'],
  platforms: {
    css: {
      transformGroup: 'custom/tokens-studio',
      options: {
        outputReferences: true,
        showFileHeader: false,
      },
      buildPath: `dist/`,
    },
  },
};

function getMediaQueryMinWidth(breakpoint: Breakpoint): string {
  switch (breakpoint) {
    case 'xs':
    default:
      return '0px';
    case 's':
      return '768px';
    case 'm':
      return '992px';
    case 'l':
      return '1200px';
  }
}

async function generateDictionaryFiles(
  tokenConfig: TokenConfig,
): Promise<GeneratedFile[]> {
  const sd = new StyleDictionary(undefined, {
    verbosity: 'verbose',
  });

  let allFiles: GeneratedFile[] = [];

  await Promise.all(
    tokenConfig.tokenSets.map(async (tokenSet) => {
      const tokenDictionary = await sd.extend(
        getBaseDictionaryConfig(tokenSet),
      );
      const files = await tokenDictionary.formatPlatform('css');
      allFiles = allFiles.concat(files);

      await Promise.all(
        tokenSet.referenceTokens.map(async (referenceTokenSet) => {
          const referenceTokenDictionary = await sd.extend(
            getReferenceDictionaryConfig(tokenSet, referenceTokenSet),
          );
          const files = await referenceTokenDictionary.formatPlatform('css');

          files.forEach((file) => {
            if (
              referenceTokenSet.breakpoint &&
              referenceTokenSet.breakpoint !== 'xs'
            ) {
              file.output = `@media (min-width: ${getMediaQueryMinWidth(referenceTokenSet.breakpoint)}) {\n${file.output}\n}`;
            }
          });
          allFiles = allFiles.concat(files);
        }),
      );
    }),
  );

  return allFiles;
}

function getBaseDictionaryConfig(tokenSet: TokenSet): SkyStyleDictionaryConfig {
  const config = {
    ...DEFAULT_SD_CONFIG,
  };

  const rootPath = tokenConfig.rootPath || 'src/tokens/';

  config.source = [`${rootPath}${tokenSet.path}`];
  config.platforms.css.options ??= {};
  config.platforms.css.options.selector = tokenSet.selector;
  config.platforms.css.files = [
    {
      destination: `${tokenSet.name}/${tokenSet.name}.css`,
      format: 'css/variables',
      filter: (token) => token.filePath.includes(tokenSet.path),
    },
  ];

  return config;
}

function getReferenceDictionaryConfig(
  tokenSet: TokenSet,
  referenceTokenSet: ReferenceTokenSet,
): SkyStyleDictionaryConfig {
  const config = {
    ...DEFAULT_SD_CONFIG,
  };

  const rootPath = tokenConfig.rootPath || 'src/tokens/';
  config.source = [`${rootPath}${tokenSet.path}`];
  config.include = [`${rootPath}${referenceTokenSet.path}`];
  config.platforms.css.options ??= {};
  config.platforms.css.options.selector = `${tokenSet.selector}${referenceTokenSet.selector || ''}`;
  config.platforms.css.files = [
    {
      destination: `${tokenSet.name}/${referenceTokenSet.name}.css`,
      format: 'css/variables',
      filter: (token) => token.filePath.includes(referenceTokenSet.path),
    },
  ];

  return config;
}
export function buildStyleDictionaryPlugin(): Plugin {
  register(StyleDictionary);

  StyleDictionary.registerTransform({
    name: 'name/prefixed-kebab',
    transitive: true,
    type: 'name',
    transform: (token) => {
      return `${token.isSource ? '' : 'sky-'}${token.path.join('-')}`;
    },
  });

  // Register custom tokens-studio transform group without the resolveMath transform to allow browsers to do the `calc`.
  // Include the standard css transforms and the custom name transform.
  StyleDictionary.registerTransformGroup({
    name: 'custom/tokens-studio',
    transforms: [
      ...getTransforms({
        platform: 'css',
      }).filter((transform) => transform !== 'ts/resolveMath'),
      ...StyleDictionary.hooks.transformGroups['css'],
      'name/prefixed-kebab',
    ],
  });

  return {
    name: 'transform-style-dictionary',
    async transform(code: string, id: string) {
      const rootPath = tokenConfig.rootPath || 'src/tokens/';
      const files = sync(`${rootPath}**/*.json`);
      for (let file of files) {
        this.addWatchFile(path.join(process.cwd(), file));
      }

      if (id.includes('src/dev/tokens.css')) {
        const sd = new StyleDictionary(undefined, { verbosity: 'verbose' });
        const allFiles = await generateDictionaryFiles(tokenConfig);
        let localTokens = '';

        for (let file of allFiles) {
          localTokens = localTokens.concat(`.local-dev-tokens${file.output}`);
        }

        return localTokens;
      }
    },
    async generateBundle(): Promise<void> {
      const allFiles = await generateDictionaryFiles(tokenConfig);
      const compositeFiles = {};

      for (let file of allFiles) {
        if (file.destination) {
          const fileParts = file.destination.split('/');
          const tokenSetType = fileParts[1];
          const fileName = `assets/scss/${tokenSetType}.css`;

          let fileContents = compositeFiles[fileName] || '';
          fileContents = fileContents.concat(file.output || '');

          compositeFiles[fileName] = fileContents;
        }
      }

      for (let fileName of Object.keys(compositeFiles)) {
        const fileContents = compositeFiles[fileName];
        this.emitFile({
          type: 'asset',
          fileName: fileName.replace('dist/', ''),
          source: fileContents,
        });
      }
    },
  };
}
