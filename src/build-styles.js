var yamlParse = require('js-yaml');
var path = require('path');
var fs = require('fs-extra');

function buildProperty(name, value) {
  scssResult += `${name}: ${value} !default;\n`;
}

function parseSassObject(sassObject, prefix) {
  for (var key in sassObject) {
    if (sassObject.hasOwnProperty(key)) {

      const nestedName = prefix + '-' + key;

      if (sassObject[key] !== null) {
        if (Array.isArray(sassObject[key])) {
          buildProperty(nestedName, sassObject[key].join(' '))
        } else if (typeof sassObject[key] === 'object') {
          parseSassObject(sassObject[key], nestedName);
        } else {
          buildProperty(nestedName, sassObject[key]);
        }
      } else {
        buildProperty(nestedName, sassObject[key])
      }
    }
  }
}

const prefix = '$sky';
const yamlTokens = fs.readFileSync(path.resolve(__dirname, 'design-tokens.yaml'), 'utf8');

if (yamlTokens.indexOf('\t') > -1) {
  throw new Error(
`Looks like your YAML file is using the "tab" key for spaces.
This causes problems with the parsing library we use.  Please use spaces.
`);
}

const jsonTokens = yamlParse.safeLoad(yamlTokens);
let scssResult = '';

parseSassObject(jsonTokens, prefix);
console.log('Successfully built.');

fs.outputFileSync(path.resolve(__dirname, '../dist/scss/variables.scss'), scssResult);
fs.copySync(
  path.resolve(__dirname, 'scss/mixins.scss'),
  path.resolve(__dirname, '../dist/scss/mixins.scss')
);
fs.copySync(
  path.resolve(__dirname, 'design-tokens.yaml'),
  path.resolve(__dirname, '../dist/yaml/design-tokens.yaml')
);
fs.outputFileSync(
  path.resolve(__dirname, '../dist/json/design-tokens.json'),
  JSON.stringify(jsonTokens, null, 2)
);
