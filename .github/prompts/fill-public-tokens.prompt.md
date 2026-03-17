---
agent: 'edit'
description: 'Fill out public tokens from a CSV'
---

Populate **both** of the following files from the CSV data I will provide. The token **category** determines the file paths and `$type`. The user will specify the category at the start of their message.

## Token categories, file paths, and `$type`

| Category   | Theme file                                  | Default file                                          | `$type`       |
|------------|---------------------------------------------|-------------------------------------------------------|---------------|
| layout     | `src/tokens/public/layout.json`             | `src/tokens/public/default/layout.json`               | `spacing`     |
| typography | `src/tokens/public/typography.json`         | `src/tokens/public/default/typography.json`           | derived — see §Typography |
| color      | `src/tokens/public/color.json`              | `src/tokens/public/default/color.json`                | `color`       |
| border     | `src/tokens/public/border.json`             | `src/tokens/public/default/border.json`               | `border`      |
| elevation  | `src/tokens/public/elevation.json`          | `src/tokens/public/default/elevation.json`            | `boxShadow`   |

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
- **API custom property** — defines the token path
- **Property** — the CSS property type (e.g., `font-weight`, `font-size`); present only for typography rows
- **Value** — token reference used for the theme file
- **Default value** — raw value used for the default file
- **Description** — optional description
- **Name** — optional human-readable name for the token
- **Deprecated** — optional; the name of the custom property that replaces this one
- **Subcategory** — top-level group header (on rows with no API custom property)
- **category/group** — **ignored** (means something else; do not use)

## Rules

### Token rows (have "API custom property")

1. **Skip any row** where "API custom property" is empty. For non-typography categories, rows with a Subcategory or Name value are group headers and are an exception (see rules 7–8). For the **typography** category, skip **all** rows without an API custom property — group header rows are not exceptions and their metadata is not placed anywhere.
2. **Token path**: Take the "API custom property" value, strip the leading `--sky-theme-` prefix, then split on `-` to form the JSON nesting hierarchy. Underscores in segment names should be kept as-is.
3. **`$value` in the theme file**: Take the "Value" column value, strip the leading `--sky-` prefix, replace `-` with `.` to form dot notation, and wrap in `{}`. Example: `--sky-space-inline-l` → `{space.inline.l}`.
   **`$value` in the default file**: Use the "Default value" column as-is. If the value is a bare number with no units (e.g. `4`), append `px` (e.g. `4px`). **Exception for typography**: only append `px` for `fontSizes` tokens; for all other typography `$type` values, use bare numbers as-is.
4. **`$type`**: For non-typography categories, use the value from the category table above. For **typography**, derive `$type` from the `Property` column using the §Typography table above.
5. **`$description`**: Include only if the Description cell on the token row is non-empty.
6. **`$extensions`**: Include only if any extension fields are present. All extension properties must be nested inside a `"com.blackbaud.developer.docs"` namespace object:
   - **`name`**: Include if the "name" cell is non-empty. No additional formatting.
   - **`deprecatedCustomProperties`**: Include if the "deprecated" cell is non-empty. The value is the name of the replacing custom property — provide it as a single-element array.
   - **`cssProperty`**: For **typography** tokens only, include if the "Property" cell is non-empty. Use the value as-is.

### Group header rows (no "API custom property")

> **Note**: Rules 7 and 8 do not apply to the **typography** category — all rows without an API custom property are skipped entirely for that category (rule 1).

7. A row with a **"Subcategory"** value but no "API custom property" is a **top-level group header**. It does not produce a token. Instead, its metadata is placed on the **common parent JSON object** of the token rows that follow it:
   - `$extensions["com.blackbaud.developer.docs"].groupName` = the "Subcategory" value
   - `$description` = the "Description" value (if non-empty)
8. A row with a **"Name"** value but no individual token data is a **named-element header** that acts like a nested group header:
   - `$description` = the "Description" value (if non-empty)
   - `$extensions["com.blackbaud.developer.docs"].name` = the "Name" value (if non-empty)

### General

9. **Merge** the new tokens into each existing file — preserve any tokens already present and add/overwrite from the CSV.
10. **Top-level group name**: The top-level JSON object directly under `theme` (e.g., `space` for the `layout` category, `font` for `typography`, `color` for `color`) must have `$extensions["com.blackbaud.developer.docs"].groupName` set to the title-cased category name: `"Layout"` for layout, `"Typography"` for typography, `"Color"` for color, `"Border"` for border, `"Elevation"` for elevation. This applies to **both** the theme and default files.

## Example

Category: **layout**. Input CSV:

| subcategory | group | API custom property | Value | Default value | Description | name | deprecated |
|---|---|---|---|---|---|---|---|
| Inline spacing | | | | | Tokens for inline elements | | |
| | | `--sky-theme-space-inline-l` | `--sky-space-inline-l` | `16px` | Large inline | Inline L | |
| | | `--sky-theme-space-inline-m` | `--sky-space-inline-m` | `12px` | | | `--sky-theme-space-inline-l` |
| | Icon inline | | | | Spacing between icons | | |
| | | `--sky-theme-space-inline-icon-l` | `--sky-space-inline-icon-l` | `8px` | | Icon Large | |

`src/tokens/public/layout.json`:
```json
{
  "theme": {
    "space": {
      "$extensions": {
        "com.blackbaud.developer.docs": {
          "groupName": "Layout"
        }
      },
      "inline": {
        "$extensions": {
          "com.blackbaud.developer.docs": {
            "groupName": "Inline spacing"
          }
        },
        "$description": "Tokens for inline elements",
        "l": {
          "$value": "{space.inline.l}",
          "$type": "spacing",
          "$description": "Large inline",
          "$extensions": {
            "com.blackbaud.developer.docs": {
              "name": "Inline L"
            }
          }
        },
        "m": {
          "$value": "{space.inline.m}",
          "$type": "spacing",
          "$extensions": {
            "com.blackbaud.developer.docs": {
              "deprecatedCustomProperties": ["--sky-theme-space-inline-l"]
            }
          }
        },
        "icon": {
          "$extensions": {
            "com.blackbaud.developer.docs": {
              "groupName": "Icon inline"
            }
          },
          "$description": "Spacing between icons",
          "l": {
            "$value": "{space.inline.icon.l}",
            "$type": "spacing",
            "$extensions": {
              "com.blackbaud.developer.docs": {
                "name": "Icon Large"
              }
            }
          }
        }
      }
    }
  }
}
```

`src/tokens/public/default/layout.json`:
```json
{
  "theme": {
    "space": {
      "$extensions": {
        "com.blackbaud.developer.docs": {
          "groupName": "Layout"
        }
      },
      "inline": {
        "$extensions": {
          "com.blackbaud.developer.docs": {
            "groupName": "Inline spacing"
          }
        },
        "$description": "Tokens for inline elements",
        "l": {
          "$value": "16px",
          "$type": "spacing",
          "$description": "Large inline",
          "$extensions": {
            "com.blackbaud.developer.docs": {
              "name": "Inline L"
            }
          }
        },
        "m": {
          "$value": "12px",
          "$type": "spacing",
          "$extensions": {
            "com.blackbaud.developer.docs": {
              "deprecatedCustomProperties": ["--sky-theme-space-inline-l"]
            }
          }
        },
        "icon": {
          "$extensions": {
            "com.blackbaud.developer.docs": {
              "groupName": "Icon inline"
            }
          },
          "$description": "Spacing between icons",
          "l": {
            "$value": "8px",
            "$type": "spacing",
            "$extensions": {
              "com.blackbaud.developer.docs": {
                "name": "Icon Large"
              }
            }
          }
        }
      }
    }
  }
}
```

---

Category: **typography**. Input CSV (rows without an API custom property are skipped entirely):

| Subcategory | Name | Description | API custom property | Property | Value | Default value |
|---|---|---|---|---|---|---|
| Font families | | | | | | |
| | Primary font family | The font family used for all elements on a page. | `--sky-theme-font-family-primary` | | `--sky-font-family-primary` | `"BLKB Sans", "Helvetica Neue", Arial, sans-serif` |
| Headings | | Use headings to introduce sections of content. | | | | |
| | Heading 1 | Use for page titles and record names. | `--sky-theme-font-weight-heading-1` | `font-weight` | `--sky-font-style-heading-1` | `300` |
| | | | `--sky-theme-font-size-heading-1` | `font-size` | `--sky-font-size-heading-1` | `34` |
| | | | `--sky-theme-line_height-heading-1` | `line-height` | `--sky-font-line_height-heading-1` | `inherit` |
| | | | `--sky-theme-font-family-heading-1` | `font-family` | `--sky-font-family-primary` | `"BLKB Sans Condensed", "Helvetica Neue Condensed", "Arial Narrow"` |

`src/tokens/public/typography.json`:
```json
{
  "theme": {
    "font": {
      "$extensions": {
        "com.blackbaud.developer.docs": {
          "groupName": "Typography"
        }
      },
      "family": {
        "primary": {
          "$value": "{font.family.primary}",
          "$type": "fontFamilies",
          "$description": "The font family used for all elements on a page.",
          "$extensions": {
            "com.blackbaud.developer.docs": {
              "name": "Primary font family"
            }
          }
        },
        "heading": {
          "1": {
            "$value": "{font.family.primary}",
            "$type": "fontFamilies",
            "$extensions": {
              "com.blackbaud.developer.docs": {
                "cssProperty": "font-family"
              }
            }
          }
        }
      },
      "weight": {
        "heading": {
          "1": {
            "$value": "{font.style.heading.1}",
            "$type": "fontWeights",
            "$description": "Use for page titles and record names.",
            "$extensions": {
              "com.blackbaud.developer.docs": {
                "name": "Heading 1",
                "cssProperty": "font-weight"
              }
            }
          }
        }
      },
      "size": {
        "heading": {
          "1": {
            "$value": "{font.size.heading.1}",
            "$type": "fontSizes",
            "$extensions": {
              "com.blackbaud.developer.docs": {
                "cssProperty": "font-size"
              }
            }
          }
        }
      }
    },
    "line_height": {
      "heading": {
        "1": {
          "$value": "{font.line_height.heading.1}",
          "$type": "lineHeights",
          "$extensions": {
            "com.blackbaud.developer.docs": {
              "cssProperty": "line-height"
            }
          }
        }
      }
    }
  }
}
```

`src/tokens/public/default/typography.json`:
```json
{
  "theme": {
    "font": {
      "$extensions": {
        "com.blackbaud.developer.docs": {
          "groupName": "Typography"
        }
      },
      "family": {
        "primary": {
          "$value": "\"BLKB Sans\", \"Helvetica Neue\", Arial, sans-serif",
          "$type": "fontFamilies",
          "$description": "The font family used for all elements on a page.",
          "$extensions": {
            "com.blackbaud.developer.docs": {
              "name": "Primary font family"
            }
          }
        },
        "heading": {
          "1": {
            "$value": "\"BLKB Sans Condensed\", \"Helvetica Neue Condensed\", \"Arial Narrow\"",
            "$type": "fontFamilies",
            "$extensions": {
              "com.blackbaud.developer.docs": {
                "cssProperty": "font-family"
              }
            }
          }
        }
      },
      "weight": {
        "heading": {
          "1": {
            "$value": "300",
            "$type": "fontWeights",
            "$description": "Use for page titles and record names.",
            "$extensions": {
              "com.blackbaud.developer.docs": {
                "name": "Heading 1",
                "cssProperty": "font-weight"
              }
            }
          }
        }
      },
      "size": {
        "heading": {
          "1": {
            "$value": "34px",
            "$type": "fontSizes",
            "$extensions": {
              "com.blackbaud.developer.docs": {
                "cssProperty": "font-size"
              }
            }
          }
        }
      }
    },
    "line_height": {
      "heading": {
        "1": {
          "$value": "inherit",
          "$type": "lineHeights",
          "$extensions": {
            "com.blackbaud.developer.docs": {
              "cssProperty": "line-height"
            }
          }
        }
      }
    }
  }
}
```

---

Now process the following CSV and update both files:
