# SKY UX Token Remap Analysis
## Lossless Mapping Against Carbon / Fluent / Atlassian / SLDS

**Goal**: Identify semantic gaps, overload, and dark mode drift in SKY UX's token architecture by mapping reference tokens to external systems.

---

## 1. SKY UX Architecture Overview

### Base Tokens (base-blackbaud.json)
Raw color values only: `bb.color.{family}.{level}` (e.g., `bb.color.blue.600`)
- Families: gray, blue, red, yellow, green, white, black, etc.
- Levels: 0–1100+ (not uniform scale)

### Reference Tokens (base-light.json, base-dark.json)
Semantic intent layer:
- **Text**: For typography on various backgrounds
- **Icon**: For icon glyphs and symbol color
- **Background**: For container fill, button states, input fill, etc.
- **Border**: For strokes, dividers, focus rings, etc.
- Other: viz, category, classify, illustration (specialized)

### Brand Overrides (bb-light.json, bb-dark.json)
Blackbaud-specific customizations of reference tokens.

---

## 2. Major Semantic Overload Findings

### CRITICAL: `{bb.color.blue.600}` (40+ references in base-light)

| Semantic Role | Context | Sky UX Token | Expected in Carbon |
|---|---|---|---|
| Primary action text | Links, link buttons | `text.action` | `text-primary` or `link-primary` |
| Primary action background | Primary button base | `background.action.primary.base` | `button-primary` |
| Info container background | Alert / status box | `background.container.info` | `background-informational` |
| Info icon color | Status indicators | `icon.info` | `icon-info` |
| Secondary button hover | Non-primary button | `border.action.secondary.hover` | (distinct border layer) |
| Nav item border hover | Navigation active | `border.nav.hover` | `border-strong` or component-specific |

**Overload Pattern**: 
- Multiple distinct **semantic intents** (primary action, info state, secondary interaction) collapse into one color
- In Carbon: these would be `ui-01` (primary), `ui-03` (secondary), and `support-info` (semantic)
- **Dark mode impact**: When this value changes from `blue.600` → `blue.400`, all 40+ uses shift together. No way to adjust primary button and info container independently.

### HIGH: `{bb.color.red.600}` (10+ references)

| Semantic Role | Context | Sky UX Token | Expected in Carbon |
|---|---|---|---|
| Danger text | Error labels | `text.danger` | `text-error` |
| Danger icon | Error indicators | `icon.danger` | `icon-error` |
| Danger button base | Destructive action | `background.action.danger.base` | `button-danger` |
| Danger container bg | Alert backgrounds | `background.container.danger` | `background-danger` |
| Danger border | Status borders | `border.danger` | `border-danger` |

**Overload Pattern**:
- "Danger" semantic is well-defined but **lacks intermediate states**
- E.g., error in border (`border.input.error`) and error in switch (`border.switch.error`) both use `red.600`, but in Carbon these might differentiate by affordance (interactive vs. informational).
- **Dark mode risk**: If dark-mode changes danger from `-600` to `-400`, all error states shift together.

### MEDIUM: Disabled State Indirection

SKY UX uses **reference token references**:
```json
"background.action.primary.disabled": "{color.background.disabled}"
"color.background.disabled": "{bb.color.gray.100}"  // light mode only
```

**Issues**:
- No semantic distinction between permission-based disable and validation-error disable
- Carbon separates: `disabled` (grayed out, no interaction) vs. `inverse` (high contrast, e.g., on dark backgrounds)
- **Dark mode drift**: In dark mode, `background.disabled` shifts to `gray.700`, but the reference structure masks whether this is intentional semantic change or just a value flip.

---

## 3. Semantic Gaps: What External Systems Express That SKY UX Doesn't

### From Carbon's Semantic Structure

| Carbon Semantic | Purpose | SKY UX Equivalent | Gap Identified |
|---|---|---|---|
| `ui-01` (lightest interactive) | Secondary button base, subtle hover | `blue.50` (implicit in hover) | No primary reference token; only appears in nested `background.action.secondary.hover` |
| `ui-02` (interactive) | Borders, field separators | `blue.100` (implicit) | Same—no top-level reference token |
| `ui-03` (border) | Input borders, dividers | Scattered in `border.divider`, `border.input.base` | No unified "border color token" for non-status borders |
| `visited` | Visited link color | **Not present** | Cannot distinguish visited from primary action links |
| `inverse-hover` | Hover on inverse backgrounds | **Not present** | Can't express dark-background interactive states cleanly |
| `hover-secondary` | Distinct secondary hover state | **Implicit in `background.action.secondary.hover`** | Must nest; not a reusable token |
| `text-on-color` (for status) | Text that must meet 4.5:1 on colored background | `text.action_contrast` | Conflates with `text.default`; no per-status variant (`text-on-danger`, `text-on-warning`) |

### From Fluent's Token Structure

| Fluent Semantic | Purpose | SKY UX Equivalent | Gap |
|---|---|---|---|
| `surface-primary`, `surface-secondary`, `surface-tertiary` | Three levels of container hierarchy | `background.container.base`, implied for others | No explicit "primary" vs. "secondary" container distinction |
| `stroke-focus`, `stroke-strong`, `stroke-subtle` | Three border weights/emphases | All borders are `border.*` without emphasis hierarchy | Cannot express "light divider" vs. "strong focus ring" with same token |
| `text-primary` on `stroke-primary` context | Bound text-to-background pair | Text and borders are separate token trees | No way to declare "these tokens must work together" |
| `accent` (independent from primary) | Brand-distinct secondary action | **Not present** (blue is primary, no accent) | Single primary action color; no secondary accent brand color |

### From Atlassian's Approach

| Atlassian Semantic | Purpose | SKY UX Equivalent | Gap |
|---|---|---|---|
| `interactive` (surface) | Button, link base | `background.action.primary.base` | Collapsed into blue.600 everywhere |
| `selected` (surface) | Selected item highlight | `background.selected.heavy` | Nested; not composed with text |
| `neutral` (surface) | Neutral card, container | `background.container.base` | Uses `white` always; no distinction for subtle neutral boxes |
| State matrix (checked, pressed, disabled, loading, etc.) | Explicit state combinations | Implicit in `base`, `hover`, `active`, `focus`, `disabled` | No loading state; focus and hover are often the same |

---

## 4. Dark Mode Semantic Drift

### Case 1: Text on Colored Background

**SKY UX base-light:**
```json
"text.action_contrast": "{bb.color.gray.1000}"  // #1e2229
"background.container.danger": "{bb.color.red.600}"  // #d93a3d
```
→ Ratio: 3.51:1 (FAIL at AA 4.5:1)

**SKY UX base-dark:**
```json
"text.action_contrast": "{bb.color.gray.1000}"  // #1e2229 (unchanged!)
"background.container.danger": "{bb.color.red.600}"  // #d93a3d (unchanged!)
```
→ **Semantic drift**: Text color didn't change, but background stays the same—likely an error, not intentional.

**Finding**: Dark mode copies light values wholesale in some places, suggesting incomplete semantic redesign. Should be:
```json
// base-dark
"text.action_contrast": "{bb.color.white}"  // intentional shift for dark bg
"background.container.danger": "{bb.color.red.700}" or other dark-appropriate value
```

### Case 2: Primary Button Behavior

**SKY UX base-light:**
```json
"background.action.primary.base": "{bb.color.blue.600}"
"border.action.primary.base": "{bb.color.blue.600}"
```

**SKY UX base-dark:**
```json
"background.action.primary.base": "{bb.color.blue.400}"
"border.action.primary.base": "{bb.color.blue.400}"
```

**Analysis**: This is a **value shift**, not semantic drift. Primary button remains "primary" in both modes; only lightness changes. ✓ Correct.

### Case 3: Disabled Button Semantic

**SKY UX base-light:**
```json
"background.action.primary.disabled": "{color.background.disabled}"
"color.background.disabled": "{bb.color.gray.100}"
```

**SKY UX base-dark:**
```json
"background.action.primary.disabled": "{color.background.disabled}"
"color.background.disabled": "{bb.color.gray.700}"
```

**Analysis**: 
- **Light mode**: gray.100 (very light, subtle on white page bg)
- **Dark mode**: gray.700 (moderately dark, subtle on gray.1000 page bg)
- This is correct **adaptive value shift** for contrast purposes. Semantic meaning stays: "disabled state is grayed out."
- However: If button text is always `text.default`, dark-mode disabled button text might fail contrast. **Drift risk**.

---

## 5. Summary Table: Findings by Category

| Category | Finding | Severity | Recommendation |
|---|---|---|---|
| **Overload** | `blue.600` does 40+ jobs | CRITICAL | Split into: `color.text.action`, `color.background.primary`, `color.background.info`, `color.border.primary` |
| **Overload** | `red.600` does danger + error boundary | HIGH | Add `color.border.error` (distinct from `border.danger` for containers) |
| **Gap** | No "visited link" token | MEDIUM | Add `color.text.visited` for link state |
| **Gap** | No per-status "text-on-color" tokens | HIGH | Add `color.text.on-danger`, `color.text.on-warning`, etc. |
| **Gap** | No container hierarchy (primary / secondary / tertiary) | MEDIUM | Add explicit levels or drop if not needed |
| **Gap** | No "accent" color (brand secondary action) | LOW | Not needed if single action color is sufficient |
| **Drift** | Text on danger container fails AA in light mode | CRITICAL | Fix immediately (your current work) |
| **Drift** | Disabled button text might fail contrast in dark | MEDIUM | Test disabled button text in dark mode |
| **Drift** | Some tokens copy light values into dark without adaptation | MEDIUM | Audit all copied values; ensure intentional |

---

## 6. Next Steps

- [ ] **Extract Carbon's token hierarchy** and create side-by-side mapping table
- [ ] **Audit dark mode values** for unintended copies (e.g., `text.action_contrast` in dark)
- [ ] **Propose new reference tokens** for missing semantics (visited, per-status text-on-color, etc.)
- [ ] **Test contrast** for all text-background pairs in light and dark
- [ ] **Document explicit "token pairing rules"** (e.g., text on danger container must always be X)
- [ ] **Create "semantic rules" doc** (e.g., "container tokens do not nest inside each other")
