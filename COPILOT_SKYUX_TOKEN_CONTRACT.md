# SKY UX Design Tokens
## Copilot Contract (Authoritative, Non‑Interpretive)

**Scope**  
This document defines the rules Copilot (and other AI tooling) must follow when analyzing, auditing, or comparing SKY UX design tokens.

The goal is to eliminate interpretation, assumption, and external bias.  
Copilot must reason strictly from SKY UX’s **generated artifacts and tests**, not from design intent or other design systems.

---

## 1. Authoritative Sources of Truth ✅

Copilot MUST treat **only the following** as authoritative:

### ✅ Generated artifacts
- `json/design-tokens.json`
- Generated CSS custom properties (published token outputs)
- Snapshot test results and diffs produced by the token build pipeline

These artifacts represent the **actual consumed contract** of SKY UX tokens.

### ❌ Explicitly non‑authoritative
- `src/design-tokens.yml` (obsolete authoring source)
- Design intent not reflected in generated outputs
- Any inferred luminance logic, surface recipes, or perceptual models
- Any assumptions derived from other design systems (Carbon, Fluent, etc.)

If a semantic does **not** appear in generated outputs or tests, it is **not considered present**.

---

## 2. Token Architecture (Non‑Negotiable Model)

SKY UX uses a strict, layered token architecture.

### 2.1 Base tokens
- Namespace: `bb.*`
- Characteristics:
  - Raw values only (hex, rem, px, etc.)
  - No semantic meaning
- RULES:
  - ❌ Never recommend splitting, duplicating, or proliferating base tokens  
    (e.g. “split `bb.color.blue.600`” is invalid)
  - ❌ Never attach intent or semantics to base tokens

### 2.2 Reference tokens
- Namespace: `sky.*`
- Characteristics:
  - Encode **semantic intent**
  - Resolve to other tokens (usually base tokens)
- RULES:
  - ✅ All semantic analysis and recommendations must occur at this layer
  - ✅ Overload, gaps, and drift are ref‑level concepts only

### 2.3 Token sets (themes / modes / brands)
- Characteristics:
  - Reuse identical reference token names
  - Change only resolved values
  - Light/dark behavior is achieved via **value remapping**, not renaming
- RULE:
  - A value change across modes ≠ semantic drift

---

## 3. Evidence‑Only Gap Detection

Copilot MUST NOT infer gaps.

Before declaring a semantic gap, Copilot must:

1. Search generated token outputs for an equivalent semantic
2. Check whether the concept exists under a different name or composition
3. If not found, explicitly state:
   > “Not found in generated SKY UX token outputs”

Only then may the gap be reported.

### Valid classifications
- ✅ Present – explicitly exists in generated outputs
- ⚠️ Overload – multiple semantic roles share a reference token
- 🔴 Absent – no semantic equivalent exists in outputs
- 🔴 Drift – semantic meaning changes unintentionally across modes

Absence ≠ deficiency.  
Some semantics may be intentionally out of scope.

---

## 4. Overload vs Drift (Strict Definitions)

### 4.1 Semantic overload
Occurs when:
- Distinct semantic roles share a reference token
- Those roles cannot diverge independently in the future

✅ Frame overload findings as:
> “These semantic roles share a reference token”

❌ Do NOT frame overload as:
> “Split the base color”

---

### 4.2 Semantic drift
Occurs only when:
- A reference token’s **intended role changes unintentionally** across modes

✅ Value shifts for contrast or accessibility are valid  
❌ Copying light‑mode values into dark mode unintentionally is drift

---

## 5. Dark Mode Rules (No Assumptions)

- Dark mode in SKY UX is **declarative**
- There is **no algorithmic luminance engine**
- There are **no implicit surface ladders**
- All behavior must be proven via generated outputs or tests

Copilot MUST NOT:
- Assume perceptual color models
- Assume surface or elevation recipes
- Assume “text‑on‑color” logic unless explicitly present in outputs

Any dark‑mode recommendation must reference:
- Observed contrast failures
- Snapshot diffs
- Explicit tests

---

## 6. External Design System Comparisons

External systems (Carbon, Fluent, Atlassian, etc.) may be used **only as semantic pressure tests**, never as targets.

RULES:
- ✅ Use them to describe what they can express
- ✅ Then verify whether SKY UX outputs express the same semantic
- ❌ Never assume SKY UX should adopt their structures
- ❌ Never propose changes unless a SKY UX limitation is proven by outputs

All comparison findings must be phrased as:
> “External system X expresses Y; SKY UX outputs do / do not express this semantic.”

---

## 7. Prohibited Behaviors 🚫

Copilot must never:
- Propose splitting or modifying base tokens
- Invent tokens to complete a comparison
- Infer intent, roadmap, or future direction
- Treat absence as failure
- Introduce perceptual or algorithmic logic not present in outputs

---

## 8. Preferred Remediation Strategies ✅

When issues are identified, prefer:

1. Clarifying or adding **reference‑level semantics**
2. Adjusting **theme/mode value mappings**
3. Adding **tests or snapshot assertions**
4. Documenting **semantic pairing rules**

Avoid:
- Base‑token changes
- Palette restructuring
- Architectural overhauls

---

## 9. One‑Sentence Rule for Copilot

> Reason strictly from generated SKY UX token outputs and tests.  
> Never modify base tokens, never infer semantics, and only declare gaps when something is provably absent.