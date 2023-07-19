const StyleDictionary = require('style-dictionary');
const { createPropertyFormatter } = StyleDictionary.formatHelpers;

StyleDictionary.registerFormat({
  name: 'css-sky-theme',
  formatter: function({ dictionary, options }) {
    const formatProperty = createPropertyFormatter({
      outputReferences: "true",
      dictionary,
      formatting: options.formatting,
      themeable: options.themeable
    });
    return dictionary.allTokens.map(formatProperty).join('\n');
  }
})

StyleDictionary.registerFormat({
  name: 'scss-sky-theme',
  formatter: function({ dictionary, options }) {
    const formatProperty = createPropertyFormatter({
      dictionary,
      formatting: options.formatting,
      themeable: options.themeable
    });
    return dictionary.allTokens.map(formatProperty).join('\n');
  }
})

// Default theme
StyleDictionary.extend({
  source: [
    "./src/sd/tokens/bb.default.json"
  ],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "build/styles/",
      files: [{
        destination: "_custom_properties.scss",
        format: "css-sky-theme",
        options: {
          outputReferences: true,
          formatting: {
            prefix: "--sky-",
            separator: ":",
            suffix: ";"
          }
        }
      }]
    },
    scss: {
      transformGroup: "scss",
      buildPath: "build/scss/",
      files: [{
        destination: "_variables.scss",
        format: "scss-sky-theme",
        options: {
          outputReferences: false,
          formatting: {
            prefix: "$sky-",
            separator: ":",
            suffix: " !default;"
          }
        }
      }]
    },
    rn: {
      transformGroup: "react-native",
      buildPath: "build/rn/",
      files: [
        {
          destination: "variables.js",
          format: "javascript/es6"
        }
      ]
    }

  }
}).buildAllPlatforms();


// Modern theme
StyleDictionary.extend({
  source: [
    "./src/sd/tokens/bb.modern.json"
  ],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "build/styles/theme/modern/",
      files: [{
        destination: "_custom_properties.scss",
        format: "css-sky-theme",
        options: {
          outputReferences: true,
          formatting: {
            prefix: "--sky-",
            separator: ":",
            suffix: ";"
          }
        }
      }]
    },
    scss: {
      transformGroup: "scss",
      buildPath: "build/scss/theme/modern/",
      files: [{
        destination: "_variables.scss",
        format: "scss-sky-theme",
        options: {
          outputReferences: false,
          formatting: {
            prefix: "$sky-theme-modern-",
            separator: ":",
            suffix: " !default;"
          }
        }
      }]
    },
    rn: {
      transformGroup: "react-native",
      buildPath: "build/rn/theme/modern/",
      files: [
        {
          destination: "variables.js",
          format: "javascript/es6"
        }
      ]
    }
  }
}).buildAllPlatforms();
