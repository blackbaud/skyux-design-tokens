import { sync } from 'glob';
import StyleDictionary from 'style-dictionary';
import { expandTypesMap, register } from '@tokens-studio/sd-transforms';
import { tokenSets } from '../src/style-dictionary/token-sets.mjs';

export function buildStyleDictionaryPlugin() {
  return {
    name: 'transform-style-dictionary',
    async generateBundle() {
      const allThemes = tokenSets.map((set) => set.name);
      register(StyleDictionary);
      const sd = new StyleDictionary();

      let allFiles = [];
      const compositeStyleFiles = {};

      await Promise.all(
        tokenSets.map(async function (tokenSet) {
          const themeDictionary = await sd.extend(
            getStyleDictionaryConfig(tokenSet),
          );
          const files = await themeDictionary.formatPlatform('css');
          allFiles = allFiles.concat(files);
        }),
      );

      for (let file of allFiles) {
        this.emitFile({
          type: 'asset',
          fileName: file.destination.replace('dist/', ''),
          source: file.output,
        });

        if (file.destination.includes('components/')) {
          let fileName = file.destination;
          for (let themeName of allThemes) {
            fileName = fileName.replace(themeName, 'composite');
          }

          let fileContents = compositeStyleFiles[fileName] || '';
          fileContents = fileContents.concat(file.output);

          compositeStyleFiles[fileName] = fileContents;
        }
      }

      for (let fileName of Object.keys(compositeStyleFiles)) {
        const fileContents = compositeStyleFiles[fileName];
        this.emitFile({
          type: 'asset',
          fileName: fileName.replace('dist/', ''),
          source: fileContents,
        });
      }
    },
  };
}

function getStyleDictionaryConfig(tokenSet) {
  const componentTokensPath = `src/style-dictionary/tokens/components/${tokenSet.name}/**/*.json`;
  const componentFiles = sync(componentTokensPath).map((filePath) =>
    filePath
      .replace(`src/style-dictionary/tokens/components/${tokenSet.name}/`, '')
      .replace('.json', ''),
  );

  return {
    source: [
      `src/style-dictionary/tokens/base.json`,
      `src/style-dictionary/tokens/${tokenSet.name}.json`,
      componentTokensPath,
    ],
    preprocessors: ['tokens-studio'],
    expand: {
      typesMap: expandTypesMap,
    },
    platforms: {
      css: {
        transformGroup: 'tokens-studio',
        transforms: ['name/kebab'],
        prefix: 'sky',
        options: {
          outputReferences: true,
          showFileHeader: false,
          selector: tokenSet.selector,
        },
        buildPath: `dist/style-dictionary/`,
        files: [
          {
            destination: `${tokenSet.name}.css`,
            format: 'css/variables',
            filter: (token) =>
              filterByFilePath(token, tokenSet.name, `components/`),
          },
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
