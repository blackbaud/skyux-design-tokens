var yamlParse = require('js-yaml');
var path = require('path');
var fs = require('fs-extra');

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
          scssResult += buildProperty(nestedName, sassObject[key].join(' '))
        } else if (typeof sassObject[key] === 'object') {
          scssResult += parseSassObject(sassObject[key], nestedName);
        } else {
          scssResult += buildProperty(nestedName, sassObject[key]);
        }
      } else {
        scssResult += buildProperty(nestedName, sassObject[key])
      }
    }
  }

  return scssResult;
}

function generateOutputFiles(prefix, yamlPath, yamlOutputPath, jsonOutputPath) {
  const yamlTokens = fs.readFileSync(path.resolve(__dirname, yamlPath), 'utf8');

  if (yamlTokens.indexOf('\t') > -1) {
    throw new Error(
  `Looks like your YAML file is using the "tab" key for spaces.
  This causes problems with the parsing library we use.  Please use spaces.
  `);
  }

  const jsonTokens = yamlParse.safeLoad(yamlTokens);

  const scssResult = parseSassObject(jsonTokens, prefix);

  fs.outputFileSync(path.resolve(__dirname, yamlOutputPath), scssResult);

  fs.outputFileSync(
    path.resolve(__dirname, jsonOutputPath),
    JSON.stringify(jsonTokens, null, 2)
  );
}

generateOutputFiles(
  '$sky',
  'design-tokens.yaml',
  '../dist/scss/variables.scss',
  '../dist/json/design-tokens.json'
);

generateOutputFiles(
  '$sky-theme-modern',
  'themes/modern/design-tokens.yaml',
  '../dist/scss/themes/modern/variables.scss',
  '../dist/json/themes/modern/design-tokens.json'
);

fs.copySync(
  path.resolve(__dirname, 'scss/mixins.scss'),
  path.resolve(__dirname, '../dist/scss/mixins.scss')
);

fs.copySync(
  path.resolve(__dirname, 'design-tokens.yaml'),
  path.resolve(__dirname, '../dist/yaml/design-tokens.yaml')
);

fs.copySync(
  path.resolve(__dirname, 'themes/modern/design-tokens.yaml'),
  path.resolve(__dirname, '../dist/yaml/themes/modern/design-tokens.yaml')
);

console.log('Success.');
