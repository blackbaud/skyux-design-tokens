// vite.config.js
import path4 from "path";
import { defineConfig, loadEnv } from "file:///Users/Erika.McVey/git/skyux-design-tokens/node_modules/vite/dist/node/index.js";

// plugins/build-styles-plugin.cjs
import fs from "file:///Users/Erika.McVey/git/skyux-design-tokens/node_modules/fs-extra/lib/index.js";
import path from "node:path";
import yamlParse from "file:///Users/Erika.McVey/git/skyux-design-tokens/node_modules/js-yaml/index.js";
var __vite_injected_original_dirname = "/Users/Erika.McVey/git/skyux-design-tokens/plugins";
function buildStylesPlugin() {
  return {
    name: "transform-styles",
    async generateBundle() {
      const defaultTokens = generateOutputFiles(
        "$sky",
        "../src/design-tokens.yaml"
      );
      const defaultJsonOutput = defaultTokens.jsonOutput;
      const defaultScssOutput = defaultTokens.scssOutput;
      const modernTokens = generateOutputFiles(
        "$sky-theme-modern",
        "../src/themes/modern/design-tokens.yaml"
      );
      const modernJsonOutput = modernTokens.jsonOutput;
      const modernScssOutput = modernTokens.scssOutput;
      this.emitFile({
        type: "asset",
        fileName: "json/design-tokens.json",
        source: JSON.stringify(defaultJsonOutput)
      });
      this.emitFile({
        type: "asset",
        fileName: "scss/variables.scss",
        source: defaultScssOutput
      });
      this.emitFile({
        type: "asset",
        fileName: "json/themes/modern/design-tokens.json",
        source: JSON.stringify(modernJsonOutput)
      });
      this.emitFile({
        type: "asset",
        fileName: "scss/themes/modern/variables.scss",
        source: modernScssOutput
      });
      const mixins = readFileContent("../src/scss/mixins.scss");
      this.emitFile({
        type: "asset",
        fileName: "scss/mixins.scss",
        source: mixins
      });
      const defaultYamlTokens = readFileContent("../src/design-tokens.yaml");
      this.emitFile({
        type: "asset",
        fileName: "yaml/design-tokens.yaml",
        source: defaultYamlTokens
      });
      const modernYamlTokens = readFileContent(
        "../src/themes/modern/design-tokens.yaml"
      );
      this.emitFile({
        type: "asset",
        fileName: "yaml/themes/modern/design-tokens.yaml",
        source: modernYamlTokens
      });
    }
  };
}
function generateOutputFiles(prefix, yamlPath) {
  const yamlTokens = fs.readFileSync(path.resolve(__vite_injected_original_dirname, yamlPath), "utf8");
  if (yamlTokens.indexOf("	") > -1) {
    throw new Error(
      `Looks like your YAML file is using the "tab" key for spaces.
  This causes problems with the parsing library we use.  Please use spaces.
  `
    );
  }
  const jsonOutput = yamlParse.safeLoad(yamlTokens);
  const scssOutput = parseSassObject(jsonOutput, prefix);
  return { jsonOutput, scssOutput };
}
function readFileContent(filePath) {
  return fs.readFileSync(path.resolve(__vite_injected_original_dirname, filePath), "utf8");
}
function buildProperty(name, value) {
  let quotedValue;
  if (value.indexOf(":") >= 0) {
    quotedValue = `"${value.replace(/\"/g, '\\"')}"`;
  }
  return `${name}: ${quotedValue || value} !default;
`;
}
function parseSassObject(sassObject, prefix) {
  let scssResult = "";
  for (var key in sassObject) {
    if (sassObject.hasOwnProperty(key)) {
      const nestedName = prefix + "-" + key;
      if (sassObject[key] !== null) {
        if (Array.isArray(sassObject[key])) {
          scssResult += buildProperty(nestedName, sassObject[key].join(" "));
        } else if (typeof sassObject[key] === "object") {
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

// plugins/build-style-dictionary-plugin.cjs
import { sync } from "file:///Users/Erika.McVey/git/skyux-design-tokens/node_modules/glob/dist/esm/index.js";
import path2 from "path";
import StyleDictionary from "file:///Users/Erika.McVey/git/skyux-design-tokens/node_modules/style-dictionary/lib/StyleDictionary.js";
import { expandTypesMap, register } from "file:///Users/Erika.McVey/git/skyux-design-tokens/node_modules/@tokens-studio/sd-transforms/dist/index.js";

// src/style-dictionary/token-sets.mjs
var tokenSets = [
  {
    name: "modern",
    path: "base-modern.json",
    selector: ".sky-theme-modern",
    outputPath: "modern.css",
    referenceTokens: [
      {
        name: "modern-colors",
        path: "color/modern.json"
      },
      {
        name: "modern-layout",
        path: "layout/modern.json"
      }
    ]
  },
  {
    name: "blackbaud",
    path: "base-blackbaud.json",
    selector: ".sky-theme-modern.sky-theme-brand-blackbaud",
    outputPath: "blackbaud.css",
    referenceTokens: [
      {
        name: "bb-light",
        path: "color/bb-light.json"
      },
      {
        name: "bb-dark",
        selector: ".sky-theme-mode-dark",
        path: "color/bb-dark.json"
      },
      {
        name: "bb-productive",
        path: "layout/bb-productive.json"
      },
      {
        name: "bb-compact",
        selector: ".sky-theme-mode-compact",
        path: "layout/bb-compact.json"
      },
      {
        name: "bb-spacious",
        selector: ".sky-theme-mode-spacious",
        path: "layout/bb-spacious.json"
      }
    ]
  }
];

// plugins/build-style-dictionary-plugin.cjs
function buildStyleDictionaryPlugin() {
  return {
    name: "transform-style-dictionary",
    async transform(code, id) {
      const files = sync("src/style-dictionary/tokens/**/*.json");
      for (let file of files) {
        this.addWatchFile(path2.join(process.cwd(), file));
      }
      if (id.includes("src/dev/tokens.css")) {
        let localTokens = "";
        register(StyleDictionary);
        const sd = new StyleDictionary(void 0, { verbosity: "verbose" });
        const allFiles = await generateDictionaryFiles(tokenSets, sd);
        for (let file of allFiles) {
          localTokens = localTokens.concat(`.local-dev-tokens${file.output}`);
        }
        return localTokens;
      }
    },
    async generateBundle() {
      register(StyleDictionary);
      StyleDictionary.registerTransform({
        name: "name/prefixed-kebab",
        type: "name",
        transform: (token) => {
          return `${token.isSource ? "" : "texas-"}${token.path.join("-")}`;
        }
      });
      const allSets = tokenSets.map((set) => set.name);
      const sd = new StyleDictionary(void 0, { verbosity: "verbose" });
      const compositeStyleFiles = {};
      const allFiles = await generateDictionaryFiles(tokenSets, sd);
      for (let file of allFiles) {
        if (file.destination.includes("components/")) {
          console.log(file);
          let fileName = file.destination;
          for (let setName of allSets) {
            fileName = fileName.replace(`${setName}/`, "");
          }
          let fileContents = compositeStyleFiles[fileName] || "";
          fileContents = fileContents.concat(file.output);
          compositeStyleFiles[fileName] = fileContents;
        } else {
          this.emitFile({
            type: "asset",
            fileName: file.destination.replace("dist/", ""),
            source: file.output || ""
          });
        }
      }
      for (let fileName of Object.keys(compositeStyleFiles)) {
        const fileContents = compositeStyleFiles[fileName];
        this.emitFile({
          type: "asset",
          fileName: fileName.replace("dist/", ""),
          source: fileContents
        });
      }
    }
  };
}
async function generateDictionaryFiles(tokenSets2, sd) {
  let allFiles = [];
  await Promise.all(
    tokenSets2.map(async function(tokenSet) {
      const themeDictionary = await sd.extend(getDictionaryConfig(tokenSet));
      const files = await themeDictionary.formatPlatform("css");
      allFiles = allFiles.concat(files);
    })
  );
  return allFiles;
}
function getDictionaryConfig(tokenSet) {
  const componentTokensPath = `src/style-dictionary/tokens/components/${tokenSet.name}/**/*.json`;
  const componentFiles = sync(componentTokensPath).map(
    (filePath) => filePath.replace(`src/style-dictionary/tokens/components/${tokenSet.name}/`, "").replace(".json", "")
  );
  const referenceTokensPaths = tokenSet.referenceTokens.map(
    (referenceTokensSet) => `src/style-dictionary/tokens/${referenceTokensSet.path}`
  );
  return {
    source: [`src/style-dictionary/tokens/${tokenSet.path}`],
    include: [...referenceTokensPaths, componentTokensPath],
    preprocessors: ["tokens-studio"],
    expand: {
      typesMap: expandTypesMap
    },
    platforms: {
      css: {
        transformGroup: "tokens-studio",
        transforms: ["name/prefixed-kebab"],
        options: {
          outputReferences: true,
          showFileHeader: false,
          selector: tokenSet.selector
        },
        buildPath: `dist/style-dictionary/`,
        files: [
          {
            destination: `${tokenSet.name}/${tokenSet.name}.css`,
            format: "css/variables",
            filter: (token) => filterByFilePath(token, tokenSet.path, `components/`)
          },
          ...tokenSet.referenceTokens.map((referenceTokenSet) => {
            return {
              destination: `${tokenSet.name}/${referenceTokenSet.name}.css`,
              format: "css/variables",
              options: {
                selector: `${tokenSet.selector}${referenceTokenSet.selector || ""}`
              },
              filter: (token) => filterByFilePath(token, referenceTokenSet.path, `components/`)
            };
          }),
          ...componentFiles.map((filePath) => {
            return {
              destination: `components/${tokenSet.name}/${filePath}.css`,
              format: "css/variables",
              filter: (token) => filterByFilePath(token, `${tokenSet.name}/${filePath}`)
            };
          })
        ]
      }
    }
  };
}
function filterByFilePath(token, filePath, notFilePath) {
  if (token.filePath.includes("component")) {
    console.log(token.filePath);
    console.log(token.filePath.includes(filePath));
    console.log(token);
  }
  if (notFilePath) {
    return token.filePath.includes(filePath) && !token.filePath.includes(notFilePath);
  }
  return token.filePath.includes(filePath);
}

// plugins/prepare-package-plugin.cjs
import fs2 from "file:///Users/Erika.McVey/git/skyux-design-tokens/node_modules/fs-extra/lib/index.js";
import path3 from "node:path";
var __vite_injected_original_dirname2 = "/Users/Erika.McVey/git/skyux-design-tokens/plugins";
function preparePackagePlugin() {
  const rootPath = path3.join(__vite_injected_original_dirname2, "..");
  return {
    name: "transform-package",
    async generateBundle() {
      const packageJson = fs2.readFileSync(path3.join(rootPath, "package.json"));
      const readMe = fs2.readFileSync(path3.join(rootPath, "README.md"));
      const changelog = fs2.readFileSync(path3.join(rootPath, "CHANGELOG.md"));
      this.emitFile({
        type: "asset",
        fileName: "package.json",
        source: packageJson
      });
      this.emitFile({
        type: "asset",
        fileName: "README.md",
        source: readMe
      });
      this.emitFile({
        type: "asset",
        fileName: "CHANGELOG.md",
        source: changelog
      });
    }
  };
}

// vite.config.js
var __vite_injected_original_dirname3 = "/Users/Erika.McVey/git/skyux-design-tokens";
var vite_config_default = ({ mode }) => {
  const viteEnv = loadEnv(mode, process.cwd());
  return defineConfig({
    build: {
      lib: {
        entry: path4.resolve(__vite_injected_original_dirname3, "src/dev/main.ts"),
        name: "SkyuxDesignTokens",
        fileName() {
          return `bundles/design-tokens.global.min.js`;
        },
        formats: ["es"]
      }
    },
    preview: {
      open: true
    },
    server: {
      https: viteEnv.VITE_DEV_CERT ? {
        cert: viteEnv.VITE_DEV_CERT,
        key: viteEnv.VITE_DEV_KEY
      } : void 0,
      open: true
    },
    plugins: [
      buildStylesPlugin(),
      buildStyleDictionaryPlugin(),
      preparePackagePlugin()
    ]
  });
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAicGx1Z2lucy9idWlsZC1zdHlsZXMtcGx1Z2luLmNqcyIsICJwbHVnaW5zL2J1aWxkLXN0eWxlLWRpY3Rpb25hcnktcGx1Z2luLmNqcyIsICJzcmMvc3R5bGUtZGljdGlvbmFyeS90b2tlbi1zZXRzLm1qcyIsICJwbHVnaW5zL3ByZXBhcmUtcGFja2FnZS1wbHVnaW4uY2pzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL0VyaWthLk1jVmV5L2dpdC9za3l1eC1kZXNpZ24tdG9rZW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvRXJpa2EuTWNWZXkvZ2l0L3NreXV4LWRlc2lnbi10b2tlbnMvdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL0VyaWthLk1jVmV5L2dpdC9za3l1eC1kZXNpZ24tdG9rZW5zL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IGJ1aWxkU3R5bGVzUGx1Z2luIH0gZnJvbSAnLi9wbHVnaW5zL2J1aWxkLXN0eWxlcy1wbHVnaW4uY2pzJztcbmltcG9ydCB7IGJ1aWxkU3R5bGVEaWN0aW9uYXJ5UGx1Z2luIH0gZnJvbSAnLi9wbHVnaW5zL2J1aWxkLXN0eWxlLWRpY3Rpb25hcnktcGx1Z2luLmNqcyc7XG5pbXBvcnQgeyBwcmVwYXJlUGFja2FnZVBsdWdpbiB9IGZyb20gJy4vcGx1Z2lucy9wcmVwYXJlLXBhY2thZ2UtcGx1Z2luLmNqcyc7XG5cbmV4cG9ydCBkZWZhdWx0ICh7IG1vZGUgfSkgPT4ge1xuICBjb25zdCB2aXRlRW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpKTtcblxuICByZXR1cm4gZGVmaW5lQ29uZmlnKHtcbiAgICBidWlsZDoge1xuICAgICAgbGliOiB7XG4gICAgICAgIGVudHJ5OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2Rldi9tYWluLnRzJyksXG4gICAgICAgIG5hbWU6ICdTa3l1eERlc2lnblRva2VucycsXG4gICAgICAgIGZpbGVOYW1lKCkge1xuICAgICAgICAgIHJldHVybiBgYnVuZGxlcy9kZXNpZ24tdG9rZW5zLmdsb2JhbC5taW4uanNgO1xuICAgICAgICB9LFxuICAgICAgICBmb3JtYXRzOiBbJ2VzJ10sXG4gICAgICB9LFxuICAgIH0sXG4gICAgcHJldmlldzoge1xuICAgICAgb3BlbjogdHJ1ZSxcbiAgICB9LFxuICAgIHNlcnZlcjoge1xuICAgICAgaHR0cHM6IHZpdGVFbnYuVklURV9ERVZfQ0VSVFxuICAgICAgICA/IHtcbiAgICAgICAgICAgIGNlcnQ6IHZpdGVFbnYuVklURV9ERVZfQ0VSVCxcbiAgICAgICAgICAgIGtleTogdml0ZUVudi5WSVRFX0RFVl9LRVksXG4gICAgICAgICAgfVxuICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgIG9wZW46IHRydWUsXG4gICAgfSxcbiAgICBwbHVnaW5zOiBbXG4gICAgICBidWlsZFN0eWxlc1BsdWdpbigpLFxuICAgICAgYnVpbGRTdHlsZURpY3Rpb25hcnlQbHVnaW4oKSxcbiAgICAgIHByZXBhcmVQYWNrYWdlUGx1Z2luKCksXG4gICAgXSxcbiAgfSk7XG59O1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvRXJpa2EuTWNWZXkvZ2l0L3NreXV4LWRlc2lnbi10b2tlbnMvcGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL0VyaWthLk1jVmV5L2dpdC9za3l1eC1kZXNpZ24tdG9rZW5zL3BsdWdpbnMvYnVpbGQtc3R5bGVzLXBsdWdpbi5janNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL0VyaWthLk1jVmV5L2dpdC9za3l1eC1kZXNpZ24tdG9rZW5zL3BsdWdpbnMvYnVpbGQtc3R5bGVzLXBsdWdpbi5janNcIjtpbXBvcnQgZnMgZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJztcbmltcG9ydCB5YW1sUGFyc2UgZnJvbSAnanMteWFtbCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZFN0eWxlc1BsdWdpbigpIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAndHJhbnNmb3JtLXN0eWxlcycsXG4gICAgYXN5bmMgZ2VuZXJhdGVCdW5kbGUoKSB7XG4gICAgICBjb25zdCBkZWZhdWx0VG9rZW5zID0gZ2VuZXJhdGVPdXRwdXRGaWxlcyhcbiAgICAgICAgJyRza3knLFxuICAgICAgICAnLi4vc3JjL2Rlc2lnbi10b2tlbnMueWFtbCcsXG4gICAgICApO1xuICAgICAgY29uc3QgZGVmYXVsdEpzb25PdXRwdXQgPSBkZWZhdWx0VG9rZW5zLmpzb25PdXRwdXQ7XG4gICAgICBjb25zdCBkZWZhdWx0U2Nzc091dHB1dCA9IGRlZmF1bHRUb2tlbnMuc2Nzc091dHB1dDtcblxuICAgICAgY29uc3QgbW9kZXJuVG9rZW5zID0gZ2VuZXJhdGVPdXRwdXRGaWxlcyhcbiAgICAgICAgJyRza3ktdGhlbWUtbW9kZXJuJyxcbiAgICAgICAgJy4uL3NyYy90aGVtZXMvbW9kZXJuL2Rlc2lnbi10b2tlbnMueWFtbCcsXG4gICAgICApO1xuICAgICAgY29uc3QgbW9kZXJuSnNvbk91dHB1dCA9IG1vZGVyblRva2Vucy5qc29uT3V0cHV0O1xuICAgICAgY29uc3QgbW9kZXJuU2Nzc091dHB1dCA9IG1vZGVyblRva2Vucy5zY3NzT3V0cHV0O1xuXG4gICAgICB0aGlzLmVtaXRGaWxlKHtcbiAgICAgICAgdHlwZTogJ2Fzc2V0JyxcbiAgICAgICAgZmlsZU5hbWU6ICdqc29uL2Rlc2lnbi10b2tlbnMuanNvbicsXG4gICAgICAgIHNvdXJjZTogSlNPTi5zdHJpbmdpZnkoZGVmYXVsdEpzb25PdXRwdXQpLFxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuZW1pdEZpbGUoe1xuICAgICAgICB0eXBlOiAnYXNzZXQnLFxuICAgICAgICBmaWxlTmFtZTogJ3Njc3MvdmFyaWFibGVzLnNjc3MnLFxuICAgICAgICBzb3VyY2U6IGRlZmF1bHRTY3NzT3V0cHV0LFxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuZW1pdEZpbGUoe1xuICAgICAgICB0eXBlOiAnYXNzZXQnLFxuICAgICAgICBmaWxlTmFtZTogJ2pzb24vdGhlbWVzL21vZGVybi9kZXNpZ24tdG9rZW5zLmpzb24nLFxuICAgICAgICBzb3VyY2U6IEpTT04uc3RyaW5naWZ5KG1vZGVybkpzb25PdXRwdXQpLFxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuZW1pdEZpbGUoe1xuICAgICAgICB0eXBlOiAnYXNzZXQnLFxuICAgICAgICBmaWxlTmFtZTogJ3Njc3MvdGhlbWVzL21vZGVybi92YXJpYWJsZXMuc2NzcycsXG4gICAgICAgIHNvdXJjZTogbW9kZXJuU2Nzc091dHB1dCxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBtaXhpbnMgPSByZWFkRmlsZUNvbnRlbnQoJy4uL3NyYy9zY3NzL21peGlucy5zY3NzJyk7XG4gICAgICB0aGlzLmVtaXRGaWxlKHtcbiAgICAgICAgdHlwZTogJ2Fzc2V0JyxcbiAgICAgICAgZmlsZU5hbWU6ICdzY3NzL21peGlucy5zY3NzJyxcbiAgICAgICAgc291cmNlOiBtaXhpbnMsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgZGVmYXVsdFlhbWxUb2tlbnMgPSByZWFkRmlsZUNvbnRlbnQoJy4uL3NyYy9kZXNpZ24tdG9rZW5zLnlhbWwnKTtcbiAgICAgIHRoaXMuZW1pdEZpbGUoe1xuICAgICAgICB0eXBlOiAnYXNzZXQnLFxuICAgICAgICBmaWxlTmFtZTogJ3lhbWwvZGVzaWduLXRva2Vucy55YW1sJyxcbiAgICAgICAgc291cmNlOiBkZWZhdWx0WWFtbFRva2VucyxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBtb2Rlcm5ZYW1sVG9rZW5zID0gcmVhZEZpbGVDb250ZW50KFxuICAgICAgICAnLi4vc3JjL3RoZW1lcy9tb2Rlcm4vZGVzaWduLXRva2Vucy55YW1sJyxcbiAgICAgICk7XG4gICAgICB0aGlzLmVtaXRGaWxlKHtcbiAgICAgICAgdHlwZTogJ2Fzc2V0JyxcbiAgICAgICAgZmlsZU5hbWU6ICd5YW1sL3RoZW1lcy9tb2Rlcm4vZGVzaWduLXRva2Vucy55YW1sJyxcbiAgICAgICAgc291cmNlOiBtb2Rlcm5ZYW1sVG9rZW5zLFxuICAgICAgfSk7XG4gICAgfSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVPdXRwdXRGaWxlcyhwcmVmaXgsIHlhbWxQYXRoKSB7XG4gIGNvbnN0IHlhbWxUb2tlbnMgPSBmcy5yZWFkRmlsZVN5bmMocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgeWFtbFBhdGgpLCAndXRmOCcpO1xuXG4gIGlmICh5YW1sVG9rZW5zLmluZGV4T2YoJ1xcdCcpID4gLTEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgTG9va3MgbGlrZSB5b3VyIFlBTUwgZmlsZSBpcyB1c2luZyB0aGUgXCJ0YWJcIiBrZXkgZm9yIHNwYWNlcy5cbiAgVGhpcyBjYXVzZXMgcHJvYmxlbXMgd2l0aCB0aGUgcGFyc2luZyBsaWJyYXJ5IHdlIHVzZS4gIFBsZWFzZSB1c2Ugc3BhY2VzLlxuICBgLFxuICAgICk7XG4gIH1cblxuICBjb25zdCBqc29uT3V0cHV0ID0geWFtbFBhcnNlLnNhZmVMb2FkKHlhbWxUb2tlbnMpO1xuXG4gIGNvbnN0IHNjc3NPdXRwdXQgPSBwYXJzZVNhc3NPYmplY3QoanNvbk91dHB1dCwgcHJlZml4KTtcblxuICByZXR1cm4geyBqc29uT3V0cHV0LCBzY3NzT3V0cHV0IH07XG59XG5cbmZ1bmN0aW9uIHJlYWRGaWxlQ29udGVudChmaWxlUGF0aCkge1xuICByZXR1cm4gZnMucmVhZEZpbGVTeW5jKHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIGZpbGVQYXRoKSwgJ3V0ZjgnKTtcbn1cblxuZnVuY3Rpb24gYnVpbGRQcm9wZXJ0eShuYW1lLCB2YWx1ZSkge1xuICBsZXQgcXVvdGVkVmFsdWU7XG5cbiAgLy8gUHV0IFVSTHMgb3Igb3RoZXIgdmFsdWVzIHRoYXQgY29udGFpbiBjb2xvbnMgaW4gcXVvdGVzLlxuICBpZiAodmFsdWUuaW5kZXhPZignOicpID49IDApIHtcbiAgICBxdW90ZWRWYWx1ZSA9IGBcIiR7dmFsdWUucmVwbGFjZSgvXFxcIi9nLCAnXFxcXFwiJyl9XCJgO1xuICB9XG5cbiAgcmV0dXJuIGAke25hbWV9OiAke3F1b3RlZFZhbHVlIHx8IHZhbHVlfSAhZGVmYXVsdDtcXG5gO1xufVxuXG5mdW5jdGlvbiBwYXJzZVNhc3NPYmplY3Qoc2Fzc09iamVjdCwgcHJlZml4KSB7XG4gIGxldCBzY3NzUmVzdWx0ID0gJyc7XG5cbiAgZm9yICh2YXIga2V5IGluIHNhc3NPYmplY3QpIHtcbiAgICBpZiAoc2Fzc09iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICBjb25zdCBuZXN0ZWROYW1lID0gcHJlZml4ICsgJy0nICsga2V5O1xuXG4gICAgICBpZiAoc2Fzc09iamVjdFtrZXldICE9PSBudWxsKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHNhc3NPYmplY3Rba2V5XSkpIHtcbiAgICAgICAgICBzY3NzUmVzdWx0ICs9IGJ1aWxkUHJvcGVydHkobmVzdGVkTmFtZSwgc2Fzc09iamVjdFtrZXldLmpvaW4oJyAnKSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHNhc3NPYmplY3Rba2V5XSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICBzY3NzUmVzdWx0ICs9IHBhcnNlU2Fzc09iamVjdChzYXNzT2JqZWN0W2tleV0sIG5lc3RlZE5hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNjc3NSZXN1bHQgKz0gYnVpbGRQcm9wZXJ0eShuZXN0ZWROYW1lLCBzYXNzT2JqZWN0W2tleV0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzY3NzUmVzdWx0ICs9IGJ1aWxkUHJvcGVydHkobmVzdGVkTmFtZSwgc2Fzc09iamVjdFtrZXldKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gc2Nzc1Jlc3VsdDtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL0VyaWthLk1jVmV5L2dpdC9za3l1eC1kZXNpZ24tdG9rZW5zL3BsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9FcmlrYS5NY1ZleS9naXQvc2t5dXgtZGVzaWduLXRva2Vucy9wbHVnaW5zL2J1aWxkLXN0eWxlLWRpY3Rpb25hcnktcGx1Z2luLmNqc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvRXJpa2EuTWNWZXkvZ2l0L3NreXV4LWRlc2lnbi10b2tlbnMvcGx1Z2lucy9idWlsZC1zdHlsZS1kaWN0aW9uYXJ5LXBsdWdpbi5janNcIjtpbXBvcnQgeyBzeW5jIH0gZnJvbSAnZ2xvYic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBTdHlsZURpY3Rpb25hcnkgZnJvbSAnc3R5bGUtZGljdGlvbmFyeSc7XG5pbXBvcnQgeyBleHBhbmRUeXBlc01hcCwgcmVnaXN0ZXIgfSBmcm9tICdAdG9rZW5zLXN0dWRpby9zZC10cmFuc2Zvcm1zJztcbmltcG9ydCB7IHRva2VuU2V0cyB9IGZyb20gJy4uL3NyYy9zdHlsZS1kaWN0aW9uYXJ5L3Rva2VuLXNldHMubWpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkU3R5bGVEaWN0aW9uYXJ5UGx1Z2luKCkge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICd0cmFuc2Zvcm0tc3R5bGUtZGljdGlvbmFyeScsXG4gICAgYXN5bmMgdHJhbnNmb3JtKGNvZGUsIGlkKSB7XG4gICAgICBjb25zdCBmaWxlcyA9IHN5bmMoJ3NyYy9zdHlsZS1kaWN0aW9uYXJ5L3Rva2Vucy8qKi8qLmpzb24nKTtcbiAgICAgIGZvciAobGV0IGZpbGUgb2YgZmlsZXMpIHtcbiAgICAgICAgdGhpcy5hZGRXYXRjaEZpbGUocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIGZpbGUpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlkLmluY2x1ZGVzKCdzcmMvZGV2L3Rva2Vucy5jc3MnKSkge1xuICAgICAgICBsZXQgbG9jYWxUb2tlbnMgPSAnJztcbiAgICAgICAgcmVnaXN0ZXIoU3R5bGVEaWN0aW9uYXJ5KTtcbiAgICAgICAgY29uc3Qgc2QgPSBuZXcgU3R5bGVEaWN0aW9uYXJ5KHVuZGVmaW5lZCwgeyB2ZXJib3NpdHk6ICd2ZXJib3NlJyB9KTtcblxuICAgICAgICBjb25zdCBhbGxGaWxlcyA9IGF3YWl0IGdlbmVyYXRlRGljdGlvbmFyeUZpbGVzKHRva2VuU2V0cywgc2QpO1xuXG4gICAgICAgIGZvciAobGV0IGZpbGUgb2YgYWxsRmlsZXMpIHtcbiAgICAgICAgICBsb2NhbFRva2VucyA9IGxvY2FsVG9rZW5zLmNvbmNhdChgLmxvY2FsLWRldi10b2tlbnMke2ZpbGUub3V0cHV0fWApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxvY2FsVG9rZW5zO1xuICAgICAgfVxuICAgIH0sXG4gICAgYXN5bmMgZ2VuZXJhdGVCdW5kbGUoKSB7XG4gICAgICByZWdpc3RlcihTdHlsZURpY3Rpb25hcnkpO1xuXG4gICAgICBTdHlsZURpY3Rpb25hcnkucmVnaXN0ZXJUcmFuc2Zvcm0oe1xuICAgICAgICBuYW1lOiAnbmFtZS9wcmVmaXhlZC1rZWJhYicsXG4gICAgICAgIHR5cGU6ICduYW1lJyxcbiAgICAgICAgdHJhbnNmb3JtOiAodG9rZW4pID0+IHtcbiAgICAgICAgICByZXR1cm4gYCR7dG9rZW4uaXNTb3VyY2UgPyAnJyA6ICd0ZXhhcy0nfSR7dG9rZW4ucGF0aC5qb2luKCctJyl9YDtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBhbGxTZXRzID0gdG9rZW5TZXRzLm1hcCgoc2V0KSA9PiBzZXQubmFtZSk7XG4gICAgICBjb25zdCBzZCA9IG5ldyBTdHlsZURpY3Rpb25hcnkodW5kZWZpbmVkLCB7IHZlcmJvc2l0eTogJ3ZlcmJvc2UnIH0pO1xuICAgICAgY29uc3QgY29tcG9zaXRlU3R5bGVGaWxlcyA9IHt9O1xuXG4gICAgICBjb25zdCBhbGxGaWxlcyA9IGF3YWl0IGdlbmVyYXRlRGljdGlvbmFyeUZpbGVzKHRva2VuU2V0cywgc2QpO1xuXG4gICAgICBmb3IgKGxldCBmaWxlIG9mIGFsbEZpbGVzKSB7XG4gICAgICAgIGlmIChmaWxlLmRlc3RpbmF0aW9uLmluY2x1ZGVzKCdjb21wb25lbnRzLycpKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coZmlsZSk7XG4gICAgICAgICAgbGV0IGZpbGVOYW1lID0gZmlsZS5kZXN0aW5hdGlvbjtcbiAgICAgICAgICBmb3IgKGxldCBzZXROYW1lIG9mIGFsbFNldHMpIHtcbiAgICAgICAgICAgIGZpbGVOYW1lID0gZmlsZU5hbWUucmVwbGFjZShgJHtzZXROYW1lfS9gLCAnJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGV0IGZpbGVDb250ZW50cyA9IGNvbXBvc2l0ZVN0eWxlRmlsZXNbZmlsZU5hbWVdIHx8ICcnO1xuICAgICAgICAgIGZpbGVDb250ZW50cyA9IGZpbGVDb250ZW50cy5jb25jYXQoZmlsZS5vdXRwdXQpO1xuXG4gICAgICAgICAgY29tcG9zaXRlU3R5bGVGaWxlc1tmaWxlTmFtZV0gPSBmaWxlQ29udGVudHM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5lbWl0RmlsZSh7XG4gICAgICAgICAgICB0eXBlOiAnYXNzZXQnLFxuICAgICAgICAgICAgZmlsZU5hbWU6IGZpbGUuZGVzdGluYXRpb24ucmVwbGFjZSgnZGlzdC8nLCAnJyksXG4gICAgICAgICAgICBzb3VyY2U6IGZpbGUub3V0cHV0IHx8ICcnLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IGZpbGVOYW1lIG9mIE9iamVjdC5rZXlzKGNvbXBvc2l0ZVN0eWxlRmlsZXMpKSB7XG4gICAgICAgIGNvbnN0IGZpbGVDb250ZW50cyA9IGNvbXBvc2l0ZVN0eWxlRmlsZXNbZmlsZU5hbWVdO1xuICAgICAgICB0aGlzLmVtaXRGaWxlKHtcbiAgICAgICAgICB0eXBlOiAnYXNzZXQnLFxuICAgICAgICAgIGZpbGVOYW1lOiBmaWxlTmFtZS5yZXBsYWNlKCdkaXN0LycsICcnKSxcbiAgICAgICAgICBzb3VyY2U6IGZpbGVDb250ZW50cyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSxcbiAgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2VuZXJhdGVEaWN0aW9uYXJ5RmlsZXModG9rZW5TZXRzLCBzZCkge1xuICBsZXQgYWxsRmlsZXMgPSBbXTtcbiAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgdG9rZW5TZXRzLm1hcChhc3luYyBmdW5jdGlvbiAodG9rZW5TZXQpIHtcbiAgICAgIGNvbnN0IHRoZW1lRGljdGlvbmFyeSA9IGF3YWl0IHNkLmV4dGVuZChnZXREaWN0aW9uYXJ5Q29uZmlnKHRva2VuU2V0KSk7XG4gICAgICBjb25zdCBmaWxlcyA9IGF3YWl0IHRoZW1lRGljdGlvbmFyeS5mb3JtYXRQbGF0Zm9ybSgnY3NzJyk7XG4gICAgICBhbGxGaWxlcyA9IGFsbEZpbGVzLmNvbmNhdChmaWxlcyk7XG4gICAgfSksXG4gICk7XG5cbiAgcmV0dXJuIGFsbEZpbGVzO1xufVxuXG5mdW5jdGlvbiBnZXREaWN0aW9uYXJ5Q29uZmlnKHRva2VuU2V0KSB7XG4gIGNvbnN0IGNvbXBvbmVudFRva2Vuc1BhdGggPSBgc3JjL3N0eWxlLWRpY3Rpb25hcnkvdG9rZW5zL2NvbXBvbmVudHMvJHt0b2tlblNldC5uYW1lfS8qKi8qLmpzb25gO1xuICBjb25zdCBjb21wb25lbnRGaWxlcyA9IHN5bmMoY29tcG9uZW50VG9rZW5zUGF0aCkubWFwKChmaWxlUGF0aCkgPT5cbiAgICBmaWxlUGF0aFxuICAgICAgLnJlcGxhY2UoYHNyYy9zdHlsZS1kaWN0aW9uYXJ5L3Rva2Vucy9jb21wb25lbnRzLyR7dG9rZW5TZXQubmFtZX0vYCwgJycpXG4gICAgICAucmVwbGFjZSgnLmpzb24nLCAnJyksXG4gICk7XG5cbiAgY29uc3QgcmVmZXJlbmNlVG9rZW5zUGF0aHMgPSB0b2tlblNldC5yZWZlcmVuY2VUb2tlbnMubWFwKFxuICAgIChyZWZlcmVuY2VUb2tlbnNTZXQpID0+XG4gICAgICBgc3JjL3N0eWxlLWRpY3Rpb25hcnkvdG9rZW5zLyR7cmVmZXJlbmNlVG9rZW5zU2V0LnBhdGh9YCxcbiAgKTtcblxuICByZXR1cm4ge1xuICAgIHNvdXJjZTogW2BzcmMvc3R5bGUtZGljdGlvbmFyeS90b2tlbnMvJHt0b2tlblNldC5wYXRofWBdLFxuICAgIGluY2x1ZGU6IFsuLi5yZWZlcmVuY2VUb2tlbnNQYXRocywgY29tcG9uZW50VG9rZW5zUGF0aF0sXG4gICAgcHJlcHJvY2Vzc29yczogWyd0b2tlbnMtc3R1ZGlvJ10sXG4gICAgZXhwYW5kOiB7XG4gICAgICB0eXBlc01hcDogZXhwYW5kVHlwZXNNYXAsXG4gICAgfSxcbiAgICBwbGF0Zm9ybXM6IHtcbiAgICAgIGNzczoge1xuICAgICAgICB0cmFuc2Zvcm1Hcm91cDogJ3Rva2Vucy1zdHVkaW8nLFxuICAgICAgICB0cmFuc2Zvcm1zOiBbJ25hbWUvcHJlZml4ZWQta2ViYWInXSxcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgIG91dHB1dFJlZmVyZW5jZXM6IHRydWUsXG4gICAgICAgICAgc2hvd0ZpbGVIZWFkZXI6IGZhbHNlLFxuICAgICAgICAgIHNlbGVjdG9yOiB0b2tlblNldC5zZWxlY3RvcixcbiAgICAgICAgfSxcbiAgICAgICAgYnVpbGRQYXRoOiBgZGlzdC9zdHlsZS1kaWN0aW9uYXJ5L2AsXG4gICAgICAgIGZpbGVzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVzdGluYXRpb246IGAke3Rva2VuU2V0Lm5hbWV9LyR7dG9rZW5TZXQubmFtZX0uY3NzYCxcbiAgICAgICAgICAgIGZvcm1hdDogJ2Nzcy92YXJpYWJsZXMnLFxuICAgICAgICAgICAgZmlsdGVyOiAodG9rZW4pID0+XG4gICAgICAgICAgICAgIGZpbHRlckJ5RmlsZVBhdGgodG9rZW4sIHRva2VuU2V0LnBhdGgsIGBjb21wb25lbnRzL2ApLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgLi4udG9rZW5TZXQucmVmZXJlbmNlVG9rZW5zLm1hcCgocmVmZXJlbmNlVG9rZW5TZXQpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIGRlc3RpbmF0aW9uOiBgJHt0b2tlblNldC5uYW1lfS8ke3JlZmVyZW5jZVRva2VuU2V0Lm5hbWV9LmNzc2AsXG4gICAgICAgICAgICAgIGZvcm1hdDogJ2Nzcy92YXJpYWJsZXMnLFxuICAgICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6IGAke3Rva2VuU2V0LnNlbGVjdG9yfSR7cmVmZXJlbmNlVG9rZW5TZXQuc2VsZWN0b3IgfHwgJyd9YCxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgZmlsdGVyOiAodG9rZW4pID0+XG4gICAgICAgICAgICAgICAgZmlsdGVyQnlGaWxlUGF0aCh0b2tlbiwgcmVmZXJlbmNlVG9rZW5TZXQucGF0aCwgYGNvbXBvbmVudHMvYCksXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pLFxuICAgICAgICAgIC4uLmNvbXBvbmVudEZpbGVzLm1hcCgoZmlsZVBhdGgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIGRlc3RpbmF0aW9uOiBgY29tcG9uZW50cy8ke3Rva2VuU2V0Lm5hbWV9LyR7ZmlsZVBhdGh9LmNzc2AsXG4gICAgICAgICAgICAgIGZvcm1hdDogJ2Nzcy92YXJpYWJsZXMnLFxuICAgICAgICAgICAgICBmaWx0ZXI6ICh0b2tlbikgPT5cbiAgICAgICAgICAgICAgICBmaWx0ZXJCeUZpbGVQYXRoKHRva2VuLCBgJHt0b2tlblNldC5uYW1lfS8ke2ZpbGVQYXRofWApLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gZmlsdGVyQnlGaWxlUGF0aCh0b2tlbiwgZmlsZVBhdGgsIG5vdEZpbGVQYXRoKSB7XG4gIGlmICh0b2tlbi5maWxlUGF0aC5pbmNsdWRlcygnY29tcG9uZW50JykpIHtcbiAgICBjb25zb2xlLmxvZyh0b2tlbi5maWxlUGF0aCk7XG4gICAgY29uc29sZS5sb2codG9rZW4uZmlsZVBhdGguaW5jbHVkZXMoZmlsZVBhdGgpKTtcbiAgICBjb25zb2xlLmxvZyh0b2tlbik7XG4gIH1cbiAgaWYgKG5vdEZpbGVQYXRoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRva2VuLmZpbGVQYXRoLmluY2x1ZGVzKGZpbGVQYXRoKSAmJiAhdG9rZW4uZmlsZVBhdGguaW5jbHVkZXMobm90RmlsZVBhdGgpXG4gICAgKTtcbiAgfVxuICByZXR1cm4gdG9rZW4uZmlsZVBhdGguaW5jbHVkZXMoZmlsZVBhdGgpO1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvRXJpa2EuTWNWZXkvZ2l0L3NreXV4LWRlc2lnbi10b2tlbnMvc3JjL3N0eWxlLWRpY3Rpb25hcnlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9FcmlrYS5NY1ZleS9naXQvc2t5dXgtZGVzaWduLXRva2Vucy9zcmMvc3R5bGUtZGljdGlvbmFyeS90b2tlbi1zZXRzLm1qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvRXJpa2EuTWNWZXkvZ2l0L3NreXV4LWRlc2lnbi10b2tlbnMvc3JjL3N0eWxlLWRpY3Rpb25hcnkvdG9rZW4tc2V0cy5tanNcIjtleHBvcnQgY29uc3QgdG9rZW5TZXRzID0gW1xuICB7XG4gICAgbmFtZTogJ21vZGVybicsXG4gICAgcGF0aDogJ2Jhc2UtbW9kZXJuLmpzb24nLFxuICAgIHNlbGVjdG9yOiAnLnNreS10aGVtZS1tb2Rlcm4nLFxuICAgIG91dHB1dFBhdGg6ICdtb2Rlcm4uY3NzJyxcbiAgICByZWZlcmVuY2VUb2tlbnM6IFtcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ21vZGVybi1jb2xvcnMnLFxuICAgICAgICBwYXRoOiAnY29sb3IvbW9kZXJuLmpzb24nLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ21vZGVybi1sYXlvdXQnLFxuICAgICAgICBwYXRoOiAnbGF5b3V0L21vZGVybi5qc29uJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcbiAge1xuICAgIG5hbWU6ICdibGFja2JhdWQnLFxuICAgIHBhdGg6ICdiYXNlLWJsYWNrYmF1ZC5qc29uJyxcbiAgICBzZWxlY3RvcjogJy5za3ktdGhlbWUtbW9kZXJuLnNreS10aGVtZS1icmFuZC1ibGFja2JhdWQnLFxuICAgIG91dHB1dFBhdGg6ICdibGFja2JhdWQuY3NzJyxcbiAgICByZWZlcmVuY2VUb2tlbnM6IFtcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ2JiLWxpZ2h0JyxcbiAgICAgICAgcGF0aDogJ2NvbG9yL2JiLWxpZ2h0Lmpzb24nLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ2JiLWRhcmsnLFxuICAgICAgICBzZWxlY3RvcjogJy5za3ktdGhlbWUtbW9kZS1kYXJrJyxcbiAgICAgICAgcGF0aDogJ2NvbG9yL2JiLWRhcmsuanNvbicsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAnYmItcHJvZHVjdGl2ZScsXG4gICAgICAgIHBhdGg6ICdsYXlvdXQvYmItcHJvZHVjdGl2ZS5qc29uJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdiYi1jb21wYWN0JyxcbiAgICAgICAgc2VsZWN0b3I6ICcuc2t5LXRoZW1lLW1vZGUtY29tcGFjdCcsXG4gICAgICAgIHBhdGg6ICdsYXlvdXQvYmItY29tcGFjdC5qc29uJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdiYi1zcGFjaW91cycsXG4gICAgICAgIHNlbGVjdG9yOiAnLnNreS10aGVtZS1tb2RlLXNwYWNpb3VzJyxcbiAgICAgICAgcGF0aDogJ2xheW91dC9iYi1zcGFjaW91cy5qc29uJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcbl07XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9FcmlrYS5NY1ZleS9naXQvc2t5dXgtZGVzaWduLXRva2Vucy9wbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvRXJpa2EuTWNWZXkvZ2l0L3NreXV4LWRlc2lnbi10b2tlbnMvcGx1Z2lucy9wcmVwYXJlLXBhY2thZ2UtcGx1Z2luLmNqc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvRXJpa2EuTWNWZXkvZ2l0L3NreXV4LWRlc2lnbi10b2tlbnMvcGx1Z2lucy9wcmVwYXJlLXBhY2thZ2UtcGx1Z2luLmNqc1wiO2ltcG9ydCBmcyBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnO1xuXG5leHBvcnQgZnVuY3Rpb24gcHJlcGFyZVBhY2thZ2VQbHVnaW4oKSB7XG4gIGNvbnN0IHJvb3RQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJyk7XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAndHJhbnNmb3JtLXBhY2thZ2UnLFxuICAgIGFzeW5jIGdlbmVyYXRlQnVuZGxlKCkge1xuICAgICAgY29uc3QgcGFja2FnZUpzb24gPSBmcy5yZWFkRmlsZVN5bmMocGF0aC5qb2luKHJvb3RQYXRoLCAncGFja2FnZS5qc29uJykpO1xuICAgICAgY29uc3QgcmVhZE1lID0gZnMucmVhZEZpbGVTeW5jKHBhdGguam9pbihyb290UGF0aCwgJ1JFQURNRS5tZCcpKTtcbiAgICAgIGNvbnN0IGNoYW5nZWxvZyA9IGZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4ocm9vdFBhdGgsICdDSEFOR0VMT0cubWQnKSk7XG5cbiAgICAgIHRoaXMuZW1pdEZpbGUoe1xuICAgICAgICB0eXBlOiAnYXNzZXQnLFxuICAgICAgICBmaWxlTmFtZTogJ3BhY2thZ2UuanNvbicsXG4gICAgICAgIHNvdXJjZTogcGFja2FnZUpzb24sXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5lbWl0RmlsZSh7XG4gICAgICAgIHR5cGU6ICdhc3NldCcsXG4gICAgICAgIGZpbGVOYW1lOiAnUkVBRE1FLm1kJyxcbiAgICAgICAgc291cmNlOiByZWFkTWUsXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5lbWl0RmlsZSh7XG4gICAgICAgIHR5cGU6ICdhc3NldCcsXG4gICAgICAgIGZpbGVOYW1lOiAnQ0hBTkdFTE9HLm1kJyxcbiAgICAgICAgc291cmNlOiBjaGFuZ2Vsb2csXG4gICAgICB9KTtcbiAgICB9LFxuICB9O1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFnVCxPQUFPQSxXQUFVO0FBQ2pVLFNBQVMsY0FBYyxlQUFlOzs7QUNEb1QsT0FBTyxRQUFRO0FBQ3pXLE9BQU8sVUFBVTtBQUNqQixPQUFPLGVBQWU7QUFGdEIsSUFBTSxtQ0FBbUM7QUFJbEMsU0FBUyxvQkFBb0I7QUFDbEMsU0FBTztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sTUFBTSxpQkFBaUI7QUFDckIsWUFBTSxnQkFBZ0I7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QU07QUFBQSxRQUNOLFVBQVU7QUFBQSxRQUNWLFFBQVE7QUFBQSxNQUNWLENBQUM7QUFBQSxJQUNIO0FBQUEsRUFDRjtBQUNGOzs7QUpoQ0EsSUFBTUcsb0NBQW1DO0FBTXpDLElBQU8sc0JBQVEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUMzQixRQUFNLFVBQVUsUUFBUSxNQUFNLFFBQVEsSUFBSSxDQUFDO0FBRTNDLFNBQU8sYUFBYTtBQUFBLElBQ2xCLE9BQU87QUFBQSxNQUNMLEtBQUs7QUFBQSxRQUNILE9BQU9DLE1BQUssUUFBUUMsbUNBQVcsaUJBQWlCO0FBQUEsUUFDaEQsTUFBTTtBQUFBLFFBQ04sV0FBVztBQUNULGlCQUFPO0FBQUEsUUFDVDtBQUFBLFFBQ0EsU0FBUyxDQUFDLElBQUk7QUFBQSxNQUNoQjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE1BQU07QUFBQSxJQUNSO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixPQUFPLFFBQVEsZ0JBQ1g7QUFBQSxRQUNFLE1BQU0sUUFBUTtBQUFBLFFBQ2QsS0FBSyxRQUFRO0FBQUEsTUFDZixJQUNBO0FBQUEsTUFDSixNQUFNO0FBQUEsSUFDUjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1Asa0JBQWtCO0FBQUEsTUFDbEIsMkJBQTJCO0FBQUEsTUFDM0IscUJBQXFCO0FBQUEsSUFDdkI7QUFBQSxFQUNGLENBQUM7QUFDSDsiLAogICJuYW1lcyI6IFsicGF0aCIsICJwYXRoIiwgInBhdGgiLCAidG9rZW5TZXRzIiwgImZzIiwgInBhdGgiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUiLCAicGF0aCIsICJfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSIsICJmcyIsICJfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSIsICJwYXRoIiwgIl9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lIl0KfQo=
