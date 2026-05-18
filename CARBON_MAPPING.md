# Carbon Design System Token Mapping Reference
## For SKY UX Remap Analysis

### Carbon's Overall Structure

Carbon organizes semantic colors into layers:
1. **Interactive Colors**: `ui-01`, `ui-02`, `ui-03`, `ui-04`, `ui-05` (background hierarchy)
2. **Action Colors**: `interactive` (primary action), `interactive-secondary` (secondary)
3. **Status Colors**: `support-error`, `support-warning`, `support-success`, `support-info`
4. **Text Colors**: `text-primary`, `text-secondary`, `text-placeholder`, `text-helper`, `text-on-color`
5. **Border Colors**: `border-subtle`, `border-strong`, `border-disabled`

---

## SKY UX to Carbon Mapping Table

### Text Layer

| SKY UX Token | Light Value | Dark Value | Carbon Equivalent | Gap / Overload |
|---|---|---|---|---|
| `text.default` | gray.1000 | gray.25 | `text-primary` | ✓ Maps cleanly |
| `text.deemphasized` | gray.600 | gray.300 | `text-secondary` | ✓ Maps cleanly |
| `text.action` | blue.600 | blue.400 | `interactive` or `link-primary` | ⚠ Overloaded: also used for icon, selected text |
| `text.danger` | red.600 | red.400 | `support-error` | ✓ Maps cleanly |
| `text.heading` | gray.1100 | gray.50 | `text-primary` (emphatic) | ⚠ No distinct "heading" token in Carbon; uses same as primary |
| `text.inverse` | white | gray.1100 | `text-on-color` | ⚠ Only used on heavy backgrounds; Carbon pairs it with specific background context |
| `text.selected` | blue.600 | blue.400 | **[MISSING IN CARBON]** | 🔴 Gap: No "selected text" semantic |
| `text.action_contrast` | gray.1000 | gray.1000 | `text-on-color` | 🔴 **DRIFT**: Doesn't change in dark mode; should be white or context-aware |

**Findings**:
- `text.selected` is not a standard semantic in Carbon; selected state is managed via background (e.g., checkbox filled) + container highlight, not text color.
- `text.action_contrast` failing to adapt in dark mode is a bug (see current contrast work).

---

### Icon Layer

| SKY UX Token | Light Value | Dark Value | Carbon Equivalent | Gap / Overload |
|---|---|---|---|---|
| `icon.default` | gray.1000 | gray.25 | `icon-primary` | ✓ Maps |
| `icon.deemphasized` | gray.600 | gray.300 | `icon-secondary` | ✓ Maps |
| `icon.action` | blue.600 | blue.400 | `icon-interactive` | ⚠ Overload: also text.action, selected, info |
| `icon.danger` | red.600 | red.400 | `icon-error` or `icon-support-error` | ✓ Maps (status-specific) |
| `icon.warning` | yellow.400 | yellow.400 | `icon-warning` or `icon-support-warning` | ✓ Maps (status-specific) |
| `icon.success` | green.600 | green.700 | `icon-success` | ✓ Maps (status-specific) |
| `icon.info` | blue.600 | blue.400 | `icon-info` or `icon-support-info` | 🔴 **OVERLOAD**: Uses same as icon.action and text.action |
| `icon.inverse` | white | gray.1100 | `icon-inverse` | ✓ Maps to text-on-color context |
| `icon.eyebrow` | brand.impact_green | brand.impact_green | **[BRAND-SPECIFIC]** | Brand token; not in Carbon; acceptable custom extension |

**Findings**:
- SKY UX correctly separates status icons (warning, success, info, danger) unlike some systems.
- `icon.info` and `icon.action` both use blue.600 (light) / blue.400 (dark)—conflates "informational icon" with "action icon."
- Carbon would split: `icon-interactive` (primary action) vs. `icon-info` (semantic status).

---

### Background Layer

#### Containers

| SKY UX Token | Light Value | Dark Value | Carbon Equivalent | Gap / Overload |
|---|---|---|---|---|
| `background.container.base` | white | gray.1000 | `ui-01` (lightest, default container) | ✓ Maps |
| `background.container.menu` | white | gray.900 | `ui-02` (slightly emphasized) | ⚠ Specific to menu; Carbon uses generic hierarchy |
| `background.container.danger` | red.600 | red.600 | `background-error` or status layer | 🔴 **CRITICAL**: Fails text contrast in light mode (3.51:1); unchanged in dark |
| `background.container.warning` | yellow.600 | yellow.600 | `background-warning` | ⚠ Unused color in dark mode (stays yellow.600; text may fail) |
| `background.container.success` | green.600 | green.600 | `background-success` | ⚠ Same issue as danger/warning |
| `background.container.info` | blue.600 | blue.600 | `background-info` | 🔴 **OVERLOAD + SEMANTIC DRIFT**: Shares color with primary button |

**Findings**:
- Status containers are not adapting properly in dark mode; design risk.
- Container semantic is well-defined but lacks hierarchy (primary/secondary/tertiary).
- `background.container.info` collides with `background.action.primary.base` (both blue.600 light, blue.400 dark).

#### Action Backgrounds (Buttons)

| SKY UX Token | Light | Dark | Carbon Equivalent | Gap / Overload |
|---|---|---|---|---|
| `background.action.primary.base` | blue.600 | blue.400 | `button-primary` | ✓ Maps; but value shared with info container |
| `background.action.primary.hover` | blue.700 | blue.400 | `button-primary-hover` | ✓ Hover state |
| `background.action.primary.active` | blue.800 | sky.500 | `button-primary-active` | ✓ Active state; note: dark mode uses sky.500 (different hue!) |
| `background.action.secondary.base` | white | gray.800 | `button-secondary` | ✓ Maps |
| `background.action.secondary.hover` | blue.50 | transparent | `button-secondary-hover` | ✓ Maps; note: dark uses transparent (outline style) |
| `background.action.tertiary.base` | transparent | transparent | **[CUSTOM]** Tertiary button | Not in Carbon; SKY UX custom |
| `background.action.tertiary.hover` | blue.50 | transparent | Tertiary hover state | ✓ Consistency |
| `background.action.danger.base` | red.600 | red.400 | `button-danger` | ✓ Maps |
| `background.action.danger.hover` | red.700 | red.400 | `button-danger-hover` | ⚠ Dark mode doesn't shift for hover—reuses base |
| `background.action.input.*` | white / blue.50 / blue.100 | blue.900 / transparent | **[CUSTOM]** Form input background | SKY-specific; Carbon uses generic interactive colors |
| `background.action.accent.base` | white | gray.1000 | **[MISSING IN CARBON]** Accent button | 🔴 Gap: No accent button variant in Carbon |

**Findings**:
- Button states are well-structured (base/hover/active/focus/disabled).
- Dark mode: Some states reuse base color instead of distinct hover (e.g., primary.hover is blue.400, same as base).
- Danger hover doesn't change in dark mode (red.400 → red.400), which might not provide enough visual feedback.
- Accent button exists but no external equivalent; likely SKY-specific requirement.

---

### Border Layer

| SKY UX Token | Light Value | Dark Value | Carbon Equivalent | Gap / Overload |
|---|---|---|---|---|
| `border.disabled` | gray.300 | gray.800 | `border-disabled` | ✓ Maps |
| `border.divider` | gray.300 | gray.800 | `border-subtle` | ✓ Maps |
| `border.selected` | blue.600 | blue.400 | `border-interactive` or `border-strong` | ✓ Maps; overloaded with 40+ other uses |
| `border.selected_soft` | blue.300 | blue.500 | **[CUSTOM]** Soft selection | SKY-specific; lighter emphasis |
| `border.danger` | red.800 | red.800 | `border-error` | ✓ Maps; note: unchanged in dark (value difference, not intent change) |
| `border.warning` | yellow.800 | yellow.800 | `border-warning` | ✓ Maps; unchanged in dark |
| `border.success` | green.800 | green.800 | `border-success` | ✓ Maps; unchanged in dark |
| `border.info` | blue.800 | blue.800 | `border-info` | ✓ Maps; unchanged in dark; **overload**: blue.800 appears for both info and primary button interactions |
| `border.input.base` | gray.300 | blue.200 | `border-subtle` (form input) | ⚠ Input borders shift to blue in dark mode—possible semantic drift |
| `border.input.error` | red.600 | red.400 | `border-error` | ✓ Maps; reuses danger border logic |

**Findings**:
- Border semantic is sound (disabled, divider, selected, status).
- `border.input.base` changes from neutral gray → blue in dark mode, which might signal "active" incorrectly.
- Status borders (danger, warning, success, info) don't adapt values in dark mode; relies on overall page contrast being sufficient.

---

### Other Layers (Viz, Classify, Category, Illustration)

These are **non-standard** extensions not found in Carbon, Fluent, or Atlassian:

| SKY UX Layer | Purpose | Carbon Equivalent | Notes |
|---|---|---|---|
| `viz.axis`, `viz.gridline`, `viz.marker` | Chart elements | `chart-*` (not in this mapping) | Domain-specific |
| `viz.category[1-6]` | Chart series colors | Chart palette | Specialized; not applicable |
| `viz.diverge[1-10]`, `viz.sequence[1-10]` | Diverging / sequential color schemes | Chart palettes | Domain-specific |
| `classify[1-7].heavy/.soft` | Classification backgrounds (calendar, tags) | Not in Carbon | SKY-specific multi-category feature |
| `category.green/.teal/.purple/etc.` | Classification text / accent colors | Not in Carbon | SKY-specific |
| `illustration.stroke/.fill.heavy/soft/softest` | Illustration color roles | Not in Carbon | Art-direction specific |

---

## Remap Summary

### What Maps Cleanly (✓)
- Primary/secondary/danger buttons
- Error/warning/success/info status text
- Primary/secondary/deemphasized text
- Basic container backgrounds
- Disabled states

### What Doesn't Map (🔴 Gaps)
- Selected text color (not a standard semantic in modern systems)
- Text-on-color per-status (e.g., text-on-danger, text-on-warning)
- Visited link color
- Accent button (brand secondary action)
- Input-specific background colors
- Illustration and viz-specific roles

### What's Overloaded (⚠ Overload)
- `blue.600` (40+ uses): primary action, info state, secondary interactions, etc.
- `red.600` (10+ uses): danger, error, destructive action
- Status containers reusing action colors

### What Shows Semantic Drift (🔴 Drift)
- `text.action_contrast` not adapting in dark mode
- Input border shifting to blue in dark (possible false "active" signal)
- Status containers (danger, warning, success, info) unchanged in dark mode
- Some button hover states not changing for dark mode

---

## Recommendations

1. **Split blue.600 into distinct tokens**:
   - `color.background.primary` (button base)
   - `color.background.info` (info container)
   - `color.text.action` (links, action text)
   - `color.border.interactive` (focus rings, interactive borders)

2. **Add per-status text-on-color tokens**:
   - `color.text.on-danger`, `color.text.on-warning`, etc.
   - Automatically resolve to white or dark depending on background luminance

3. **Fix dark mode value drift**:
   - Audit `text.action_contrast` and other copied values
   - Ensure values are intentionally adaptive or intentionally static

4. **Add visited link semantic** (if needed):
   - `color.text.visited` (currently missing)

5. **Document token pairing rules**:
   - "These tokens must be used together: text + container"
   - "This token only works on this background"
