# Phase 1 Dark Mode PoC - Quick Start Guide

## 📋 Deliverables Overview

This Phase 1 implementation includes a complete dark mode PoC with WCAG AA compliance validation and visual matrices.

### Files Created

| File | Purpose |
|------|---------|
| **DARK_MODE_POC_ANALYSIS.md** | Comprehensive analysis, compliance report, and recommendations (start here) |
| **PALETTE_TWEAKS.csv** | Palette tweak documentation with OKLCH reasoning and contrast data |
| **DARK_MODE_POC_COMPLIANCE_REPORT.json** | Structured compliance data for tooling integration |
| **DARK_MODE_POCQUICK_START.md** | This file — navigation guide |

---

## 🎨 Viewing the PoC Sandbox

The PoC is embedded in the development sandbox at `src/dev/main.ts`. To view it:

### 1. Start the dev server (if not running)
```bash
npm run dev
```

Then open: http://localhost:5176

### 2. Navigate to the PoC

**Option A: Dark PoC Report (recommended)**
```
?local-preview=sandbox
&data-layering=dark-poc
&data-demo-target=gray
&data-nav-page-target=dark-poc-report
```

**Direct link**: [OKLCH PoC Report](http://localhost:5176/?local-preview=sandbox&data-layering=dark-poc&data-demo-target=gray&data-nav-page-target=dark-poc-report)

### 3. Explore the PoC Views

Once loaded, you'll see tabs for:

- **Home / Layering mode**: Live surface nesting with L0–L3 layers showing text, links, and inputs on each surface
- **Layer structure**: Reference markup and nesting proof
- **Evaluation Lab**: Dark/light theme toggle with typography and interaction samples
- **OKLCH PoC**: **← START HERE** — Role mapping matrix and compliance report

### 4. PoC Features

**Surface + Interaction Matrices**
- View all semantic roles (surfaces, text, buttons, states, status)
- See current SKY UX values side-by-side with proposed OKLCH translations
- Inline contrast ratios and WCAG AA status

**Live Compliance Checking**
- Automated WCAG AA validation (4.5:1 text, 3:1 non-text)
- APCA observations for perceptual quality
- Pass/fail status updates in real-time

**Demo Mode Toggle**
- **Slate Demo**: OKLCH-derived slate ramp (experimental; more chroma)
- **Gray Demo**: Pure gray ramp (current SKY UX; neutral, low chroma)

**Theme Evaluation**
- Compare light vs. dark baseline
- Test color model impact (Current, CIELAB, OKLCH)

---

## 📊 Key Findings Summary

### ✅ All WCAG AA Requirements Met
- **19/19** text-on-surface pairs pass 4.5:1 minimum
- **100% compliance rate**
- **1 marginal pair**: Links at 4.81:1 (technically pass but low)

### 🎯 Proposed Fix
**Single tweak** for improved link contrast:
- **Token**: `bb.color.blue.500`
- **Current**: `#5589DD` → Contrast on page: **4.81:1**
- **Proposed**: `#5fa3e8` → Contrast on page: **5.14:1**
- **OKLCH change**: `oklch(0.60 0.15 265)` → `oklch(0.65 0.12 265)`
- **Benefit**: Moves link from marginal to good APCA range (L: 65 → 72)

### 📈 Compliance Summary
| Category | Count | Status |
|----------|-------|--------|
| WCAG AA pairs (pass) | 19/19 | ✅ 100% |
| APCA good+ (L ≥ 60) | 17/19 | ⭐ 89% |
| Proposed tweaks | 1 | 📝 Pending review |
| Palette errors | 0 | ✅ None |

### 🟡 Open Questions (Design Review)
1. **Link color**: Accept proposed #5fa3e8, or stick with current #5589DD + underline affordance?
2. **L3 distinction**: Dedicated fill token vs. elevation/border treatment?
3. **Underlines**: All link states vs. visited/active only?
4. **Status colors**: New dark reference tokens now, or defer to Phase 2?

---

## 🔍 Analyzing the Report

### In the Sandbox: "OKLCH PoC" Tab

#### Section 1: Candidate Anchors
Shows the OKLCH derivations for surfaces, text, and interactive colors.

#### Section 2: Role Mapping Matrix
Five tabs with detailed role mappings:
1. **Surfaces** — Page, container, overlay, modal, borders
2. **Text & Links** — Default, deemphasized, heading, interactive, link states
3. **Buttons** — Action primary, input, disabled
4. **States** — Row hover, selected, dimmed
5. **Status** — Danger, warning, success, info

Each row shows current SKY UX values, CIELAB, OKLCH, proposed dark values, and rationale.

#### Section 3: WCAG AA + APCA Observations
Complete compliance matrix with:
- Foreground/background pairs
- Calculated contrast ratios
- WCAG AA pass/fail (4.5:1 for text, 3:1 for non-text)
- APCA L observations (perceptual quality)

#### Section 4: Interactive Link States
Live examples of link states (default/hover/active/focus/visited) on dark surfaces. Shows affordance clarity and state distinction.

#### Section 5: Risks and Next Steps
Summary of open questions and recommended iterations.

---

## 📋 WCAG AA Compliance Checklist

Use this checklist to verify against any test results:

- [ ] Body text on page: 18.51:1 ✅
- [ ] Body text on container: 17.93:1 ✅
- [ ] Deemphasized text on page: 9.23:1 ✅
- [ ] Heading on page: 18.18:1 ✅
- [ ] Link on page: 4.81:1 ✅ (marginal; see proposed fix)
- [ ] Link within text vs. body: 3.42:1 ✅
- [ ] Divider on page: 5.27:1 ✅
- [ ] Elevation border: 7.89:1 ✅
- [ ] Text on action button: 10.69:1 ✅
- [ ] Text on disabled bg: 11.79:1 ✅

**All pairs meet WCAG AA minimums.** ✅

---

## 🚀 Next Steps

### For Design Review (Immediate)
1. **View the sandbox** at the direct link above
2. **Evaluate surfaces**: Do L0–L3 feel hierarchical and distinct?
3. **Check link color**: Is the proposed tweak (4.81:1 → 5.14:1) acceptable?
4. **Test interactions**: Do buttons, inputs, and status colors feel readable?
5. **Make a decision** on open questions

### For Implementation (Post-Review)
1. **Update base-dark.json** with approved tweaks
2. **Promote provisional tokens** to official once signed off
3. **Test with real components** (data tables, forms, etc.)
4. **Plan Phase 2** for data-viz and status color families

### For Phase 2 (Future)
- Extend dark mode to data-viz color families
- Add dark reference tokens for status backgrounds
- Test with complex, data-heavy fixtures
- Refine underline affordance strategy based on user feedback

---

## 📚 File Reference

### DARK_MODE_POC_ANALYSIS.md
**Contents**: Full analysis, compliance report, palette tweaks, OKLCH reasoning, open questions

**Best for**: Strategic understanding, design decisions, implementation planning

### PALETTE_TWEAKS.csv
**Contents**: Side-by-side comparison of current vs. proposed colors with OKLCH values and contrast data

**Best for**: Quick reference, tooling integration, color picker updates

### DARK_MODE_POC_COMPLIANCE_REPORT.json
**Contents**: Structured JSON with all compliance data, gap analysis, APCA observations

**Best for**: Automated tooling, reporting dashboards, integration with color management systems

---

## 🎯 Success Criteria Met

- ✅ All text meets WCAG AA minimum (4.5:1) on all surfaces
- ✅ All non-text elements meet 3:1 minimum
- ✅ Surfaces are visually distinct and hierarchical (L0→L3)
- ✅ Inline interaction colors are readable with underline mitigation
- ✅ All tweaks documented with OKLCH reasoning
- ✅ PoC renders in sandbox with matrices and compliance report
- ✅ Compliance report generated and validated

---

## 💡 Tips for Sandbox Navigation

1. **Try the demo mode toggle** (Slate vs. Gray) to see color strategy differences
2. **Use the Evaluation Lab** to compare dark vs. light baseline side-by-side
3. **Check the Palettes page** to inspect OKLCH approximations for gray/blue families
4. **Test accessibility**: Zoom in/out, check with a color blindness simulator, read text at arm's length

---

## ❓ FAQ

**Q: Can I use the proposed blue color (#5fa3e8) immediately?**  
A: Not yet. It requires design sign-off and testing with real components first. Wait for Phase 1 sign-off.

**Q: Do I need to change light mode colors?**  
A: No. All tweaks are dark-mode-only. Light mode is untouched per constraints.

**Q: What if a custom component doesn't meet contrast on a surface?**  
A: File a gap report. Phase 1 covers semantic roles; custom components may need targeted tweaks in Phase 2.

**Q: Can I use APCA instead of WCAG AA?**  
A: WCAG AA is mandatory; APCA is preferred where feasible. Current PoC meets both.

---

## 📞 Questions?

Refer to:
- **Analysis & rationale**: DARK_MODE_POC_ANALYSIS.md
- **Compliance data**: DARK_MODE_POC_COMPLIANCE_REPORT.json
- **Palette details**: PALETTE_TWEAKS.csv
- **Visual validation**: Sandbox PoC (http://localhost:5176/?...)

---

*Phase 1 Dark Mode PoC — Ready for design review and implementation planning.*
