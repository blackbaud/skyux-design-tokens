---
mode: 'edit'
description: 'Fill out public API classes from a CSV'
---

Generate a JSON file conforming to the `PublicApiClasses` type from `@blackbaud/skyux-branding-builder`. The user will specify a **type** (e.g. `spacing`, `color`, `typography`, `borders`, `elevation`) at the start of their message. The output file is:

```
src/classes/public/<type>.json
```

## Types from `@blackbaud/skyux-branding-builder`

```ts
interface PublicApiClasses {
  groups?: PublicApiClassGroup[];
  styles?: PublicApiClass[];
}

interface PublicApiClassGroup {
  name: string;
  description?: string;
  groups?: PublicApiClassGroup[];
  styles?: PublicApiClass[];
  imageToken?: string;
}

interface PublicApiClass {
  name: string;
  className: string;
  properties: Record<string, string>;
  description?: string;
  deprecatedClassNames?: string[];
}
```

## CSV format

The CSV has these relevant columns (amongst others that should be ignored):
- **Category label** — section header (`Classes` or `Custom properties`)
- **Subcategory** — top-level group name
- **Group** — nested sub-group name within a subcategory
- **Description** — optional description for groups or classes
- **Name** — human-readable name for the class
- **API class** — the CSS class name (prefixed with `.`)
- **API custom property** — used by a different prompt; rows with this set should be **skipped**
- **Property** — CSS property name (e.g. `margin-top`, `padding`)
- **Value** — CSS value for the property
- **Default value** — **ignored** in this prompt
- **Deprecated** — optional; the deprecated class name this one replaces

## Rules

### Section filtering

1. **Only process rows under the `Classes` category label.** Skip all rows under `Custom properties` or any other category label. Also skip any row where **API custom property** is set.

### Class rows (have "API class")

2. **`className`**: Strip the leading `.` from the "API class" value.
3. **`name`**: Use the "Name" column. If "Name" is empty, derive it by humanizing the class name (strip `sky-theme-` prefix, replace `-` with spaces, title-case). **Alert the user** when a name was missing so they can fix the source data.
4. **`description`**: Include only if the "Description" cell on the class row is non-empty.
5. **`deprecatedClassNames`**: Include only if the "Deprecated" cell is non-empty. Provide the value as a single-element array.
6. **`properties`**: Build from the "Property" (key) and "Value" (value) columns.
   - If a value contains custom property references (tokens starting with `--`), wrap **each one** in `var()`. For example: `--sky-theme-space-stacked-xs` → `var(--sky-theme-space-stacked-xs)`. If multiple custom properties appear in a single value (e.g. shorthand), wrap each one individually.
   - Non-custom-property values (e.g. `none`, `0`, `solid`) are used as-is.

### Multi-property classes

7. Sometimes a class sets more than one CSS property. This is indicated by **additional rows immediately below** the class row that have only "Property" and "Value" set (no "API class" or "Name"). Merge these additional property/value pairs into the **same class's `properties` object**.

### Group header rows

8. A row with a **Subcategory** value (and no "API class" or "API custom property") is a **top-level group** (`PublicApiClassGroup`). Use "Subcategory" as `name` and "Description" as `description` (if non-empty). Class rows that follow belong in this group's `styles` array, unless they fall under a sub-group.
9. A row with a **Group** value (and no "API class" or "API custom property") is a **nested sub-group** within the current subcategory. Use "Group" as `name` and "Description" as `description` (if non-empty). It belongs in the parent group's `groups` array. Class rows that follow belong in this sub-group's `styles` array.

### General

10. **Merge** new data into the existing file if one exists — preserve any groups/styles already present and add/overwrite from the CSV.
11. Omit optional fields (`description`, `deprecatedClassNames`, `groups`, `styles`) when they would be empty or undefined.

## Example

Type: **spacing**. Input CSV:

| Category label | Subcategory | Group | Description | Name | API class | API custom property | Property | Value | Default value | Deprecated |
|---|---|---|---|---|---|---|---|---|---|---|
| Classes | | | | | | | | | | |
| | Stacked margin | | | | | | | | | |
| | | Margin top | Use these classes to add a top margin. | | | | | | | |
| | | | | Margin top xs | .sky-theme-margin-top-xs | | margin-top | --sky-theme-space-stacked-xs | 5 | |
| | | | | Margin top s | .sky-theme-margin-top-s | | margin-top | --sky-theme-space-stacked-s | 8 | |
| | | Margin bottom | Use these classes to add a bottom margin. | | | | | | | |
| | | | | Margin bottom xs | .sky-theme-margin-bottom-xs | | margin-bottom | --sky-theme-space-stacked-xs | 5 | sky-margin-stacked-xs |
| | Insets within elements | | Use these classes to add inset padding. | | | | | | | |
| | | Balanced | | | | | | | | |
| | | | | Padding inset balanced xs | .sky-theme-padding-inset-balanced-xs | | padding | --sky-theme-space-inset-balanced-xs | 5 | |
| Custom properties | | | | | | | | | | |
| | Stacked space | | | | | --sky-theme-space-stacked-xs | | --sky-space-stacked-xs | 5 | |

`src/classes/public/spacing.json`:
```json
{
  "groups": [
    {
      "name": "Stacked margin",
      "groups": [
        {
          "name": "Margin top",
          "description": "Use these classes to add a top margin.",
          "styles": [
            {
              "name": "Margin top xs",
              "className": "sky-theme-margin-top-xs",
              "properties": {
                "margin-top": "var(--sky-theme-space-stacked-xs)"
              }
            },
            {
              "name": "Margin top s",
              "className": "sky-theme-margin-top-s",
              "properties": {
                "margin-top": "var(--sky-theme-space-stacked-s)"
              }
            }
          ]
        },
        {
          "name": "Margin bottom",
          "description": "Use these classes to add a bottom margin.",
          "styles": [
            {
              "name": "Margin bottom xs",
              "className": "sky-theme-margin-bottom-xs",
              "properties": {
                "margin-bottom": "var(--sky-theme-space-stacked-xs)"
              },
              "deprecatedClassNames": ["sky-margin-stacked-xs"]
            }
          ]
        }
      ]
    },
    {
      "name": "Insets within elements",
      "description": "Use these classes to add inset padding.",
      "groups": [
        {
          "name": "Balanced",
          "styles": [
            {
              "name": "Padding inset balanced xs",
              "className": "sky-theme-padding-inset-balanced-xs",
              "properties": {
                "padding": "var(--sky-theme-space-inset-balanced-xs)"
              }
            }
          ]
        }
      ]
    }
  ]
}
```

Note: The `Custom properties` section and the `--sky-theme-space-stacked-xs` row were skipped entirely.

---

Now process the following CSV and generate the file:
