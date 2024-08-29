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
        let localTokens = '';
        register(StyleDictionary);
        const sd = new StyleDictionary();

        const allFiles = await generateDictionaryFiles(tokenSets, sd);

        for (let file of allFiles) {
          localTokens = localTokens.concat(`.local-dev-tokens${file.output}`);
        }

        return localTokens;
      }
    },
    async generateBundle() {
      const allThemes = tokenSets.map((set) => set.name);
      register(StyleDictionary);
      const sd = new StyleDictionary();

      const compositeStyleFiles = {};

      const allFiles = await generateDictionaryFiles(tokenSets, sd);

      for (let file of allFiles) {
        if (file.destination.includes('components/')) {
          let fileName = file.destination;
          for (let themeName of allThemes) {
            fileName = fileName.replace(`${themeName}/`, '');
          }

          let fileContents = compositeStyleFiles[fileName] || '';
          fileContents = fileContents.concat(file.output);

          compositeStyleFiles[fileName] = fileContents;
        } else {
          this.emitFile({
            type: 'asset',
            fileName: file.destination.replace('dist/', ''),
            source: file.output || '',
          });
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

  return {
    source: [
      `src/style-dictionary/tokens/base-blackbaud.json`,
      `src/style-dictionary/tokens/${tokenSet.path}`,
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
              filterByFilePath(token, tokenSet.path, `components/`),
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
