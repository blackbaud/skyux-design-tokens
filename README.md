# skyux-design-tokens

[![npm](https://img.shields.io/npm/v/@blackbaud/skyux-design-tokens.svg)](https://www.npmjs.com/package/@blackbaud/skyux-design-tokens)

This repository contains design tokens for building styles for SKY UX. The tokens are stored in 'src/design-tokens.yml' When this package is released, it will contain the following files:

```
|-- scss
|    |-- variables.scss (A sass variable file containing the design tokens)
|    |-- mixins.scss (A file containing convenience mixins)
|-- yaml
|    |-- design-tokens.yaml (The original yaml file containing the SKY UX design tokens)
|-- json
|    |-- design-tokens.json (A JSON representation of the design tokens)
```

To create these result files locally, clone this repository, run `npm install` and then `npm run build`.

## Updating snapshot tests

If you see a test failure that indicates the test is "obsolete," it means that the outputted tokens have changed and the snapshot test failed. To update the snapshot, run `vitest run --update` and review the changes to the snapshot file to ensure they are all expected. If you do not have `vitest` installed, run `npm i -g vitest`.
