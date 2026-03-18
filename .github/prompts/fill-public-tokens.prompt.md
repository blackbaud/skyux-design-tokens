---
agent: 'edit'
description: 'Fill out public tokens from a CSV'
---

Populate token files from the CSV data I will provide. The token **category** determines the file paths and `$type`. The user will specify the category at the start of their message.

Two types of output files are managed:

1. **Style dictionary files** (theme + default) — contain only token values and types (`$value`, `$type`). No documentation metadata.
2. **Docs file** — a separate JSON file with all documentation metadata (descriptions, names, grouping, demo metadata, etc.), following the `PublicApiTokens` types from `@blackbaud/skyux-branding-builder`.

## Token categories and file paths

| Category   | Theme file                            | Default file                               | Docs file                                | `$type`       |
|------------|---------------------------------------|--------------------------------------------|------------------------------------------|---------------|
| layout     | `src/tokens/public/layout.json`       | `src/tokens/public/default/layout.json`    | `src/tokens/public/docs/layout.json`     | `spacing`     |
| typography | `src/tokens/public/typography.json`   | `src/tokens/public/default/typography.json`| `src/tokens/public/docs/typography.json` | derived — see §Typography |
| color      | `src/tokens/public/color.json`        | `src/tokens/public/default/color.json`     | `src/tokens/public/docs/color.json`      | `color`       |
| border     | `src/tokens/public/border.json`       | `src/tokens/public/default/border.json`    | `src/tokens/public/docs/border.json`     | `border`      |
| elevation  | `src/tokens/public/elevation.json`    | `src/tokens/public/default/elevation.json` | `src/tokens/public/docs/elevation.json`  | `boxShadow`   |

### §Typography: `$type` derivation

Typography `$type` is derived from the **Property** column rather than being fixed for the category:

| Property value   | `$type`          |
|------------------|------------------|
| `font-weight`    | `fontWeights`    |
| `font-style`     | `fontWeights`    |
| `font-size`      | `fontSizes`      |
| `font-family`    | `fontFamilies`   |
| `line-height`    | `lineHeights`    |
| `letter-spacing` | `letterSpacings` |
| `color`          | — (skip)         |

> **Rows with `Property` = `color` must be skipped entirely** — color tokens belong in the color category, not in typography files.

If the **Property** column is empty on a typography token row, derive `$type` from the token's custom property name using the same mapping (e.g., `--sky-theme-font-family-primary` contains `font-family` → `fontFamilies`).

## CSV format

The CSV has these relevant columns (amongst others that should be ignored):
- **API custom property** — defines the token path (for style dictionary) and `customProperty` (for docs)
- **Property** — the CSS property type (e.g., `font-weight`, `font-size`); present only for typography rows
- **Value** — token reference used for the theme file
- **Default value** — raw value used for the default file
- **Description** — optional description (used in docs file)
- **Name** — optional human-readable name (used in docs file)
- **Deprecated** — optional; the name of the custom property that replaces this one (used in docs file)
- **Removed** — optional column (may not be present in every CSV); the name of the custom property that was removed. Populates `obsoleteCustomProperties` in docs.
- **SASS Variables** — optional column (may not be present in every CSV); a comma-separated list of deprecated SCSS variable names. Populates `deprecatedScssVariables` in docs.
- **Subcategory** — top-level group header (on rows with no API custom property; used for docs grouping)
- **Group** — optional finer-grained group header within a subcategory (used for docs grouping)
- **Category label** — used only to separate classes from custom properties within the CSV; **ignored** for token/docs generation

## Docs file types

The docs file conforms to these TypeScript interfaces from `@blackbaud/skyux-branding-builder`:

```typescript
interface PublicApiTokens {
  groups?: PublicApiTokenGroup[];
  tokens?: PublicApiToken[];
}

interface PublicApiTokenGroup {
  groupName: string;
  description?: string;
  demoMetadata?: DemoMetadata;
  groups?: PublicApiTokenGroup[];
  tokens?: PublicApiToken[];
}

interface PublicApiToken {
  name: string;
  customProperty?: string;
  description?: string;
  deprecatedCustomProperties?: string[];
  deprecatedScssVariables?: string[];
  obsoleteCustomProperties?: string[];
  cssProperty?: string;
  demoMetadata?: DemoMetadata;
}

interface DemoMetadata {
  type?: string;
  background?: string;
  color?: string;
  text?: string;
}
```

## Rules

### Style dictionary files (theme + default)

1. **Skip rows** where "API custom property" is empty — these only affect the docs file.
2. **Token path**: Take the "API custom property" value, strip the leading `--sky-theme-` prefix, then split on `-` to form the JSON nesting hierarchy. Underscores in segment names should be kept as-is.
3. **`$value` in the theme file**: Take the "Value" column value, strip the leading `--sky-` prefix, replace `-` with `.` to form dot notation, and wrap in `{}`. Example: `--sky-space-inline-l` → `{space.inline.l}`.
   **`$value` in the default file**: Use the "Default value" column as-is. If the value is a bare number with no units (e.g. `4`), append `px` (e.g. `4px`). **Exception for typography**: only append `px` for `fontSizes` tokens; for all other typography `$type` values, use bare numbers as-is.
4. **`$type`**: For non-typography categories, use the value from the category table above. For **typography**, derive `$type` from the `Property` column using the §Typography table above.
5. **No docs metadata**: Do not include `$description`, `$extensions`, or any documentation-related fields in the style dictionary files. Only `$value` and `$type` on token nodes.
6. **Nesting**: Token data is nested under `"theme"` at the top level, matching the existing file structure.
7. **Merge**: Merge new tokens into each existing style dictionary file — preserve tokens already present and add/overwrite from the CSV.

### Docs file

The docs file is a `PublicApiTokens` object with a top-level `groups` array.

8. **Category group**: Create a top-level `PublicApiTokenGroup` with `groupName` set to the title-cased category name: `"Layout"` for layout, `"Typography"` for typography, `"Color"` for color, `"Border"` for border, `"Elevation"` for elevation.
9. **Subcategory groups**: A CSV row with a **"Subcategory"** value and no "API custom property" creates a `PublicApiTokenGroup` inside the category group:
   - `groupName` = the "Subcategory" value
   - `description` = the "Description" value (if non-empty)
   - Subsequent token rows belong in this group's `tokens` array until the next subcategory header.
10. **Group sub-groups**: A CSV row with a **"Group"** value and no "API custom property" creates a nested `PublicApiTokenGroup` inside the current subcategory:
    - `groupName` = the "Group" value
    - `description` = the "Description" value (if non-empty)
    - Subsequent token rows belong in this sub-group's `tokens` array until the next group or subcategory header.
    For non-typography categories, a non-token row with a **"Name"** value (but no "Group") also creates a nested sub-group the same way, using `groupName` = the "Name" value.
11. **Typography sub-groups**: For the **typography** category, grouping uses both header rows and token rows:
    - Subcategory header rows (no API custom property) create groups the same as rule 9.
    - A token row with a **"Name"** value followed by additional token rows **without** "Name" values creates a sub-group:
      - `groupName` = the "Name" value from the first row
      - `description` = the "Description" value from the first row (if non-empty)
      - The first row's token AND all subsequent unnamed token rows (until the next named row or subcategory) become `tokens` in this sub-group.
    - A named typography token row that is **not** followed by unnamed rows is a standalone token (not a sub-group).
12. **Token entries**: For each token row (has "API custom property"), create a `PublicApiToken`:
    - `name` (**required**): Use the "Name" column if non-empty. If empty, derive a human-readable name from the token path segments (e.g., `--sky-theme-space-inline-m` → `"Inline space M"`).
    - `customProperty`: The full "API custom property" value (e.g., `--sky-theme-space-inline-l`).
    - `description`: Include if the "Description" column is non-empty.
    - `deprecatedCustomProperties`: Include if the "Deprecated" column is non-empty. Value as a single-element array.
    - `deprecatedScssVariables`: Include if the "SASS Variables" column is present and non-empty. Split comma-separated values into a string array.
    - `obsoleteCustomProperties`: Include if the "Removed" column is present and non-empty. Value as a single-element array.
    - `cssProperty`: For **typography** tokens only, include if the "Property" column is non-empty.
13. **Merge**: Merge new entries into an existing docs file if one exists — preserve existing groups/tokens and add/overwrite from the CSV.

### Existing tokens without docs file

14. If the style dictionary files (`<type>.json` and `default/<type>.json`) already contain tokens but **no docs file exists** at `src/tokens/public/docs/<type>.json`:
    - **Generate the docs file** by extracting documentation metadata from the existing style dictionary tokens — map `$description` to `description`, and map `$extensions["com.blackbaud.developer.docs"]` properties to their corresponding `PublicApiTokenGroup`/`PublicApiToken` fields (`groupName`, `name`, `deprecatedCustomProperties`, `cssProperty`, `demoMetadata`).
    - **Strip docs metadata** from the style dictionary files after generating the docs file: remove all `$description` properties and `$extensions` objects, leaving only `$value` and `$type` on token nodes.
    - **Reconcile with CSV**: If CSV data is also provided, merge it with the extracted data. **Call out any discrepancies** between the existing style dictionary tokens and the CSV in your response (e.g., tokens present in the style dictionary but absent from the CSV, tokens in the CSV but not in the style dictionary, mismatched descriptions or values).

## Examples

### Layout example

Category: **layout**. Input CSV:

| subcategory | group | API custom property | Value | Default value | Description | name | deprecated |
|---|---|---|---|---|---|---|---|
| Inline spacing | | | | | Tokens for inline elements | | |
| | | `--sky-theme-space-inline-l` | `--sky-space-inline-l` | `16px` | Large inline | Inline L | |
| | | `--sky-theme-space-inline-m` | `--sky-space-inline-m` | `12px` | | | `--sky-theme-space-inline-l` |
| | Icon inline | | | | Spacing between icons | | |
| | | `--sky-theme-space-inline-icon-l` | `--sky-space-inline-icon-l` | `8px` | | Icon Large | |

#### `src/tokens/public/layout.json` (theme — values/types only):
```json
{
  "theme": {
    "space": {
      "inline": {
        "l": {
          "$value": "{space.inline.l}",
          "$type": "spacing"
        },
        "m": {
          "$value": "{space.inline.m}",
          "$type": "spacing"
        },
        "icon": {
          "l": {
            "$value": "{space.inline.icon.l}",
            "$type": "spacing"
          }
        }
      }
    }
  }
}
```

#### `src/tokens/public/default/layout.json` (default — values/types only):
```json
{
  "theme": {
    "space": {
      "inline": {
        "l": {
          "$value": "16px",
          "$type": "spacing"
        },
        "m": {
          "$value": "12px",
          "$type": "spacing"
        },
        "icon": {
          "l": {
            "$value": "8px",
            "$type": "spacing"
          }
        }
      }
    }
  }
}
```

#### `src/tokens/public/docs/layout.json` (docs — grouping and metadata):
```json
{
  "groups": [
    {
      "groupName": "Layout",
      "groups": [
        {
          "groupName": "Inline spacing",
          "description": "Tokens for inline elements",
          "tokens": [
            {
              "name": "Inline L",
              "customProperty": "--sky-theme-space-inline-l",
              "description": "Large inline"
            },
            {
              "name": "Inline space M",
              "customProperty": "--sky-theme-space-inline-m",
              "deprecatedCustomProperties": ["--sky-theme-space-inline-l"]
            }
          ],
          "groups": [
            {
              "groupName": "Icon inline",
              "description": "Spacing between icons",
              "tokens": [
                {
                  "name": "Icon Large",
                  "customProperty": "--sky-theme-space-inline-icon-l"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

---

### Typography example

Category: **typography**. Input CSV:

| Subcategory | Name | Description | API custom property | Property | Value | Default value |
|---|---|---|---|---|---|---|
| Font families | | | | | | |
| | Primary font family | The font family used for all elements on a page. | `--sky-theme-font-family-primary` | | `--sky-font-family-primary` | `"BLKB Sans", "Helvetica Neue", Arial, sans-serif` |
| Headings | | Use headings to introduce sections of content. | | | | |
| | Heading 1 | Use for page titles and record names. | `--sky-theme-font-weight-heading-1` | `font-weight` | `--sky-font-style-heading-1` | `300` |
| | | | `--sky-theme-font-size-heading-1` | `font-size` | `--sky-font-size-heading-1` | `34` |
| | | | `--sky-theme-line_height-heading-1` | `line-height` | `--sky-font-line_height-heading-1` | `inherit` |
| | | | `--sky-theme-font-family-heading-1` | `font-family` | `--sky-font-family-primary` | `"BLKB Sans Condensed", "Helvetica Neue Condensed", "Arial Narrow"` |

#### `src/tokens/public/typography.json` (theme — values/types only):
```json
{
  "theme": {
    "font": {
      "family": {
        "primary": {
          "$value": "{font.family.primary}",
          "$type": "fontFamilies"
        },
        "heading": {
          "1": {
            "$value": "{font.family.primary}",
            "$type": "fontFamilies"
          }
        }
      },
      "weight": {
        "heading": {
          "1": {
            "$value": "{font.style.heading.1}",
            "$type": "fontWeights"
          }
        }
      },
      "size": {
        "heading": {
          "1": {
            "$value": "{font.size.heading.1}",
            "$type": "fontSizes"
          }
        }
      }
    },
    "line_height": {
      "heading": {
        "1": {
          "$value": "{font.line_height.heading.1}",
          "$type": "lineHeights"
        }
      }
    }
  }
}
```

#### `src/tokens/public/default/typography.json` (default — values/types only):
```json
{
  "theme": {
    "font": {
      "family": {
        "primary": {
          "$value": "\"BLKB Sans\", \"Helvetica Neue\", Arial, sans-serif",
          "$type": "fontFamilies"
        },
        "heading": {
          "1": {
            "$value": "\"BLKB Sans Condensed\", \"Helvetica Neue Condensed\", \"Arial Narrow\"",
            "$type": "fontFamilies"
          }
        }
      },
      "weight": {
        "heading": {
          "1": {
            "$value": "300",
            "$type": "fontWeights"
          }
        }
      },
      "size": {
        "heading": {
          "1": {
            "$value": "34px",
            "$type": "fontSizes"
          }
        }
      }
    },
    "line_height": {
      "heading": {
        "1": {
          "$value": "inherit",
          "$type": "lineHeights"
        }
      }
    }
  }
}
```

#### `src/tokens/public/docs/typography.json` (docs — grouping and metadata):
```json
{
  "groups": [
    {
      "groupName": "Typography",
      "groups": [
        {
          "groupName": "Font families",
          "tokens": [
            {
              "name": "Primary font family",
              "customProperty": "--sky-theme-font-family-primary",
              "description": "The font family used for all elements on a page."
            }
          ]
        },
        {
          "groupName": "Headings",
          "description": "Use headings to introduce sections of content.",
          "groups": [
            {
              "groupName": "Heading 1",
              "description": "Use for page titles and record names.",
              "tokens": [
                {
                  "name": "Heading 1 font weight",
                  "customProperty": "--sky-theme-font-weight-heading-1",
                  "cssProperty": "font-weight"
                },
                {
                  "name": "Heading 1 font size",
                  "customProperty": "--sky-theme-font-size-heading-1",
                  "cssProperty": "font-size"
                },
                {
                  "name": "Heading 1 line height",
                  "customProperty": "--sky-theme-line_height-heading-1",
                  "cssProperty": "line-height"
                },
                {
                  "name": "Heading 1 font family",
                  "customProperty": "--sky-theme-font-family-heading-1",
                  "cssProperty": "font-family"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

---

Now process the following CSV and update all three files (theme, default, and docs):
