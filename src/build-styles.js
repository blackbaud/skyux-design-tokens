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

var sassJson
  = yamlParse.safeLoad(fs.readFileSync(path.resolve(__dirname, 'design-tokens.yaml'), 'utf8'));

var prefix = '$sky';

var scssResult = '';

parseSassObject(sassJson, prefix);

fs.outputFileSync(path.resolve(__dirname, '../dist/scss/variables.scss'), scssResult);
