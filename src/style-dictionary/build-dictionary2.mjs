
import { sync } from 'glob';
import StyleDictionary from 'style-dictionary';
import { expandTypesMap, register } from '@tokens-studio/sd-transforms';
import { tokenSets } from './token-sets.mjs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

register(StyleDictionary);

StyleDictionary.registerTransform({
  name: 'name/kebab-with-type',
  type: 'name',
  transitive: true,
  transform: function(token, config) {
    console.log(token);
    const attributes = Object.values(token.attributes).join('-');
    return `${config.prefix}-${token.type}-${attributes}`;
  }
});

const sd = new StyleDictionary({
  source: ['src/style-dictionary/tokens2/**/*.json'],
  preprocessors: ['tokens-studio'],
  expand: {
    typesMap: expandTypesMap,
  },
  platforms: {
    css: {
      transformGroup: 'tokens-studio',
      options: {
        outputReferences: true,
        showFileHeader: false
      },
      prefix: 'sky',
      transforms: ['name/kebab-with-type'],
      buildPath: 'build/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
        },
      ],
    },
  },
});

await sd.buildAllPlatforms();
// await createStyleDictionaries();

// await createCompositeComponentFiles();

// function getStyleDictionaryConfig(tokenSet) {
//   const componentTokensPath = `src/style-dictionary/tokens/aliases/${tokenSet.path}/components/**/*.json`;
//   const componentFiles = sync(componentTokensPath)
//     .map((filePath) => filePath.replace(`src/style-dictionary/tokens/aliases/${tokenSet.path}/`, '').replace('.json', ''));


//   return {
//     source: [`src/style-dictionary/tokens/base/**/*.json`, `src/style-dictionary/tokens/aliases/${tokenSet.path}/**/*.json`],
//     platforms: {
//       web: {
//         transformGroup: 'css',
//         options: {
//           outputReferences: true,
//           showFileHeader: false,
//           selector: tokenSet.selector,
//         },
//         prefix: 'sky',
//         buildPath: `dist/style-dictionary/${tokenSet.name}/`,
//         files: [
//           {
//             destination: 'base.css',
//             format: 'css/variables',
//             filter: (token) => filterByFilePath(token, 'base'),
//           },
//           {
//             destination: `${tokenSet.name}.css`,
//             format: 'css/variables',
//             filter: (token) => filterByFilePath(token, tokenSet.path, `${tokenSet.path}/components/`),
//           },
//           ...componentFiles.map((filePath) => {
//             return {
//               destination: `${filePath}.css`,
//               format: 'css/variables',
//               filter: (token) => filterByFilePath(token, `${tokenSet.path}/${filePath}`)
//             };
//           })
//         ],
//       }
//     }
//   };
// }

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
