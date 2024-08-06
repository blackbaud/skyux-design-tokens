
import { sync } from 'glob';
import StyleDictionary from 'style-dictionary';
import { expandTypesMap, register } from '@tokens-studio/sd-transforms';
import { tokenSets } from './token-sets.mjs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

register(StyleDictionary);
const sd = new StyleDictionary();

StyleDictionary.registerTransform({
  name: 'name/kebab-with-type',
  type: 'name',
  transitive: true,
  transform: function(token, config) {
    const attributes = Object.values(token.attributes).join('-');
    return `${config.prefix}-${token.$extensions?.['studio.tokens'].originalType || token.type}-${attributes}`;
  }
});

await sd.buildAllPlatforms();
await createStyleDictionaries();

// await createCompositeComponentFiles();

function getStyleDictionaryConfig(tokenSet) {
  const componentTokensPath = `src/style-dictionary/tokens/components/${tokenSet.name}/**/*.json`;
  const componentFiles = sync(componentTokensPath)
    .map((filePath) => filePath.replace(`src/style-dictionary/tokens/components/${tokenSet.name}/`, '').replace('.json', ''));


  return {
    source: [`src/style-dictionary/tokens/base.json`, `src/style-dictionary/tokens/${tokenSet.name}.json`],
    preprocessors: ['tokens-studio'],
    expand: {
      typesMap: expandTypesMap,
    },
    platforms: {
      css: {
        transformGroup: 'tokens-studio',
        transforms: ['name/kebab-with-type'],
        options: {
          outputReferences: true,
          showFileHeader: false,
          selector: tokenSet.selector,
        },
        prefix: 'sky',
        buildPath: `dist/style-dictionary/`,
        files: [
          {
            destination: `${tokenSet.name}.css`,
            format: 'css/variables',
            filter: (token) => filterByFilePath(token, tokenSet.name, `components/`),
          },
          ...componentFiles.map((filePath) => {
            return {
              destination: `${filePath}.css`,
              format: 'css/variables',
              filter: (token) => filterByFilePath(token, `${filePath}/${tokenSet.path}`)
            };
          })
        ],
      }
    }
  };
}

async function createStyleDictionaries() {
  await Promise.all(tokenSets.map(async function (tokenSet) {
    const themeDictionary = await sd.extend(getStyleDictionaryConfig(tokenSet));
    await themeDictionary.buildAllPlatforms();
  }));
}

async function createCompositeComponentFiles() {
  // modern theme will definitely have tokens for every component, so this gets an exhaustive list of components
  const modernTokensPath = `dist/style-dictionary/modern/components/**/*.css`;
  const componentFiles = sync(modernTokensPath).map((filePath) =>
    filePath.replace(`dist/style-dictionary/modern/`, ''),
  );

  componentFiles.forEach(async (filePath) => {
    let fileContents = '';
    await Promise.all(tokenSets.map(async (tokenSet) => {
      const themeFilePath = `dist/style-dictionary/${tokenSet.name}/${filePath}`;
      await readFile(themeFilePath)
        .then((data) => {
          fileContents += data.toString();
          fileContents += '\n';
        })
        .catch(() => {});
    }));

    const destination = `dist/style-dictionary/${filePath}`;
    const pathParts = destination.split('/');
    pathParts.pop();
    const directory = pathParts.join('/');

    await mkdir(directory, { recursive: true });
    await writeFile(destination, fileContents);
  });
}

function filterByFilePath(token, filePath, notFilePath) {
  if (notFilePath) {
    return token.filePath.includes(filePath) && !token.filePath.includes(notFilePath);
  }
  return token.filePath.includes(filePath);
}
