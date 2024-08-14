import { sync } from 'glob';
import StyleDictionary from 'style-dictionary';
import { expandTypesMap, register } from '@tokens-studio/sd-transforms';
import { tokenSets } from './token-sets.mjs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

register(StyleDictionary);
const sd = new StyleDictionary({}, { verbosity: 'verbose' });

// await sd.buildAllPlatforms();
await createStyleDictionaries();

await createCompositeComponentFiles();

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

async function createStyleDictionaries() {
  await Promise.all(
    tokenSets.map(async function (tokenSet) {
      const themeDictionary = await sd.extend(
        getStyleDictionaryConfig(tokenSet),
      );
      // await themeDictionary.buildAllPlatforms();
      const files = await themeDictionary.formatPlatform('css');
      console.log(platform);

      for (let file of files) {
      }
    }),
  );
}

async function createCompositeComponentFiles() {
  // modern theme will definitely have tokens for every component, so this gets an exhaustive list of components
  const modernTokensPath = `dist/style-dictionary/components/modern/**/*.css`;
  const componentFiles = sync(modernTokensPath).map((filePath) =>
    filePath.replace(`dist/style-dictionary/components/modern/`, ''),
  );

  componentFiles.forEach(async (filePath) => {
    let fileContents = '';
    await Promise.all(
      tokenSets.map(async (tokenSet) => {
        const themeFilePath = `dist/style-dictionary/components/${tokenSet.name}/${filePath}`;
        await readFile(themeFilePath)
          .then((data) => {
            fileContents += data.toString();
            fileContents += '\n';
          })
          .catch(() => {});
      }),
    );

    const destination = `dist/style-dictionary/components/composite/${filePath}`;
    const pathParts = destination.split('/');
    pathParts.pop();
    const directory = pathParts.join('/');

    await mkdir(directory, { recursive: true });
    await writeFile(destination, fileContents);
  });
}

function filterByFilePath(token, filePath, notFilePath) {
  if (notFilePath) {
    return (
      token.filePath.includes(filePath) && !token.filePath.includes(notFilePath)
    );
  }
  return token.filePath.includes(filePath);
}
