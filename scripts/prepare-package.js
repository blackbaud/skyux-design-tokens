/* jshint node: true */

'use strict';

var fs = require('fs-extra');
var path = require('path');

var rootPath = path.join(__dirname, '..');
var distPath = path.join(rootPath, 'dist');

function makePackageFileForDist() {
  var packageJson = fs.readJSONSync(path.join(rootPath, 'package.json'));

  fs.writeJSONSync(path.join(distPath, 'package.json'), packageJson);
}

function copyFilesToDist() {
  fs.copySync(path.join(rootPath, 'README.md'), path.join(distPath, 'README.md'));
  fs.copySync(path.join(rootPath, 'CHANGELOG.md'), path.join(distPath, 'CHANGELOG.md'));
}

makePackageFileForDist();
copyFilesToDist();

