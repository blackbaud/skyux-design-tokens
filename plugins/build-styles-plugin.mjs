import fs from 'fs-extra';
import path from 'node:path';
import yamlParse from 'js-yaml';

function generateOutputFiles(prefix, yamlPath) {
  const yamlTokens = fs.readFileSync(path.resolve(__dirname, yamlPath), 'utf8');

  if (yamlTokens.indexOf('\t') > -1) {
    throw new Error(
      `Looks like your YAML file is using the "tab" key for spaces.
  This causes problems with the parsing library we use.  Please use spaces.
  `,
    );
  }

  const jsonOutput = yamlParse.safeLoad(yamlTokens);

  const scssOutput = parseSassObject(jsonOutput, prefix);

  return { jsonOutput, scssOutput };
}

function readFileContent(filePath) {
  return fs.readFileSync(path.resolve(__dirname, filePath), 'utf8');
}

function buildProperty(name, value) {
  let quotedValue;

  // Put URLs or other values that contain colons in quotes.
  if (value.indexOf(':') >= 0) {
    quotedValue = `"${value.replace(/\"/g, '\\"')}"`;
  }

  return `${name}: ${quotedValue || value} !default;\n`;
}

function parseSassObject(sassObject, prefix) {
  let scssResult = '';

  for (var key in sassObject) {
    if (sassObject.hasOwnProperty(key)) {
      const nestedName = prefix + '-' + key;

      if (sassObject[key] !== null) {
        if (Array.isArray(sassObject[key])) {
          scssResult += buildProperty(nestedName, sassObject[key].join(' '));
        } else if (typeof sassObject[key] === 'object') {
          scssResult += parseSassObject(sassObject[key], nestedName);
        } else {
          scssResult += buildProperty(nestedName, sassObject[key]);
        }
      } else {
        scssResult += buildProperty(nestedName, sassObject[key]);
      }
    }
  }

  return scssResult;
}

export function buildStylesPlugin() {
  return {
    name: 'transform-styles',
    async generateBundle() {
      const defaultTokens = generateOutputFiles(
        '$sky',
        '../src/design-tokens.yaml',
      );
      const defaultJsonOutput = defaultTokens.jsonOutput;
      const defaultScssOutput = defaultTokens.scssOutput;

      const modernTokens = generateOutputFiles(
        '$sky-theme-modern',
        '../src/themes/modern/design-tokens.yaml',
      );
      const modernJsonOutput = modernTokens.jsonOutput;
      const modernScssOutput = modernTokens.scssOutput;

      this.emitFile({
        type: 'asset',
        fileName: 'json/design-tokens.json',
        source: JSON.stringify(defaultJsonOutput),
      });

      this.emitFile({
        type: 'asset',
        fileName: 'scss/variables.scss',
        source: defaultScssOutput,
      });

      this.emitFile({
        type: 'asset',
        fileName: 'json/themes/modern/design-tokens.json',
        source: JSON.stringify(modernJsonOutput),
      });

      this.emitFile({
        type: 'asset',
        fileName: 'scss/themes/modern/variables.scss',
        source: modernScssOutput,
      });

      const mixins = readFileContent('../src/scss/mixins.scss');
      this.emitFile({
        type: 'asset',
        fileName: 'scss/mixins.scss',
        source: mixins,
      });

      const defaultYamlTokens = readFileContent('../src/design-tokens.yaml');
      this.emitFile({
        type: 'asset',
        fileName: 'yaml/design-tokens.yaml',
        source: defaultYamlTokens,
      });

      const modernYamlTokens = readFileContent(
        '../src/themes/modern/design-tokens.yaml',
      );
      this.emitFile({
        type: 'asset',
        fileName: 'yaml/themes/modern/design-tokens.yaml',
        source: modernYamlTokens,
      });
    },
  };
}
