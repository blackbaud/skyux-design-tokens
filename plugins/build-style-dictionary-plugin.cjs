import { sync } from 'glob';
import path from 'path';
import StyleDictionary from 'style-dictionary';
import { expandTypesMap, register } from '@tokens-studio/sd-transforms';
import { tokenSets } from '../src/style-dictionary/token-sets.mjs';

export function buildStyleDictionaryPlugin() {
  return {
    name: 'transform-style-dictionary',
    async transform(code, id) {
      const files = sync('src/style-dictionary/tokens/**/*.json');
      for (let file of files) {
        this.addWatchFile(path.join(process.cwd(), file));
      }

      if (id.includes('src/dev/tokens.css')) {
        register(StyleDictionary);

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
      register(StyleDictionary);
      StyleDictionary.registerTransform({
        name: 'name/prefixed-kebab',
        type: 'name',
        transform: (token) => {
          return `${token.isSource ? '' : 'sky-'}${token.path.join('-')}`;
        },
      });

      const sd = new StyleDictionary(undefined, { verbosity: 'verbose' });
      const allSetNames = tokenSets.map((set) => set.name);
      const setsRegex = new RegExp(`(${allSetNames.join('|')})+\/`);
      const allFiles = await generateDictionaryFiles(tokenSets, sd);
      const compositeFiles = {};

      for (let file of allFiles) {
        const fileParts = file.destination.split('/');
        const tokenSetType = fileParts[2];
        const fileName =
          tokenSetType === 'components'
            ? file.destination.replace(setsRegex, '')
            : `style-dictionary/${tokenSetType}.css`;

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

async function generateDictionaryFiles(tokenSets, sd) {
  let allFiles = [];
  await Promise.all(
    tokenSets.map(async function (tokenSet) {
      const themeDictionary = await sd.extend(getDictionaryConfig(tokenSet));
      const files = await themeDictionary.formatPlatform('css');
      allFiles = allFiles.concat(files);
    }),
  );

  return allFiles;
}

function getDictionaryConfig(tokenSet) {
  const componentTokensPath = `src/style-dictionary/tokens/components/${tokenSet.name}/**/*.json`;
  const componentFiles = sync(componentTokensPath).map((filePath) =>
    filePath
      .replace(`src/style-dictionary/tokens/components/${tokenSet.name}/`, '')
      .replace('.json', ''),
  );

  const referenceTokensPaths = tokenSet.referenceTokens.map(
    (referenceTokensSet) =>
      `src/style-dictionary/tokens/${referenceTokensSet.path}`,
  );

  return {
    source: [`src/style-dictionary/tokens/${tokenSet.path}`],
    include: [...referenceTokensPaths, componentTokensPath],
    preprocessors: ['tokens-studio'],
    expand: {
      typesMap: expandTypesMap,
    },
    platforms: {
      css: {
        transformGroup: 'tokens-studio',
        transforms: ['name/prefixed-kebab'],
        options: {
          outputReferences: true,
          showFileHeader: false,
          selector: tokenSet.selector,
        },
        buildPath: `dist/style-dictionary/`,
        files: [
          {
            destination: `${tokenSet.name}/${tokenSet.name}.css`,
            format: 'css/variables',
            filter: (token) =>
              filterByFilePath(token, tokenSet.path, `components/`),
          },
          ...tokenSet.referenceTokens.map((referenceTokenSet) => {
            return {
              destination: `${tokenSet.name}/${referenceTokenSet.name}.css`,
              format: 'css/variables',
              options: {
                selector: `${tokenSet.selector}${referenceTokenSet.selector || ''}`,
              },
              filter: (token) =>
                filterByFilePath(token, referenceTokenSet.path, `components/`),
            };
          }),
          ...componentFiles.map((filePath) => {
            return {
              destination: `components/${tokenSet.name}/${filePath}.css`,
              format: 'css/variables',
              filter: (token) =>
                filterByFilePath(token, `${tokenSet.name}/${filePath}`),
            };
          }),
        ],
      },
    },
  };
}

function filterByFilePath(token, filePath, notFilePath) {
  if (notFilePath) {
    return (
      token.filePath.includes(filePath) && !token.filePath.includes(notFilePath)
    );
  }
  return token.filePath.includes(filePath);
}
