const StyleDictionary = require('style-dictionary-utils');
const { formattedVariables } = StyleDictionary.formatHelpers;

const modes = [`light`,`dark`,`compact`];

// StyleDictionary.registerFormat({
//   name: 'figmaW3c',
//   formatter: function({ dictionary, options }) {
//     return formattedVariables({
//       dictionary,
//       outputReferences: options.outputReferences,
//       formatting: {
//         suffix: 'end'
//       }
//     });
//   }
// });

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
        destination: "_custom_properties.css",
        format: "css/variables",
        options: {
          outputReferences: true,
        }
      }]
    },
    figma: {
      buildPath: "build-w3c/styles/",
      files: [{
        destination: "figma.json",
        format: "json/nested",
        options: {
          filter: function(token) {
            return token.type === "color";
          },
        }
      }]
    }
  }
}).buildAllPlatforms();

// Dark mode
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
        destination: "_custom_properties_dark.css",
        format: "css/variables",
        options: {
          outputReferences: false,
          selector: ":root .sky-theme-mode-dark"
        }
      }]
    }
  }
}).buildAllPlatforms();

// Compact mode
StyleDictionary.extend({
  include: [
    // this is the same as the source in light/default above
    `./src/sd/tokens/bb/**/!(*.${modes.join(`|*.`)}).json`
  ],
  source: [
    // Kind of the opposite of above, this will find any files
    // that have the file extension .dark.json
    `./src/sd/tokens/bb/**/*.compact.json`
  ],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "build-w3c/styles/",
      files: [{
        filter: "isSource",
        destination: "_custom_properties_compact.css",
        format: "css/variables",
        options: {
          outputReferences: true,
          selector: ":root .sky-theme-mode-compact"
        }
      }]
    }
  }
}).buildAllPlatforms();
