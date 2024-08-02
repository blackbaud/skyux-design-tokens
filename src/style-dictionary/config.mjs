import { sync } from 'glob';
import { themePaths } from './themes.mjs';

const componentTokensPath = `src/style-dictionary/tokens/components/**/*.json`;
const componentFiles = sync(componentTokensPath)
  .map((filePath) => filePath.replace('src/style-dictionary/tokens/', '').replace('.json', ''));

const files = ['base', 'modern', ...themePaths, ...componentFiles];

export default {
  source: [`src/style-dictionary/tokens/**/*.json`],
  prefix: 'sky',
  platforms: {
    css: {
      transformGroup: `css`,
      options: {
        outputReferences: true,
        showFileHeader: false
      },
      prefix: 'sky',
      buildPath: `dist/style-dictionary/`,
      files: files.map((filePath) => {
        return {
          destination: `${filePath}.scss`,
          format: `css/variables`,
          filter: (token) => {
            return token.filePath.includes(filePath)
          },
        };
      }),
      actions: ['updateGeneratedFiles'],
    },
  },
};
