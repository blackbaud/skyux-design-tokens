import { sync } from 'glob';
import { Plugin } from 'vite';
import path from 'path';
import StyleDictionary, {
  Config,
  PlatformConfig,
  Token,
} from 'style-dictionary';
import { formattedVariables, sortByName } from 'style-dictionary/utils';
import { getTransforms, register } from '@tokens-studio/sd-transforms';
import { tokenConfig } from '../src/tokens/token-config.mts';
import { TokenConfig } from '../src/types/token-config.ts';
import { TokenSet } from '../src/types/token-set.ts';
import { Breakpoint } from '../src/types/breakpoint.ts';
import { ReferenceTokenSet } from '../src/types/reference-token-set.ts';
import {
  generateAssetsCss,
  fixAssetsUrlValue,
} from './shared/assets-utils.mts';

interface SkyStyleDictionaryConfig extends Config {
  platforms: {
    css: PlatformConfig;
  };
}

interface GeneratedFile {
  output: unknown;
  destination: string | undefined;
  breakpoint?: Breakpoint;
}

interface SkyTokenOptions {
  assetsBasePath: string;
  generateUrlAtProperties?: boolean;
  selectorPrefix: string;
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

function isUrlToken(token: Token): boolean {
  return (
    token.$extensions?.['com.blackbaud.developer.sky-token-format'] === 'url'
  );
}

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

function getContainerBreakpointClassList(breakpoint: Breakpoint): string[] {
  const largeClasses = ['.sky-responsive-container-lg'];
  const mediumClasses = ['.sky-responsive-container-md', ...largeClasses];
  const smallClasses = ['.sky-responsive-container-sm', ...mediumClasses];
  const xsClasses = ['.sky-responsive-container-xs', ...smallClasses];

  switch (breakpoint) {
    case 'xs':
    default:
      return xsClasses;
    case 's':
      return smallClasses;
    case 'm':
      return mediumClasses;
    case 'l':
      return largeClasses;
  }
}

async function generateDictionaryFiles(
  tokenConfig: TokenConfig,
  skyOptions: SkyTokenOptions,
): Promise<GeneratedFile[]> {
  const sd = new StyleDictionary(undefined);

  let allFiles: GeneratedFile[] = [];

  await Promise.all(
    tokenConfig.tokenSets.map(async (tokenSet) => {
      const tokenDictionary = await sd.extend(
        getBaseDictionaryConfig(tokenSet, {
          ...skyOptions,
          generateUrlAtProperties: true,
        }),
      );
      const files: {
        output: unknown;
        destination: string | undefined;
        breakpoint?: Breakpoint;
      }[] = await tokenDictionary.formatPlatform('css');
      allFiles = allFiles.concat(files);

      await Promise.all(
        tokenSet.referenceTokens.map(async (referenceTokenSet) => {
          const referenceTokenDictionary = await sd.extend(
            getReferenceDictionaryConfig(
              tokenSet,
              referenceTokenSet,
              skyOptions,
            ),
          );
          const files: {
            output: unknown;
            destination: string | undefined;
            breakpoint?: Breakpoint;
          }[] = await referenceTokenDictionary.formatPlatform('css');
          const selector = `${tokenSet.selector}${referenceTokenSet.selector || ''}`;

          files.forEach((file) => {
            if (referenceTokenSet.responsive) {
              const orignialOutput = file.output as string;

              // NOTE: No return character after original output as we have already added one there when we alphabetize
              file.output =
                referenceTokenSet.responsive.breakpoint === 'xs'
                  ? orignialOutput
                  : `@media (min-width: ${getMediaQueryMinWidth(referenceTokenSet.responsive.breakpoint)}) {\n${orignialOutput}}\n`;
              file.breakpoint = referenceTokenSet.responsive.breakpoint;

              // including the container classes should be the default behavior if not explicitly set
              if (referenceTokenSet.responsive.includesContainer !== false) {
                const containerClasses = getContainerBreakpointClassList(
                  referenceTokenSet.responsive.breakpoint,
                );
                const containerSelectors = containerClasses
                  .map((className) => `${selector} ${className}`)
                  .join(', ');

                if (referenceTokenSet.responsive.breakpoint === 'xs') {
                  const combinedOutput = orignialOutput.replace(
                    selector,
                    `${selector}, ${containerSelectors}`,
                  );
                  file.output = `${combinedOutput}\n`;
                } else {
                  const containerBreakpointOutput = orignialOutput.replace(
                    selector,
                    containerSelectors,
                  );
                  file.output += `${containerBreakpointOutput}\n`;
                }
              }
            }
          });
          allFiles = allFiles.concat(files);
        }),
      );
    }),
  );

  // We need to order the files by breakpoint so that the media queries are seen by the browser in the correct order.
  // Media queries do not count towards css specificity, so the order in which they are defined matters.
  const breakpointOrder = [undefined, 'xs', 's', 'm', 'l'];
  allFiles.sort((a, b) => {
    const aIndex = breakpointOrder.indexOf(a.breakpoint);
    const bIndex = breakpointOrder.indexOf(b.breakpoint);
    return aIndex - bIndex;
  });

  return allFiles;
}

function getBaseDictionaryConfig(
  tokenSet: TokenSet,
  skyOptions: SkyTokenOptions,
): SkyStyleDictionaryConfig {
  const config = {
    ...DEFAULT_SD_CONFIG,
  };

  const rootPath = tokenConfig.rootPath || 'src/tokens/';

  config.source = [`${rootPath}${tokenSet.path}`];

  const cssOptions = (config.platforms.css.options ??= {});

  Object.assign(cssOptions, {
    skyOptions,
    selector: tokenSet.selector,
  });

  config.platforms.css.files = [
    {
      destination: `${tokenSet.name}/${tokenSet.name}.css`,
      format: 'css/alphabetize-variables',
      filter: (token) => token.filePath.includes(tokenSet.path),
    },
  ];

  return config;
}

function getReferenceDictionaryConfig(
  tokenSet: TokenSet,
  referenceTokenSet: ReferenceTokenSet,
  skyOptions: SkyTokenOptions,
): SkyStyleDictionaryConfig {
  const config = {
    ...DEFAULT_SD_CONFIG,
  };

  const rootPath = tokenConfig.rootPath || 'src/tokens/';
  config.source = [`${rootPath}${tokenSet.path}`];
  config.include = [`${rootPath}${referenceTokenSet.path}`];

  const cssOptions = (config.platforms.css.options ??= {});

  Object.assign(cssOptions, {
    skyOptions,
    selector: `${tokenSet.selector}${referenceTokenSet.selector || ''}`,
  });

  config.platforms.css.files = [
    {
      destination: `${tokenSet.name}/${referenceTokenSet.name}.css`,
      format: 'css/alphabetize-variables',
      filter: (token) => token.filePath.includes(referenceTokenSet.path),
    },
  ];

  return config;
}

async function addAssetsCss(
  basePath: string,
  fileContents: string,
): Promise<string> {
  const assetsCss = await generateAssetsCss(basePath);

  if (assetsCss) {
    fileContents = `${assetsCss}\n\n${fileContents}`;
  }

  return fileContents;
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

  StyleDictionary.registerTransform({
    name: 'size/zero-rem',
    type: 'value',
    filter: (token) =>
      (token.$type === 'dimension' || token.$type === 'fontSize') &&
      token.$value === '0',
    transform: () => '0rem',
  });

  StyleDictionary.registerTransform({
    name: 'assets-path',
    type: 'value',
    filter: isUrlToken,
    transform: (token, _, options) =>
      fixAssetsUrlValue(
        options.platforms?.css?.options?.skyOptions?.assetsBasePath,
        token.$value,
      ),
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
      'size/zero-rem',
      'assets-path',
    ],
  });

  StyleDictionary.registerFormat({
    name: 'css/alphabetize-variables',
    format: function ({ dictionary, options }) {
      const { outputReferences, outputReferenceFallbacks, skyOptions } =
        options;

      let properties = '';

      if (skyOptions.generateUrlAtProperties) {
        properties = dictionary.allTokens
          .filter(isUrlToken)
          .sort(sortByName)
          .map(
            (token) => `@property --${token.name} {
  syntax: '<url>';
  inherits: true;
  initial-value: url('data:,');
}`,
          )
          .join('\n\n');
      }

      dictionary.allTokens = dictionary.allTokens.sort(sortByName);

      const variables = formattedVariables({
        format: 'css',
        dictionary,
        outputReferences,
        outputReferenceFallbacks,
        usesDtcg: true,
      });

      return `${properties ? properties + '\n\n' : ''}${skyOptions?.selectorPrefix ?? ''}${options.selector} {
${variables}
}
`;
    },
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
        const assetsBasePath = '/assets/';
        const sd = new StyleDictionary(undefined);

        const allFiles = await generateDictionaryFiles(tokenConfig, {
          assetsBasePath,
          selectorPrefix: '.local-dev-tokens',
        });

        let localTokens = allFiles.reduce((acc, file) => acc + file.output, '');

        localTokens = await addAssetsCss(assetsBasePath, localTokens);

        return localTokens;
      }
    },
    async generateBundle(): Promise<void> {
      const assetsBasePath = '../';

      const allFiles = await generateDictionaryFiles(tokenConfig, {
        assetsBasePath,
        selectorPrefix: '',
      });

      const compositeFiles = {};

      for (let file of allFiles) {
        if (file.destination) {
          const fileParts = file.destination.split('/');
          const tokenSetType = fileParts[1];
          const fileName = `assets/scss/${tokenSetType}.css`;

          let fileContents = compositeFiles[fileName] || '';
          fileContents = fileContents.concat(file.output ?? '');

          compositeFiles[fileName] = fileContents;
        }
      }

      for (let fileName of Object.keys(compositeFiles)) {
        const fileContents = await addAssetsCss(
          assetsBasePath,
          compositeFiles[fileName],
        );

        this.emitFile({
          type: 'asset',
          fileName: fileName.replace('dist/', ''),
          source: fileContents,
        });
      }
    },
  };
}
