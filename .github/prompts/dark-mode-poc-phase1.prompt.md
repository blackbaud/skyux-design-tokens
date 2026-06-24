# Dark Mode PoC Prompt: Phase 1 Implementation

## Context & Goals

We're shipping a visually polished SKY UX dark mode in ~4 months (Phase 1). This PoC must be production-ready in look and feel, but constrained: no token architecture changes, no light-mode impact, and it must respect our existing palette structure. Long-term, we plan to migrate to OKLCH-native tokens, but Phase 1 is about making dark mode work *within* the current system.

## What This PoC Must Do

1. Deliver a cohesive, visually distinct dark surface layering (page → container → overlay/modal).
2. Ensure all text meets **WCAG AA minimum** (4.5:1 body text, 3:1 headings, 3:1 non-text boundaries).
3. Solve two critical contrast problems:
   - **Inline interaction colors vs. body text**: Interaction colors (links, buttons) must meet 4.5:1 when placed inline with default body text.
   - **Interaction colors on surface backgrounds**: Interaction colors must meet 4.5:1 directly on any surface (page, container, overlay).
4. Keep visual distinction between surfaces *similar to the attached screenshot* — clear hierarchy via lightness/depth, not just border treatment.
5. Aim for **APCA compliance where feasible** (not mandatory, but preferred for perception-based precision).

## What You Can Modify

- **Hyperlinks**: Underline all hyperlinks by default (this is a permitted mitigation for the inline text contrast issue).
- **Darker base palette values (800 and above)**: You may tweak darker tokens using OKLCH-to-hex approximation to improve contrast while staying visually coherent. For example, if `gray.800` currently doesn't provide enough separation from `gray.900`, you can adjust it via OKLCH math to find a value that maintains the visual ramp but lifts contrast. Document these tweaks clearly.
- **Interactive color stops**: You can adjust blue, red, green, orange (action/status colors) within the existing palette stops to meet inline and surface contrast needs.

## What You Cannot Change

- Token architecture, naming, or structure.
- Light-mode token values or behavior.
- The base palette families (you can't introduce new hues; only tweak saturation/lightness within existing families).

## Implementation Approach

1. Start from the existing [src/tokens/color/base-dark.json](src/tokens/color/base-dark.json) and [src/tokens/base-blackbaud.json](src/tokens/base-blackbaud.json) as your source of truth.
2. Model surface layering: confirm L0 (page), L1 (container), L2 (backdrop/overlay), L3 (modal) are visually distinct and satisfy contrast for default text.
3. Model interaction colors: ensure link, button, and status colors pass 4.5:1 when paired with body text on any surface, and when placed on surfaces themselves.
4. Use OKLCH → hex approximation to make tweaks transparent and reproducible (e.g., "original gray.800 #3b4047 → adjusted gray.800 #42464d via oklch(0.28, 0.01, 255)").
5. Build a turnkey demo/report showing:
   - Surface contrast matrix (page + container + overlay + modal, each with body text, deemphasized text, heading, link).
   - Interaction color contrast matrix (links, buttons, status colors on each surface).
   - Visual hierarchy comparison (before/after, if applicable).
   - WCAG/APCA compliance summary.
6. Follow the pattern: "Here's an example of how I'd tweak gray.800 from `#3b4047` to `#42464d` using OKLCH; please follow this pattern for other adjustments"

## Deliverables

- Updated dark token values (or JSON-like proposal if not directly modifying files).
- A visual PoC or sandbox showing the dark mode with all surfaces and interaction colors rendered.
- Clear documentation of any palette tweaks made and the OKLCH reasoning behind them.
- A contrast compliance report (WCAG + APCA observations).

## Constraints

- **WCAG AA mandatory** for all text-on-background pairs.
- **APCA preferred** where it provides meaningful perceptual improvement without breaking WCAG.
- **Visual cohesion required**: surfaces should feel like a unified dark system, not a collection of individual contrast fixes.
- **Underline all links** to mitigate inline text contrast; this is a permitted trade-off.