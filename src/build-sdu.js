const StyleDictionary = require('style-dictionary-utils');
const modes = [`light`,`dark`];

StyleDictionary.extend({
  source: [
    // this is saying find any files in the tokens folder
    // that does not have .dark or .light, but ends in .json
    `./src/sd/tokens/bb/**/!(*.${modes.join(`|*.`)}).json`
  ],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "build-w3c/styles/",
      files: [{
        destination: "_custom_properties.scss",
        format: "css/variables",
        options: {
          outputReferences: true
        }
      }]
    }
  }
}).buildAllPlatforms();

StyleDictionary.extend({
  include: [
    // this is the same as the source in light/default above
    `./src/sd/tokens/bb/**/!(*.${modes.join(`|*.`)}).json`
  ],
  source: [
    // Kind of the opposite of above, this will find any files
    // that have the file extension .dark.json
    `./src/sd/tokens/bb/**/*.dark.json`
  ],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "build-w3c/styles/",
      files: [{
        filter: "isSource",
        destination: "_custom_properties_dark.scss",
        format: "css/variables",
        options: {
          outputReferences: true,
          selector: ":root .sky-theme-mode-dark"
        }
      }]
    }
  }
}).buildAllPlatforms();
