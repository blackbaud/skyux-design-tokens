const StyleDictionary = require('style-dictionary-utils');

const myStyleDictionary = StyleDictionary.extend({
  source: [
    "./src/sd/tokens/w3c/**/*.json"
  ],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "build-w3c/styles/",
      files: [{
        filter: "isSource",
        destination: "_custom_properties.scss",
        format: "css/variables",
      }]
    }
  }
});

myStyleDictionary.buildAllPlatforms();
