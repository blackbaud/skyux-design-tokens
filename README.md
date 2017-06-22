# skyux-design-tokens

This repository contains design tokens for building styles for SKY UX. The tokens are stored in 'src/design-tokens.yml' When this package is released, it will contain the following files:

```
|-- dist
|    |-- scss
|    |    |-- variables.scss (A sass variable file containing the design tokens)
|    |    |-- theme.scss (A file containing scss classes representing the tokens)
|    |-- yaml
|    |    |-- design-tokens.yaml (The original yaml file containing the SKY UX design tokens)
|    |-- json
|    |    |-- design-tokens.json (A JSON representation of the design tokens)
```

To create the `dist` folder locally, clone this repository, run `npm install` and then `npm run build`.