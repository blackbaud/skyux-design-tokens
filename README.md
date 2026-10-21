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

## Testing with local preview

To view local tokens changes in production SPAs, ensure you have a `.env.local` file and run the command `npm run dev`. The local preview will apply to all SPAs at the same domain as the `VITE_LAUNCH_URL` specified in your `.env.local`. The preview will refresh when you edit and save a file.

If you do not have an `.env.local` file, reach out to someone on the team for help setting it up.

To add additional CSS to any SPA you are locally previewing, create a file `src/dev/extra-styles.css`. This stylesheet will be added to the SPA and can be used to override styles for testing purposes. It is a regular CSS file, so Angular selectors like `:ng-deep` and `:host` and SCSS nesting syntax will not work. `!important` will work, and will be helpful for testing.

## Visual tests

`src/visual-tests` is a framework-free page that renders a demo of every public class and custom property from the built `bundles/public-api-styles.json` and `bundles/public-api-tokens.json`, styled by the built CSS. It is used for visual regression snapshots.

Run `npm run visual-tests` to build the package and serve the page, or `npm run build:visual-tests` to build it as static files in `dist-visual-tests/`.

Query params choose what to render:

| Param     | Values                                                    | Default    |
| --------- | --------------------------------------------------------- | ---------- |
| `page`    | `borders`, `colors`, `elevation`, `spacing`, `typography` | All pages  |
| `theme`   | `default`, `modern`                                       | `default`  |
| `mode`    | `light`, `dark`                                           | `light`    |
| `brand`   | `base`, `blackbaud`                                       | `base`     |
| `spacing` | `standard`, `compact`                                     | `standard` |

`mode`, `brand`, and `spacing` only apply to the modern theme. For example, `?page=colors&theme=modern&mode=dark&brand=blackbaud`.

Once the page has rendered, `body` gets a `data-ready` attribute, so snapshot tools can wait for `body[data-ready]`.
