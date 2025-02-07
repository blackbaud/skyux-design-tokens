import { sync } from 'glob';
import path from 'path';
import StyleDictionary from 'style-dictionary';
import { getTransforms, register } from '@tokens-studio/sd-transforms';
import { tokenSets } from '../src/tokens/token-sets.mjs';

async function generateDictionaryFiles(tokenSets) {
  const sd = new StyleDictionary(undefined, {
    verbosity: 'verbose',
  });
  let allFiles = [];

  await Promise.all(
    tokenSets.map(async (tokenSet) => {
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
          allFiles = allFiles.concat(files);
        }),
      );
    }),
  );

  return allFiles;
}

const DEFAULT_SD_CONFIG = {
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

function getBaseDictionaryConfig(tokenSet) {
  const config = {
    ...DEFAULT_SD_CONFIG,
  };

  config.source = [`src/tokens/${tokenSet.path}`];
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

function getReferenceDictionaryConfig(tokenSet, referenceTokenSet) {
  const config = {
    ...DEFAULT_SD_CONFIG,
  };

  config.source = [`src/tokens/${tokenSet.path}`];
  config.include = [`src/tokens/${referenceTokenSet.path}`];
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

export function buildStyleDictionaryPlugin() {
  register(StyleDictionary);

  StyleDictionary.registerTransform({
    name: 'name/prefixed-kebab',
    transitive: true,
    type: 'name',
    transform: (token) => {
      return `${token.isSource ? '' : 'sky-'}${token.path.join('-')}`;
    },
  });

  // Register custom tokens-studio transform group without the resolveMath transform to allow browsers to do the `calc`
  StyleDictionary.registerTransformGroup({
    name: 'custom/tokens-studio',
    // default value for platform is css, specifies which Tokens Studio transforms for which platform to grab
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
    async transform(code, id) {
      const files = sync('src/tokens/**/*.json');
      for (let file of files) {
        this.addWatchFile(path.join(process.cwd(), file));
      }

      if (id.includes('src/dev/tokens.css')) {
        const sd = new StyleDictionary(undefined, { verbosity: 'verbose' });
        const allFiles = await generateDictionaryFiles(tokenSets, sd);
        let localTokens = '';

        for (let file of allFiles) {
          localTokens = localTokens.concat(`.local-dev-tokens${file.output}`);
        }

        return localTokens;
      }
    },
    async generateBundle() {
      const allFiles = await generateDictionaryFiles(tokenSets);
      const compositeFiles = {};

      for (let file of allFiles) {
        const fileParts = file.destination.split('/');
        const tokenSetType = fileParts[1];
        const fileName = `scss/${tokenSetType}.css`;

        let fileContents = compositeFiles[fileName] || '';
        fileContents = fileContents.concat(file.output || '');

        compositeFiles[fileName] = fileContents;
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
