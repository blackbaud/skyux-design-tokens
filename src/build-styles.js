var yamlParse = require('js-yaml');
var path = require('path');
var fs = require('fs-extra');

function parseSassObject(sassObject, prefix) {
  for (var key in sassObject) {
    if (sassObject.hasOwnProperty(key)) {
      var nestedName = prefix + '-' + key;
      if (sassObject[key] !== null && typeof sassObject[key] === 'object') {
        parseSassObject(sassObject[key], nestedName);
      } else {
        scssResult += nestedName + ': ' + sassObject[key] + ' !default;\n';
      }
    }
  }
}

var jsonTokens
  = yamlParse.safeLoad(fs.readFileSync(path.resolve(__dirname, 'design-tokens.yaml'), 'utf8'));

var prefix = '$sky';

var scssResult = '';
parseSassObject(jsonTokens, prefix);

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
