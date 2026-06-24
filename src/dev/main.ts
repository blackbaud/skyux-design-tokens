import '@skyux/theme/css/sky.css';
import '@skyux/theme/css/themes/modern/styles.css';
import './extra-styles.css';

document.body.classList.add(
  'local-dev-tokens',
  'sky-theme-modern',
  'sky-theme-brand-base',
  'sky-theme-brand-blackbaud',
  'sky-theme-mode-dark',
);

document.body.classList.remove('sky-theme-mode-light');

document.body.classList.remove('sky-theme-default');

const urlParams = new URLSearchParams(window.location.search);
const localPreviewMode = urlParams.get('local-preview');
const showLayerSandbox =
  localPreviewMode === 'sandbox' || localPreviewMode === null;
const showPalettePreview = urlParams.get('local-preview') === 'palette';

if (showLayerSandbox) {
  const app = document.getElementById('app');

  if (app) {
    const initialLayeringMode =
      document.body.dataset.layering === 'experimental'
        ? 'experimental'
        : document.body.dataset.layering === 'oklch-steel'
          ? 'oklch-steel'
          : document.body.dataset.layering === 'oklch-steel-fusion'
            ? 'oklch-steel-fusion'
            : document.body.dataset.layering === 'dark-poc'
              ? 'dark-poc'
        : 'current';
    const initialEvalTheme =
      document.body.dataset.evalTheme === 'light' ? 'light' : 'dark';
    const initialEvalModel =
      document.body.dataset.evalModel === 'cielab'
        ? 'cielab'
        : document.body.dataset.evalModel === 'oklch'
          ? 'oklch'
          : 'current';
    const initialPocView =
      document.body.dataset.pocView === 'light'
        ? 'light'
        : document.body.dataset.pocView === 'dark'
          ? 'dark'
          : initialEvalTheme;
    const initialDemoMode =
      document.body.dataset.demoMode === 'gray' ? 'gray' : 'slate';

    document.body.dataset.layering = initialLayeringMode;
    document.body.dataset.evalTheme = initialEvalTheme;
    document.body.dataset.evalModel = initialEvalModel;
    document.body.dataset.pocView = initialPocView;
    document.body.dataset.demoMode = initialDemoMode;

    type LayeringMode =
      | 'current'
      | 'experimental'
      | 'oklch-steel'
      | 'oklch-steel-fusion'
      | 'dark-poc';
    type DemoMode = 'slate' | 'gray';
    type HomePage =
      | 'layering-mode'
      | 'layer-structure'
      | 'evaluation-lab'
      | 'dark-poc-report';
    type PocView = 'light' | 'dark' | 'side-by-side';

    type PocColorStop = {
      hex: string;
      oklch: string;
      lch: string;
    };

    const pocLightInteractiveText: PocColorStop = {
      hex: '#1859d1',
      oklch: 'oklch(0.50 0.16 255)',
      lch: 'lch(50% 16 255)',
    };

    const pocDarkInteractiveText: PocColorStop = {
      hex: '#8bb8ff',
      oklch: 'oklch(0.74 0.11 250)',
      lch: 'lch(74% 11 250)',
    };

    const pocLightInlineLink: PocColorStop = {
      hex: '#2c6ce3',
      oklch: 'oklch(0.56 0.16 257)',
      lch: 'lch(56% 16 257)',
    };

    const pocLightLinkFocus: PocColorStop = {
      hex: '#0f4fc2',
      oklch: 'oklch(0.46 0.17 257)',
      lch: 'lch(46% 17 257)',
    };

    const pocLightLinkVisited: PocColorStop = {
      hex: '#6b4db8',
      oklch: 'oklch(0.51 0.12 300)',
      lch: 'lch(51% 12 300)',
    };

    const pocDarkInlineLink: PocColorStop = {
      hex: '#2f6fdc',
      oklch: 'oklch(0.58 0.14 258)',
      lch: 'lch(58% 14 258)',
    };

    const pocDarkLinkFocus: PocColorStop = {
      hex: '#cde1ff',
      oklch: 'oklch(0.90 0.04 255)',
      lch: 'lch(90% 4 255)',
    };

    const pocDarkLinkVisited: PocColorStop = {
      hex: '#baa8f8',
      oklch: 'oklch(0.78 0.08 300)',
      lch: 'lch(78% 8 300)',
    };

    const pocLightBaseline = {
      slate1100: { hex: '#f7f9fc', oklch: 'oklch(0.98 0.01 255)', lch: 'lch(98% 1 255)' },
      slate1000: { hex: '#ffffff', oklch: 'oklch(1.00 0 0)', lch: 'lch(100% 0 0)' },
      slate900: { hex: '#f0f4f9', oklch: 'oklch(0.96 0.01 255)', lch: 'lch(96% 1 255)' },
      slate200: { hex: '#4f5e73', oklch: 'oklch(0.46 0.04 255)', lch: 'lch(46% 4 255)' },
      slate50: { hex: '#1d2736', oklch: 'oklch(0.25 0.03 255)', lch: 'lch(25% 3 255)' },
      textDefault: { hex: '#1d2736', oklch: 'oklch(0.25 0.03 255)', lch: 'lch(25% 3 255)' },
      textDeemphasized: { hex: '#4f5e73', oklch: 'oklch(0.46 0.04 255)', lch: 'lch(46% 4 255)' },
      textHeading: { hex: '#161a1f', oklch: 'oklch(0.21 0.02 255)', lch: 'lch(21% 2 255)' },
      divider: { hex: '#c2cfde', oklch: 'oklch(0.83 0.02 255)', lch: 'lch(83% 2 255)' },
      elevationBorder: { hex: '#b2c0d3', oklch: 'oklch(0.78 0.02 255)', lch: 'lch(78% 2 255)' },
      interactiveText: pocLightInteractiveText,
      inlineLink: pocLightInlineLink,
      linkDefault: pocLightInteractiveText,
      linkHover: { hex: '#1f67e3', oklch: 'oklch(0.55 0.18 255)', lch: 'lch(55% 18 255)' },
      linkActive: { hex: '#154daf', oklch: 'oklch(0.44 0.15 255)', lch: 'lch(44% 15 255)' },
      linkFocus: pocLightLinkFocus,
      linkVisited: pocLightLinkVisited,
    } as const satisfies Record<string, PocColorStop>;

    type OklchChannels = {
      l: number;
      c: number;
      h: number;
    };

    const roundTo = (value: number, decimals: number): number => {
      const scale = 10 ** decimals;

      return Math.round(value * scale) / scale;
    };

    const clamp = (value: number, min: number, max: number): number =>
      Math.max(min, Math.min(max, value));

    const normalizeHue = (hue: number): number => {
      const normalized = hue % 360;

      return normalized < 0 ? normalized + 360 : normalized;
    };

    const rgbToHex = (value: string): string | null => {
      const rgbMatch = value
        .trim()
        .toLowerCase()
        .match(/rgba?\(([^)]+)\)/);

      if (!rgbMatch) {
        return null;
      }

      const channels = rgbMatch[1]
        .split(',')
        .slice(0, 3)
        .map((part) => Number.parseFloat(part.trim()));

      if (channels.length < 3 || channels.some((channel) => Number.isNaN(channel))) {
        return null;
      }

      const toHex = (channel: number): string =>
        Math.max(0, Math.min(255, Math.round(channel))).toString(16).padStart(2, '0');

      return `#${toHex(channels[0])}${toHex(channels[1])}${toHex(channels[2])}`;
    };

    const toLinearChannel = (channel: number): number => {
      const value = channel / 255;

      return value <= 0.03928
        ? value / 12.92
        : ((value + 0.055) / 1.055) ** 2.4;
    };

    const hexToRgb = (
      color: string,
    ): { r: number; g: number; b: number } | null => {
      const value = color.trim().replace('#', '');

      if (value.length !== 6) {
        return null;
      }

      return {
        r: Number.parseInt(value.slice(0, 2), 16),
        g: Number.parseInt(value.slice(2, 4), 16),
        b: Number.parseInt(value.slice(4, 6), 16),
      };
    };

    const wcagContrastHex = (foreground: string, background: string): number => {
      const fg = hexToRgb(foreground);
      const bg = hexToRgb(background);

      if (!fg || !bg) {
        return 0;
      }

      const fgLum = 0.2126 * toLinearChannel(fg.r) + 0.7152 * toLinearChannel(fg.g) + 0.0722 * toLinearChannel(fg.b);
      const bgLum = 0.2126 * toLinearChannel(bg.r) + 0.7152 * toLinearChannel(bg.g) + 0.0722 * toLinearChannel(bg.b);
      const lighter = Math.max(fgLum, bgLum);
      const darker = Math.min(fgLum, bgLum);

      return (lighter + 0.05) / (darker + 0.05);
    };

    const toOklchString = (value: OklchChannels): string => {
      const l = roundTo(clamp(value.l, 0, 1), 3).toFixed(3);
      const c = roundTo(clamp(value.c, 0, 0.37), 3).toFixed(3);
      const h = roundTo(normalizeHue(value.h), 1).toFixed(1);

      return `oklch(${l} ${c} ${h})`;
    };

    const toLchString = (value: OklchChannels): string => {
      const l = roundTo(clamp(value.l, 0, 1) * 100, 1).toFixed(1);
      const c = roundTo(clamp(value.c, 0, 0.37) * 100, 1).toFixed(1);
      const h = roundTo(normalizeHue(value.h), 1).toFixed(1);

      return `lch(${l}% ${c} ${h})`;
    };

    const toHexFromOklch = (value: OklchChannels, fallback: string): string => {
      const previousBodyColor = document.body.style.color;

      document.body.style.color = toOklchString(value);

      const computed = getComputedStyle(document.body).color;
      const hex = rgbToHex(computed) ?? fallback;

      document.body.style.color = previousBodyColor;

      return hex;
    };

    const toPocStop = (value: OklchChannels, fallbackHex: string): PocColorStop => ({
      hex: toHexFromOklch(value, fallbackHex),
      oklch: toOklchString(value),
      lch: toLchString(value),
    });

    const shiftOklch = (
      base: OklchChannels,
      deltaL: number,
      deltaC: number,
      deltaH = 0,
    ): OklchChannels => ({
      l: roundTo(clamp(base.l + deltaL, 0, 1), 3),
      c: roundTo(clamp(base.c + deltaC, 0, 0.37), 3),
      h: roundTo(normalizeHue(base.h + deltaH), 1),
    });

    const darkPageAnchor: OklchChannels = {
      l: 0.20,
      c: 0.02,
      h: 255,
    };

    const darkL1ContainerAnchor: OklchChannels = {
      l: 0.23,
      c: 0.02,
      h: 255,
    };

    const darkL2OverlayAnchor: OklchChannels = {
      l: 0.35,
      c: 0.03,
      h: 255,
    };

    const darkDerivation = {
      insetDeltaL: 0.015,
      depthDeltaL: 0.015,
      minTextContrast: 4.5,
      minRequiredOverlayDeltaL: 0.10,
      minRequiredInsetOverlayDeltaL: 0.11,
    } as const;

    const deriveSurface = (depth: number): OklchChannels => {
      if (depth <= 0) {
        return darkL1ContainerAnchor;
      }

      if (depth === 1) {
        return shiftOklch(darkL1ContainerAnchor, -darkDerivation.insetDeltaL, 0);
      }

      if (depth === 2) {
        return darkL2OverlayAnchor;
      }

      const defaultTextCandidate = shiftOklch(darkPageAnchor, 0.75, -0.01);
      const defaultTextHex = toHexFromOklch(defaultTextCandidate, '#e8eef7');
      let candidate = darkL2OverlayAnchor;

      for (let index = 3; index <= depth; index += 1) {
        const next = shiftOklch(candidate, darkDerivation.depthDeltaL, 0);
        const nextHex = toHexFromOklch(next, '#445a77');

        if (wcagContrastHex(defaultTextHex, nextHex) < darkDerivation.minTextContrast) {
          break;
        }

        candidate = next;
      }

      return candidate;
    };

    const darkSurfaceDepth0 = deriveSurface(0);
    const darkSurfaceDepth1 = deriveSurface(1);
    const darkSurfaceDepth2 = deriveSurface(2);
    const darkSurfaceDepth3 = deriveSurface(3);
    const darkTextDefault = shiftOklch(darkPageAnchor, 0.75, -0.01);
    const darkTextDeemphasized = shiftOklch(darkTextDefault, -0.13, 0.02);
    const darkTextHeading = shiftOklch(darkTextDefault, -0.03, 0.01);
    const darkDivider = shiftOklch(darkSurfaceDepth0, 0.23, 0.02);
    const darkElevationBorder = shiftOklch(darkSurfaceDepth0, 0.31, 0.02);
    const darkLinkDefault = {
      l: roundTo(clamp(darkTextDefault.l - 0.21, 0, 1), 3),
      c: 0.11,
      h: 250,
    };
    const darkLinkHover = shiftOklch(darkLinkDefault, 0.07, -0.02);
    const darkLinkActive = shiftOklch(darkLinkDefault, -0.05, 0.01);
    const darkLinkFocus = shiftOklch(darkLinkDefault, 0.16, -0.07, 5);
    const darkLinkVisited = {
      l: roundTo(clamp(darkLinkDefault.l + 0.04, 0, 1), 3),
      c: 0.08,
      h: 300,
    };

    const darkOverlayDeltaObserved = roundTo(
      darkL2OverlayAnchor.l - darkL1ContainerAnchor.l,
      3,
    );
    const darkInsetOverlayDeltaObserved = roundTo(
      darkL2OverlayAnchor.l - darkSurfaceDepth1.l,
      3,
    );

    const pocAnchors = {
      slate1100: { hex: '#121824', oklch: 'oklch(0.20 0.02 255)', lch: 'lch(20% 2 255)' },
      slate1000: { hex: '#192230', oklch: 'oklch(0.23 0.02 255)', lch: 'lch(23% 2 255)' },
      slate900: { hex: '#35475e', oklch: 'oklch(0.35 0.03 255)', lch: 'lch(35% 3 255)' },
      slate200: { hex: '#b8c7da', oklch: 'oklch(0.82 0.03 255)', lch: 'lch(82% 3 255)' },
      slate50: { hex: '#e8eef7', oklch: 'oklch(0.95 0.01 255)', lch: 'lch(95% 1 255)' },
      textDefault: { hex: '#e8eef7', oklch: 'oklch(0.95 0.01 255)', lch: 'lch(95% 1 255)' },
      textDeemphasized: { hex: '#b8c7da', oklch: 'oklch(0.82 0.03 255)', lch: 'lch(82% 3 255)' },
      textHeading: { hex: '#dbe6f4', oklch: 'oklch(0.92 0.02 255)', lch: 'lch(92% 2 255)' },
      divider: { hex: '#4f607b', oklch: 'oklch(0.46 0.04 255)', lch: 'lch(46% 4 255)' },
      elevationBorder: { hex: '#5d7291', oklch: 'oklch(0.54 0.04 255)', lch: 'lch(54% 4 255)' },
      interactiveText: pocDarkInteractiveText,
      inlineLink: pocDarkInlineLink,
      linkDefault: pocDarkInteractiveText,
      linkHover: { hex: '#a2c6ff', oklch: 'oklch(0.81 0.09 250)', lch: 'lch(81% 9 250)' },
      linkActive: { hex: '#73a8ff', oklch: 'oklch(0.69 0.12 250)', lch: 'lch(69% 12 250)' },
      linkFocus: pocDarkLinkFocus,
      linkVisited: pocDarkLinkVisited,
    } as const satisfies Record<string, PocColorStop>;

    const pocGrayAnchors = {
      ...pocAnchors,
      slate1100: { hex: '#161a1f', oklch: 'oklch(0.21 0.01 255)', lch: 'lch(21% 1 255)' },
      slate1000: { hex: '#1e2229', oklch: 'oklch(0.25 0.01 255)', lch: 'lch(25% 1 255)' },
      slate900: { hex: '#252b33', oklch: 'oklch(0.29 0.01 255)', lch: 'lch(29% 1 255)' },
      divider: { hex: '#525a66', oklch: 'oklch(0.48 0.01 255)', lch: 'lch(48% 1 255)' },
      elevationBorder: { hex: '#606a78', oklch: 'oklch(0.55 0.01 255)', lch: 'lch(55% 1 255)' },
    } as const satisfies Record<string, PocColorStop>;

    type MatrixRow = {
      role: string;
      lightHex: string;
      darkHex: string;
      lightLch: string;
      darkLch: string;
      lightOklch: string;
      darkOklch: string;
      candidateDark: string;
      rationale: string;
    };

    const deriveStatusLightLch = (
      darkL: number,
      darkC: number,
      hue: number,
    ): string => {
      const lightL = Math.min(98, darkL + 42);
      const lightC = Math.max(0, darkC + 2);

      return `lch(${lightL}% ${lightC} ${hue})`;
    };

    const deriveStatusLightOklch = (
      darkL: number,
      darkC: number,
      hue: number,
    ): string => {
      const lightL = Math.min(0.98, darkL + 0.42);
      const lightC = Math.max(0, darkC + 0.02);

      return `oklch(${lightL.toFixed(2)} ${lightC.toFixed(2)} ${hue})`;
    };

    const getActiveDarkAnchors = (): typeof pocAnchors => {
      const isGrayPoc =
        document.body.dataset.demoMode === 'gray' &&
        document.body.dataset.layering === 'dark-poc';

      return isGrayPoc ? pocGrayAnchors : pocAnchors;
    };

    const buildMatrixRowsByCategory = (
      darkAnchors: typeof pocAnchors,
    ): Record<string, MatrixRow[]> => ({
      surfaces: [
        {
          role: 'Page',
          lightHex: pocLightBaseline.slate1100.hex,
          darkHex: darkAnchors.slate1100.hex,
          lightLch: pocLightBaseline.slate1100.lch,
          darkLch: darkAnchors.slate1100.lch,
          lightOklch: pocLightBaseline.slate1100.oklch,
          darkOklch: darkAnchors.slate1100.oklch,
          candidateDark: 'poc.slate.1100',
          rationale: 'Base layer anchored darker to maintain clear separation from containers.',
        },
        {
          role: 'Container base',
          lightHex: pocLightBaseline.slate1000.hex,
          darkHex: darkAnchors.slate1000.hex,
          lightLch: pocLightBaseline.slate1000.lch,
          darkLch: darkAnchors.slate1000.lch,
          lightOklch: pocLightBaseline.slate1000.oklch,
          darkOklch: darkAnchors.slate1000.oklch,
          candidateDark: 'poc.slate.1000',
          rationale: 'Primary content surface lifted one step above page.',
        },
        {
          role: 'Menu',
          lightHex: pocLightBaseline.slate900.hex,
          darkHex: darkAnchors.slate900.hex,
          lightLch: pocLightBaseline.slate900.lch,
          darkLch: darkAnchors.slate900.lch,
          lightOklch: pocLightBaseline.slate900.oklch,
          darkOklch: darkAnchors.slate900.oklch,
          candidateDark: 'poc.slate.900',
          rationale: 'Floating layer uses stronger lift while avoiding card-like detachment.',
        },
        {
          role: 'Divider',
          lightHex: pocLightBaseline.divider.hex,
          darkHex: darkAnchors.divider.hex,
          lightLch: pocLightBaseline.divider.lch,
          darkLch: darkAnchors.divider.lch,
          lightOklch: pocLightBaseline.divider.oklch,
          darkOklch: darkAnchors.divider.oklch,
          candidateDark: 'poc.divider',
          rationale: 'Structural separators visible without introducing noise.',
        },
        {
          role: 'Elevation border',
          lightHex: pocLightBaseline.elevationBorder.hex,
          darkHex: darkAnchors.elevationBorder.hex,
          lightLch: pocLightBaseline.elevationBorder.lch,
          darkLch: darkAnchors.elevationBorder.lch,
          lightOklch: pocLightBaseline.elevationBorder.oklch,
          darkOklch: darkAnchors.elevationBorder.oklch,
          candidateDark: 'poc.elevationBorder',
          rationale: 'Overlay boundaries read cleanly on page and containers.',
        },
        {
          role: 'Container dimmed',
          lightHex: '#f0f4f9',
          darkHex: '#252b33',
          lightLch: 'lch(96% 12 225)',
          darkLch: 'lch(17% 8 250)',
          lightOklch: 'oklch(0.96 0.08 225)',
          darkOklch: 'oklch(0.17 0.06 250)',
          candidateDark: 'color.background.container.dimmed',
          rationale: 'Muted container surfaces for secondary content. Dark from bb.color.gray.900.',
        },
      ],
      text: [
        {
          role: 'Text default',
          lightHex: pocLightBaseline.textDefault.hex,
          darkHex: darkAnchors.textDefault.hex,
          lightLch: pocLightBaseline.textDefault.lch,
          darkLch: darkAnchors.textDefault.lch,
          lightOklch: pocLightBaseline.textDefault.oklch,
          darkOklch: darkAnchors.textDefault.oklch,
          candidateDark: 'poc.textDefault',
          rationale: 'Optimized for long-form readability on 1100/1000 surfaces.',
        },
        {
          role: 'Text deemphasized',
          lightHex: pocLightBaseline.textDeemphasized.hex,
          darkHex: darkAnchors.textDeemphasized.hex,
          lightLch: pocLightBaseline.textDeemphasized.lch,
          darkLch: darkAnchors.textDeemphasized.lch,
          lightOklch: pocLightBaseline.textDeemphasized.oklch,
          darkOklch: darkAnchors.textDeemphasized.oklch,
          candidateDark: 'poc.textDeemphasized',
          rationale: 'Secondary tier stays distinct but not low-contrast.',
        },
        {
          role: 'Heading',
          lightHex: pocLightBaseline.textHeading.hex,
          darkHex: darkAnchors.textHeading.hex,
          lightLch: pocLightBaseline.textHeading.lch,
          darkLch: darkAnchors.textHeading.lch,
          lightOklch: pocLightBaseline.textHeading.oklch,
          darkOklch: darkAnchors.textHeading.oklch,
          candidateDark: 'poc.textHeading',
          rationale: 'Heading tier remains visually authoritative over body copy.',
        },
        {
          role: 'Interactive text',
          lightHex: pocLightBaseline.linkDefault.hex,
          darkHex: darkAnchors.linkDefault.hex,
          lightLch: pocLightBaseline.linkDefault.lch,
          darkLch: darkAnchors.linkDefault.lch,
          lightOklch: pocLightBaseline.linkDefault.oklch,
          darkOklch: darkAnchors.linkDefault.oklch,
          candidateDark: 'poc.interactiveText',
          rationale: 'Interactive affordance remains explicit through color and state treatment.',
        },
        {
          role: 'Link states',
          lightHex: `${pocLightBaseline.linkDefault.hex} -> ${pocLightBaseline.linkVisited.hex}`,
          darkHex: `${darkAnchors.linkDefault.hex} -> ${darkAnchors.linkVisited.hex}`,
          lightLch: `${pocLightBaseline.linkDefault.lch} -> ${pocLightBaseline.linkVisited.lch}`,
          darkLch: `${darkAnchors.linkDefault.lch} -> ${darkAnchors.linkVisited.lch}`,
          lightOklch: `${pocLightBaseline.linkDefault.oklch} -> ${pocLightBaseline.linkVisited.oklch}`,
          darkOklch: `${darkAnchors.linkDefault.oklch} -> ${darkAnchors.linkVisited.oklch}`,
          candidateDark: 'poc.link* state set',
          rationale: 'Default/hover/active/focus/visited are all distinguishable.',
        },
      ],
      buttons: [
        {
          role: 'Action primary',
          lightHex: '#0d47a1',
          darkHex: '#96B5EA',
          lightLch: 'lch(32% 59 285)',
          darkLch: 'lch(73% 35 263)',
          lightOklch: 'oklch(0.32 0.40 285)',
          darkOklch: 'oklch(0.73 0.24 263)',
          candidateDark: 'color.background.action.primary.base',
          rationale: 'Action button background for primary affordance. Dark anchored to bb.color.blue.350.',
        },
        {
          role: 'Input',
          lightHex: '#ffffff',
          darkHex: '#1b2433',
          lightLch: 'lch(100% 10 214)',
          darkLch: 'lch(14% 13 264)',
          lightOklch: 'oklch(1.00 0.07 214)',
          darkOklch: 'oklch(0.14 0.09 264)',
          candidateDark: 'color.background.action.secondary.base (or input-specific token)',
          rationale: 'Input field backgrounds. Dark value from bb.color.gray.1000.',
        },
      ],
      states: [
        {
          role: 'Disabled',
          lightHex: '#e8eef7',
          darkHex: '#3b4047',
          lightLch: 'lch(94% 13 232)',
          darkLch: 'lch(27% 8 245)',
          lightOklch: 'oklch(0.94 0.09 232)',
          darkOklch: 'oklch(0.27 0.05 245)',
          candidateDark: 'color.background.disabled',
          rationale: 'Disabled component surfaces reduce visual weight. Dark from bb.color.gray.800.',
        },
        {
          role: 'Row hover/selected',
          lightHex: '#e3f2fd',
          darkHex: '#1e2229',
          lightLch: 'lch(95% 17 230)',
          darkLch: 'lch(13% 7 254)',
          lightOklch: 'oklch(0.95 0.11 230)',
          darkOklch: 'oklch(0.13 0.05 254)',
          candidateDark: 'color.background.container.base (or row-specific token)',
          rationale: 'Row highlight states provide clear selection feedback. Dark from bb.color.gray.1000.',
        },
      ],
      statusBackgrounds: [
        {
          role: 'Container danger',
          lightHex: '#f7a08f',
          darkHex: '#d93a3d',
          lightLch: deriveStatusLightLch(42, 20, 28),
          darkLch: 'lch(42% 20 28)',
          lightOklch: deriveStatusLightOklch(0.42, 0.07, 28),
          darkOklch: 'oklch(0.42 0.07 28)',
          candidateDark: 'color.background.container.danger',
          rationale: 'Constructed PoC surface translation: darker and chroma-compressed while preserving red hue intent.',
        },
        {
          role: 'Container warning',
          lightHex: '#ffd597',
          darkHex: '#b57f25',
          lightLch: deriveStatusLightLch(50, 18, 95),
          darkLch: 'lch(50% 18 95)',
          lightOklch: deriveStatusLightOklch(0.50, 0.07, 95),
          darkOklch: 'oklch(0.50 0.07 95)',
          candidateDark: 'color.background.container.warning',
          rationale: 'Constructed PoC surface translation: darker and chroma-compressed while preserving warning hue intent.',
        },
        {
          role: 'Container success',
          lightHex: '#b7da9b',
          darkHex: '#099c53',
          lightLch: deriveStatusLightLch(44, 18, 150),
          darkLch: 'lch(44% 18 150)',
          lightOklch: deriveStatusLightOklch(0.44, 0.07, 150),
          darkOklch: 'oklch(0.44 0.07 150)',
          candidateDark: 'color.background.container.success',
          rationale: 'Constructed PoC surface translation: darker and chroma-compressed while preserving success hue intent.',
        },
        {
          role: 'Container info',
          lightHex: '#81d4f7',
          darkHex: '#2B6BD5',
          lightLch: deriveStatusLightLch(41, 18, 250),
          darkLch: 'lch(41% 18 250)',
          lightOklch: deriveStatusLightOklch(0.41, 0.07, 250),
          darkOklch: 'oklch(0.41 0.07 250)',
          candidateDark: 'color.background.container.info',
          rationale: 'Constructed PoC surface translation: darker and chroma-compressed while preserving informational blue intent.',
        },
      ],
    });

    const parseHex = (
      color: string,
    ): { r: number; g: number; b: number } => {
      const value = color.trim().replace('#', '');
      const normalized =
        value.length === 3
          ? value
              .split('')
              .map((ch) => `${ch}${ch}`)
              .join('')
          : value;

      return {
        r: Number.parseInt(normalized.slice(0, 2), 16),
        g: Number.parseInt(normalized.slice(2, 4), 16),
        b: Number.parseInt(normalized.slice(4, 6), 16),
      };
    };

    const toLinear = (channel: number): number => {
      const value = channel / 255;

      return value <= 0.03928
        ? value / 12.92
        : ((value + 0.055) / 1.055) ** 2.4;
    };

    const luminance = (color: string): number => {
      const { r, g, b } = parseHex(color);

      return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
    };

    const wcagContrast = (foreground: string, background: string): number => {
      const fg = luminance(foreground);
      const bg = luminance(background);
      const lighter = Math.max(fg, bg);
      const darker = Math.min(fg, bg);

      return (lighter + 0.05) / (darker + 0.05);
    };

    const apcaObservation = (ratio: number): string => {
      if (ratio >= 10) {
        return 'Strong APCA expectation';
      }

      if (ratio >= 7) {
        return 'Good APCA expectation';
      }

      if (ratio >= 4.5) {
        return 'Marginal APCA expectation';
      }

      return 'Likely weak APCA expectation';
    };

    const buildDarkPocReport = (): string => {
      const activeDarkAnchors = getActiveDarkAnchors();
      const matrixRowsByCategory = buildMatrixRowsByCategory(activeDarkAnchors);
      const categoryLabels: Record<string, string> = {
        surfaces: 'Surface Backgrounds',
        text: 'Text Colors & Links',
        buttons: 'Button Backgrounds',
        states: 'State Backgrounds',
        statusBackgrounds: 'Status Backgrounds',
      };

      const tabButtonsHtml = Object.keys(matrixRowsByCategory)
        .map(
          (cat) =>
            `<button type="button" class="local-poc-matrix-tab-btn" data-matrix-tab="${cat}" aria-pressed="${cat === 'surfaces' ? 'true' : 'false'}">${categoryLabels[cat]}</button>`,
        )
        .join('');

      const matrixTabsHtml = Object.entries(matrixRowsByCategory)
        .map(([category, rows]) => {
          const tableHtml = rows
            .map(
              (row) => `
            <tr>
              <td>${row.role}</td>
              <td><span class="local-poc-chip" style="background:${row.lightHex}"></span>${row.lightHex}</td>
              <td><span class="local-poc-chip" style="background:${row.darkHex}"></span>${row.darkHex}</td>
              <td><span class="local-poc-chip" style="background:${row.lightHex}"></span>${row.lightLch}</td>
              <td><span class="local-poc-chip" style="background:${row.darkHex}"></span>${row.darkLch}</td>
              <td><span class="local-poc-chip" style="background:${row.lightHex}"></span>${row.lightOklch}</td>
              <td><span class="local-poc-chip" style="background:${row.darkHex}"></span>${row.darkOklch}</td>
              <td>${row.candidateDark}</td>
              <td>${row.rationale}</td>
            </tr>`,
            )
            .join('');

          return `
          <div class="local-poc-matrix-tab" data-matrix-tab="${category}" style="display: ${category === 'surfaces' ? 'block' : 'none'}">
            <div class="local-poc-table-wrap">
              <table class="local-poc-table">
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Current SKY UX (light)</th>
                    <th>Current SKY UX (dark)</th>
                    <th>CIELAB (light)</th>
                    <th>CIELAB (dark)</th>
                    <th>OKLCH (light)</th>
                    <th>OKLCH (dark)</th>
                    <th>Candidate dark</th>
                    <th>Rationale</th>
                  </tr>
                </thead>
                <tbody>${tableHtml}</tbody>
              </table>
            </div>
          </div>`;
        })
        .join('');

      return `
        <section class="local-poc-report" aria-label="OKLCH PoC report">
          <header class="local-poc-header">
            <h2 class="local-layer-model-title">OKLCH PoC</h2>
            <p class="local-layer-model-copy">Token translation view: light baseline semantics mapped to dark candidate anchors. Toggle theme to see the live PoC UI change between light and dark.</p>
            <div class="local-poc-controls" role="tablist" aria-label="PoC theme mode">
              <button type="button" class="local-eval-control-btn" data-poc-view-target="light" aria-pressed="false">Light theme</button>
              <button type="button" class="local-eval-control-btn" data-poc-view-target="dark" aria-pressed="false">Dark theme</button>
            </div>
            <p class="local-poc-status" data-poc-status="both">WCAG AA gate (both modes): --</p>
            <p class="local-poc-status" data-poc-status="light">Light baseline AA: --</p>
            <p class="local-poc-status" data-poc-status="dark">Dark translation AA: --</p>
            <p class="local-poc-status">Observed ΔL(L2-L1): ${darkOverlayDeltaObserved.toFixed(3)} (target >= ${darkDerivation.minRequiredOverlayDeltaL.toFixed(2)})</p>
            <p class="local-poc-status">Observed ΔL(L2-inset): ${darkInsetOverlayDeltaObserved.toFixed(3)} (target >= ${darkDerivation.minRequiredInsetOverlayDeltaL.toFixed(2)})</p>
          </header>

          <section class="local-poc-card" aria-label="Candidate anchors">
            <h3>Candidate anchors</h3>
            <ul class="local-poc-anchor-list">
              <li data-poc-mode="light"><span class="local-poc-chip" style="background:${pocLightBaseline.slate1100.hex}"></span>1100 (page): ${pocLightBaseline.slate1100.oklch}</li>
              <li data-poc-mode="light"><span class="local-poc-chip" style="background:${pocLightBaseline.slate1000.hex}"></span>1000 (container): ${pocLightBaseline.slate1000.oklch}</li>
              <li data-poc-mode="light"><span class="local-poc-chip" style="background:${pocLightBaseline.slate900.hex}"></span>900 (menu/overlay): ${pocLightBaseline.slate900.oklch}</li>
              <li data-poc-mode="light"><span class="local-poc-chip" style="background:${pocLightBaseline.slate200.hex}"></span>200 (deemphasized text intent): ${pocLightBaseline.slate200.oklch}</li>
              <li data-poc-mode="light"><span class="local-poc-chip" style="background:${pocLightBaseline.slate50.hex}"></span>50 (default text intent): ${pocLightBaseline.slate50.oklch}</li>
              <li data-poc-mode="dark"><span class="local-poc-chip" style="background:${activeDarkAnchors.slate1100.hex}"></span>1100 (page): ${activeDarkAnchors.slate1100.oklch}</li>
              <li data-poc-mode="dark"><span class="local-poc-chip" style="background:${activeDarkAnchors.slate1000.hex}"></span>1000 (container): ${activeDarkAnchors.slate1000.oklch}</li>
              <li data-poc-mode="dark"><span class="local-poc-chip" style="background:${activeDarkAnchors.slate900.hex}"></span>900 (menu/overlay): ${activeDarkAnchors.slate900.oklch}</li>
              <li data-poc-mode="dark"><span class="local-poc-chip" style="background:${activeDarkAnchors.slate200.hex}"></span>200 (deemphasized text intent): ${activeDarkAnchors.slate200.oklch}</li>
              <li data-poc-mode="dark"><span class="local-poc-chip" style="background:${activeDarkAnchors.slate50.hex}"></span>50 (default text intent): ${activeDarkAnchors.slate50.oklch}</li>
            </ul>
          </section>

          <section class="local-poc-card" aria-label="Role mapping matrix">
            <h3>Role mapping matrix</h3>
            <div class="local-poc-matrix-tabs" role="tablist" aria-label="Token categories">
              ${tabButtonsHtml}
            </div>
            ${matrixTabsHtml}
          </section>

          <section class="local-poc-card" aria-label="Validation report">
            <h3>WCAG AA + APCA observations</h3>
            <div class="local-poc-table-wrap">
              <table class="local-poc-table">
                <thead>
                  <tr>
                    <th>Pair</th>
                    <th>Light baseline</th>
                    <th>Light contrast</th>
                    <th>Dark translation</th>
                    <th>Dark contrast</th>
                    <th>Required</th>
                    <th>AA both modes</th>
                    <th>APCA note (dark)</th>
                  </tr>
                </thead>
                <tbody data-poc-wcag-body></tbody>
              </table>
            </div>
          </section>

          <section class="local-poc-card" aria-label="Interactive and link states">
            <h3>Interactive and link text states</h3>
            <p>Affordance rule: links are not underlined at rest, and state changes must remain distinguishable on page, container, and menu surfaces.</p>
            <div class="local-poc-link-row" data-poc-mode="light" style="background:${pocLightBaseline.slate1100.hex}">
              <a href="javascript:void(0)" class="local-poc-link local-poc-link-light" data-link-state="default">Default link</a>
              <a href="javascript:void(0)" class="local-poc-link local-poc-link-light" data-link-state="hover">Hover link</a>
              <a href="javascript:void(0)" class="local-poc-link local-poc-link-light" data-link-state="active">Active link</a>
              <a href="javascript:void(0)" class="local-poc-link local-poc-link-light" data-link-state="focus">Focus link</a>
              <a href="javascript:void(0)" class="local-poc-link local-poc-link-light" data-link-state="visited">Visited link</a>
            </div>
            <div class="local-poc-link-row" data-poc-mode="dark" style="background:${activeDarkAnchors.slate1100.hex}">
              <a href="javascript:void(0)" class="local-poc-link local-poc-link-dark" data-link-state="default">Default link</a>
              <a href="javascript:void(0)" class="local-poc-link local-poc-link-dark" data-link-state="hover">Hover link</a>
              <a href="javascript:void(0)" class="local-poc-link local-poc-link-dark" data-link-state="active">Active link</a>
              <a href="javascript:void(0)" class="local-poc-link local-poc-link-dark" data-link-state="focus">Focus link</a>
              <a href="javascript:void(0)" class="local-poc-link local-poc-link-dark" data-link-state="visited">Visited link</a>
            </div>
          </section>

          <section class="local-poc-card" aria-label="Risks and next steps">
            <h3>Risks and open questions</h3>
            <ul>
              <li>Blue-state link differentiation on dense overlays may need additional hue spread.</li>
              <li>Divider and elevation borders pass non-text AA now, but may require tuning in real data-heavy screens.</li>
              <li>Data-viz families are explicitly deferred to Phase 2.</li>
            </ul>
            <h4>Recommended next iteration steps</h4>
            <ol>
              <li>Run this matrix against additional long-form content fixtures and controls.</li>
              <li>Promote passed values into provisional dark reference tokens only after design review.</li>
              <li>Extend the same validation method to data-viz families.</li>
            </ol>
          </section>
        </section>`;
    };

    const normalizeCssColor = (value: string): string | null => {
      const color = value.trim().toLowerCase();

      if (!color) {
        return null;
      }

      if (color.startsWith('#')) {
        if (color.length === 4) {
          return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
        }

        return color.slice(0, 7);
      }

      const rgbMatch = color.match(/rgba?\(([^)]+)\)/);

      if (!rgbMatch) {
        return null;
      }

      const channels = rgbMatch[1]
        .split(',')
        .slice(0, 3)
        .map((part) => Number.parseFloat(part.trim()));

      if (channels.length < 3 || channels.some((channel) => Number.isNaN(channel))) {
        return null;
      }

      const toHex = (channel: number): string =>
        Math.max(0, Math.min(255, Math.round(channel))).toString(16).padStart(2, '0');

      return `#${toHex(channels[0])}${toHex(channels[1])}${toHex(channels[2])}`;
    };

    const readThemeSnapshot = (
      theme: 'light' | 'dark',
    ): {
      pageBg: string;
      containerBg: string;
      textDefault: string;
      textDeemphasized: string;
      heading: string;
      divider: string;
      elevationBorder: string;
      linkDefault: string;
      linkVisited: string;
    } | null => {
      const currentTheme = document.body.dataset.evalTheme;
      document.body.dataset.evalTheme = theme;

      const pocRoot = app.querySelector<HTMLElement>('.local-layer-dark-poc');

      if (!pocRoot) {
        document.body.dataset.evalTheme = currentTheme ?? 'dark';

        return null;
      }

      const styles = getComputedStyle(pocRoot);
      const fallback = theme === 'light' ? '#1d2736' : '#e8eef7';
      const linkSelector =
        theme === 'light'
          ? '.local-poc-link-light'
          : '.local-poc-link-dark';
      const linkDefaultEl = app.querySelector<HTMLElement>(
        `${linkSelector}[data-link-state="default"]`,
      );
      const linkVisitedEl = app.querySelector<HTMLElement>(
        `${linkSelector}[data-link-state="visited"]`,
      );

      const readColor = (raw: string, fallbackValue: string): string =>
        normalizeCssColor(raw) ?? fallbackValue;
      const readTokenColor = (
        primaryToken: string,
        fallbackToken: string,
        fallbackValue: string,
      ): string =>
        readColor(
          styles.getPropertyValue(primaryToken) || styles.getPropertyValue(fallbackToken),
          fallbackValue,
        );

      const snapshot = {
        pageBg: readTokenColor(
          '--sky-theme-color-background-page',
          '--sky-color-background-page',
          '#141b26',
        ),
        containerBg: readTokenColor(
          '--sky-theme-color-background-container-base',
          '--sky-color-background-container-base',
          '#1a2231',
        ),
        textDefault: readColor(
          styles.getPropertyValue('--sky-theme-color-text-default'),
          fallback,
        ),
        textDeemphasized: readColor(
          styles.getPropertyValue('--sky-theme-color-text-deemphasized'),
          fallback,
        ),
        heading: readColor(
          styles.getPropertyValue('--sky-theme-color-text-heading'),
          fallback,
        ),
        divider: readTokenColor(
          '--sky-theme-color-border-divider',
          '--sky-color-border-divider',
          fallback,
        ),
        elevationBorder: readTokenColor(
          '--sky-theme-color-border-elevation',
          '--sky-color-border-elevation',
          fallback,
        ),
        linkDefault: readColor(
          linkDefaultEl ? getComputedStyle(linkDefaultEl).color : '',
          fallback,
        ),
        linkVisited: readColor(
          linkVisitedEl ? getComputedStyle(linkVisitedEl).color : '',
          fallback,
        ),
      };

      document.body.dataset.evalTheme = currentTheme ?? 'dark';

      return snapshot;
    };

    const updatePocLiveStatus = (): void => {
      const wcagBody = app.querySelector<HTMLElement>('[data-poc-wcag-body]');

      if (!wcagBody) {
        return;
      }

      const activeDarkAnchors = getActiveDarkAnchors();

      const light = {
        pageBg: pocLightBaseline.slate1100.hex,
        containerBg: pocLightBaseline.slate1000.hex,
        textDefault: pocLightBaseline.textDefault.hex,
        textDeemphasized: pocLightBaseline.textDeemphasized.hex,
        heading: pocLightBaseline.textHeading.hex,
        divider: pocLightBaseline.divider.hex,
        elevationBorder: pocLightBaseline.elevationBorder.hex,
        linkDefault: pocLightBaseline.linkDefault.hex,
        linkVisited: pocLightBaseline.linkVisited.hex,
        inlineLink: pocLightBaseline.inlineLink.hex,
      };

      const dark = {
        pageBg: activeDarkAnchors.slate1100.hex,
        containerBg: activeDarkAnchors.slate1000.hex,
        textDefault: activeDarkAnchors.textDefault.hex,
        textDeemphasized: activeDarkAnchors.textDeemphasized.hex,
        heading: activeDarkAnchors.textHeading.hex,
        divider: activeDarkAnchors.divider.hex,
        elevationBorder: activeDarkAnchors.elevationBorder.hex,
        linkDefault: activeDarkAnchors.linkDefault.hex,
        linkVisited: activeDarkAnchors.linkVisited.hex,
        inlineLink: activeDarkAnchors.inlineLink.hex,
      };

      const checks = [
        {
          label: 'Body text on page',
          light: { fg: light.textDefault, bg: light.pageBg },
          dark: { fg: dark.textDefault, bg: dark.pageBg },
          min: 4.5,
        },
        {
          label: 'Body text on container',
          light: { fg: light.textDefault, bg: light.containerBg },
          dark: { fg: dark.textDefault, bg: dark.containerBg },
          min: 4.5,
        },
        {
          label: 'Deemphasized text on page',
          light: { fg: light.textDeemphasized, bg: light.pageBg },
          dark: { fg: dark.textDeemphasized, bg: dark.pageBg },
          min: 4.5,
        },
        {
          label: 'Heading on page',
          light: { fg: light.heading, bg: light.pageBg },
          dark: { fg: dark.heading, bg: dark.pageBg },
          min: 3,
        },
        {
          label: 'Link default on page',
          light: { fg: light.linkDefault, bg: light.pageBg },
          dark: { fg: dark.linkDefault, bg: dark.pageBg },
          min: 4.5,
        },
        {
          label: 'Link visited on page',
          light: { fg: light.linkVisited, bg: light.pageBg },
          dark: { fg: dark.linkVisited, bg: dark.pageBg },
          min: 4.5,
        },
        {
          label: 'Inline link default vs body text',
          light: { fg: light.inlineLink, bg: light.textDefault },
          dark: { fg: dark.inlineLink, bg: dark.textDefault },
          min: 3,
        },
        {
          label: 'Inline link visited vs body text',
          light: { fg: light.inlineLink, bg: light.textDefault },
          dark: { fg: dark.inlineLink, bg: dark.textDefault },
          min: 3,
        },
        {
          label: 'Divider on page (non-text)',
          light: { fg: light.divider, bg: light.pageBg },
          dark: { fg: dark.divider, bg: dark.pageBg },
          min: 3,
        },
        {
          label: 'Elevation border on page (non-text)',
          light: { fg: light.elevationBorder, bg: light.pageBg },
          dark: { fg: dark.elevationBorder, bg: dark.pageBg },
          min: 3,
        },
        {
          label: 'Text on action primary background',
          light: { fg: light.textDefault, bg: '#0d47a1' },
          dark: { fg: dark.textDefault, bg: '#42a5f5' },
          min: 4.5,
        },
        {
          label: 'Text on input background',
          light: { fg: light.textDefault, bg: light.containerBg },
          dark: { fg: dark.textDefault, bg: dark.containerBg },
          min: 4.5,
        },
        {
          label: 'Text on disabled background',
          light: { fg: light.textDefault, bg: '#e8eef7' },
          dark: { fg: dark.textDefault, bg: '#3b4047' },
          min: 4.5,
        },
        {
          label: 'Text on container dimmed',
          light: { fg: light.textDefault, bg: light.pageBg },
          dark: { fg: dark.textDefault, bg: '#27354a' },
          min: 4.5,
        },
        {
          label: 'Text on row hover/selected',
          light: { fg: light.textDefault, bg: '#e3f2fd' },
          dark: { fg: dark.textDefault, bg: '#1e293b' },
          min: 4.5,
        },
        {
          label: 'Text on container danger',
          light: { fg: light.textDefault, bg: '#f7a08f' },
          dark: { fg: dark.textDefault, bg: '#d93a3d' },
          min: 4.5,
        },
        {
          label: 'Text on container warning',
          light: { fg: light.textDefault, bg: '#ffd597' },
          dark: { fg: dark.textDefault, bg: '#b57f25' },
          min: 4.5,
        },
        {
          label: 'Text on container success',
          light: { fg: light.textDefault, bg: '#b7da9b' },
          dark: { fg: dark.textDefault, bg: '#099c53' },
          min: 4.5,
        },
        {
          label: 'Text on container info',
          light: { fg: light.textDefault, bg: '#81d4f7' },
          dark: { fg: dark.textDefault, bg: '#2B6BD5' },
          min: 4.5,
        },
      ] as const;

      const rowsHtml = checks
        .map((pair) => {
          const lightRatio = wcagContrast(pair.light.fg, pair.light.bg);
          const darkRatio = wcagContrast(pair.dark.fg, pair.dark.bg);
          const lightPass = lightRatio >= pair.min;
          const darkPass = darkRatio >= pair.min;
          const passBoth = lightPass && darkPass;

          return `
            <tr>
              <td>${pair.label}</td>
              <td><span class="local-poc-chip" style="background:${pair.light.fg}"></span>${pair.light.fg} on ${pair.light.bg}</td>
              <td class="${lightPass ? 'local-poc-pass' : 'local-poc-fail'}">${lightRatio.toFixed(2)}:1 (${lightPass ? 'PASS' : 'FAIL'})</td>
              <td><span class="local-poc-chip" style="background:${pair.dark.fg}"></span>${pair.dark.fg} on ${pair.dark.bg}</td>
              <td class="${darkPass ? 'local-poc-pass' : 'local-poc-fail'}">${darkRatio.toFixed(2)}:1 (${darkPass ? 'PASS' : 'FAIL'})</td>
              <td>${pair.min.toFixed(1)}:1</td>
              <td class="${passBoth ? 'local-poc-pass' : 'local-poc-fail'}">${passBoth ? 'PASS' : 'FAIL'}</td>
              <td>${apcaObservation(darkRatio)}</td>
            </tr>`;
        })
        .join('');

      wcagBody.innerHTML = rowsHtml;

      const allLightPass = checks.every(
        (pair) => wcagContrast(pair.light.fg, pair.light.bg) >= pair.min,
      );
      const allDarkPass = checks.every(
        (pair) => wcagContrast(pair.dark.fg, pair.dark.bg) >= pair.min,
      );
      const allPass = allLightPass && allDarkPass;

      const setStatus = (
        type: 'both' | 'light' | 'dark',
        label: string,
        pass: boolean,
      ): void => {
        const statusEl = app.querySelector<HTMLElement>(`[data-poc-status="${type}"]`);

        if (!statusEl) {
          return;
        }

        statusEl.textContent = `${label}: ${pass ? 'PASS' : 'FAIL'}`;
        statusEl.classList.toggle('local-poc-pass', pass);
        statusEl.classList.toggle('local-poc-fail', !pass);
      };

      setStatus('both', 'WCAG AA gate (both modes)', allPass);
      setStatus('light', 'Light baseline AA', allLightPass);
      setStatus('dark', 'Dark translation AA', allDarkPass);
    };

    const buildLayerStack = (idPrefix: string): string => `
      <section class="local-layer-surface local-layer-l0" data-sky-layer="00" aria-label="Layer 0 page surface" style="background: var(--local-poc-surface-page, var(--sky-theme-color-background-page, var(--sky-color-background-page))); border-color: var(--local-layer-border, var(--local-poc-border-elevation, var(--sky-theme-color-border-elevation, var(--sky-color-border-elevation))));">
        <span class="local-layer-chip">L0 Page Surface</span>
        <h1>L0 Dark Mode Surface Layering Sandbox</h1>
        <p>Baseline page layer for testing hierarchy, border treatment, and token behavior.</p>
        <div class="local-layer-divider" role="separator"></div>
        <label for="${idPrefix}-l0-input">L0 Input</label>
        <input id="${idPrefix}-l0-input" type="text" value="L0 input on page background" />
        <a href="javascript:void(0)">L0 link for baseline contrast</a>

        <section class="local-layer-surface local-layer-l1" data-sky-layer="01" aria-label="Layer 1 container surface" style="background: var(--local-poc-surface-depth-0, var(--sky-theme-color-background-container-base, var(--sky-color-background-container-base))); border-color: var(--local-layer-border, var(--local-poc-border-elevation, var(--sky-theme-color-border-elevation, var(--sky-color-border-elevation))));">
          <span class="local-layer-chip">L1 Container Surface</span>
          <h2>L1 Primary Container</h2>
          <p>Container layer for core content, with nested content to inspect intra-layer contrast.</p>
          <div class="local-layer-divider" role="separator"></div>
          <label for="${idPrefix}-l1-input">L1 Input</label>
          <input id="${idPrefix}-l1-input" type="text" value="L1 container input" />
          <a href="javascript:void(0)">L1 link inside container</a>

          <section class="local-layer-surface local-layer-l1-nested" data-sky-layer="01" aria-label="Nested content inside layer 1" style="background: var(--local-layer-l1-nested-bg, var(--local-poc-surface-depth-0, var(--sky-theme-color-background-container-base, var(--sky-color-background-container-base)))); border-color: var(--local-layer-border, var(--local-poc-border-elevation, var(--sky-theme-color-border-elevation, var(--sky-color-border-elevation))));">
            <span class="local-layer-chip">Nested In L1</span>
            <h3>L1 Nested Content Block</h3>
            <p>Use this block to inspect separators and text contrast within the same surface level.</p>
            <div class="local-layer-divider" role="separator"></div>
            <label for="${idPrefix}-l1-nested-input">L1 Nested Input</label>
            <input id="${idPrefix}-l1-nested-input" type="text" value="Nested input for contrast checks" />
            <a href="javascript:void(0)">L1 nested link</a>
          </section>

          <aside class="local-layer-surface local-layer-l2" data-sky-layer="02" aria-label="Layer 2 floating overlay" style="background: var(--local-poc-surface-depth-2, var(--sky-theme-color-background-container-backdrop, var(--sky-color-background-container-backdrop))); border-color: var(--local-layer-border, var(--local-poc-border-elevation, var(--sky-theme-color-border-elevation, var(--sky-color-border-elevation))));">
            <span class="local-layer-chip">L2 Floating Overlay</span>
            <h3>L2 Dropdown Overlay</h3>
            <p>Overlay layer for edge contrast and border readability over lower layers.</p>
            <div class="local-layer-divider" role="separator"></div>
            <label for="${idPrefix}-l2-input">L2 Input</label>
            <input id="${idPrefix}-l2-input" type="text" value="Overlay input" />
            <a href="javascript:void(0)">L2 overlay link</a>
          </aside>
        </section>

        <section class="local-layer-surface local-layer-l3" data-sky-layer="03" aria-label="Layer 3 modal surface" style="background: var(--local-poc-surface-depth-3, var(--sky-theme-color-background-container-menu, var(--sky-color-background-container-menu))); border-color: var(--local-layer-border, var(--local-poc-border-elevation, var(--sky-theme-color-border-elevation, var(--sky-color-border-elevation))));">
          <span class="local-layer-chip">L3 Modal Surface</span>
          <h2>L3 Modal-Level Surface</h2>
          <p>Highest layer for modal hierarchy testing and strongest depth separation.</p>
          <div class="local-layer-divider" role="separator"></div>
          <label for="${idPrefix}-l3-input">L3 Input</label>
          <input id="${idPrefix}-l3-input" type="text" value="Modal-level input" />
          <a href="javascript:void(0)">L3 modal link</a>
        </section>
      </section>`;

    app.innerHTML = `
      <main class="local-layer-compare" aria-label="Dark surface layering model comparison">
        <section class="local-layer-nav" aria-label="Sandbox navigation">
          <h2>Layering Sandbox</h2>
          <div class="local-layer-primary-tabs local-layer-main-tabs" role="tablist" aria-label="Demo mode switch">
            <button type="button" class="local-layer-primary-tab" data-demo-target="slate" aria-pressed="false">Slate Demo</button>
            <button type="button" class="local-layer-primary-tab" data-demo-target="gray" aria-pressed="false">Gray Demo</button>
          </div>
          <div class="local-layer-primary-tabs local-layer-main-tabs" role="navigation" aria-label="Primary navigation">
            <a class="local-layer-primary-tab" href="https://localhost:5176/?local-preview=sandbox" data-primary-page-target="home">Home</a>
            <button type="button" class="local-layer-primary-tab" data-primary-page-target="palettes" aria-pressed="false">Palettes</button>
          </div>
          <section class="local-layer-mode-toggle" aria-label="Layering token mode control">
            <div class="local-layer-mode-tabs" role="tablist" aria-label="Layering token mode">
              <button type="button" class="local-layer-mode-tab local-layer-primary-tab" data-layering-child-target="current" aria-pressed="false">Current SKY UX</button>
              <button type="button" class="local-layer-mode-tab local-layer-primary-tab" data-layering-child-target="experimental" aria-pressed="false">Experimental</button>
              <button type="button" class="local-layer-mode-tab local-layer-primary-tab" data-layering-child-target="oklch-steel" aria-pressed="false">OKLCH Steel</button>
              <button type="button" class="local-layer-mode-tab local-layer-primary-tab" data-layering-child-target="oklch-steel-fusion" aria-pressed="false">OKLCH Steel Fusion</button>
              <button type="button" class="local-layer-mode-tab local-layer-primary-tab" data-layering-child-target="dark-poc" aria-pressed="false">OKLCH PoC</button>
            </div>
          </section>
          <div class="local-layer-primary-tabs local-layer-tertiary-tabs" role="tablist" aria-label="Home sections">
            <button type="button" class="local-layer-primary-tab" data-nav-page-target="layering-mode" aria-pressed="false">Layering mode</button>
            <button type="button" class="local-layer-primary-tab" data-nav-page-target="layer-structure" aria-pressed="false">Layer structure</button>
            <button type="button" class="local-layer-primary-tab" data-nav-page-target="evaluation-lab" aria-pressed="false">Evaluation Lab</button>
            <button type="button" class="local-layer-primary-tab" data-nav-page-target="dark-poc-report" aria-pressed="false">OKLCH PoC</button>
          </div>
        </section>

        <section class="local-layer-tab-content" data-primary-page="home" data-nav-page="layering-mode">
          <section class="local-layer-sandbox local-layer-sandbox-standard" aria-label="Layering mode page">
            <h2 class="local-layer-model-title">Layering mode</h2>
            <p class="local-layer-model-copy">Single container view that updates between current SKY UX, experimental, and strict slate-only OKLCH and CIELAB behavior.</p>
            ${buildLayerStack('layering')}
          </section>
        </section>

        <section class="local-layer-tab-content" data-primary-page="home" data-nav-page="layer-structure" hidden>
          <section class="local-layer-sandbox local-layer-architecture" aria-label="Layer structure and nesting behavior">
            <h2 class="local-layer-model-title">Layer structure markup and nesting behavior</h2>
            <p class="local-layer-model-copy">Reference markup and nested behavior for L0 page, L1 container, and L2 overlay.</p>

            <section class="local-layer-architecture-schema" aria-label="Layer structure markup">
              <h3>Markup pattern</h3>
              <pre><code>&lt;section data-sky-layer="00"&gt;
  &lt;section data-sky-layer="01"&gt;
    &lt;aside data-sky-layer="02"&gt;&lt;/aside&gt;
  &lt;/section&gt;
&lt;/section&gt;</code></pre>
            </section>

            <section class="local-layer-architecture-poc" aria-label="Layer structure nesting proof">
              <section class="local-layer-architecture-surface" data-sky-layer="00" aria-label="L0 page">
                <h3>L0 Page</h3>
                <div class="local-layer-divider" role="separator"></div>
                <input type="text" value="L0 input" aria-label="L0 structure input" />

                <section class="local-layer-architecture-surface" data-sky-layer="01" aria-label="L1 container">
                  <h3>L1 Container</h3>
                  <div class="local-layer-divider" role="separator"></div>
                  <input type="text" value="L1 input" aria-label="L1 structure input" />

                  <aside class="local-layer-architecture-surface local-layer-architecture-overlay" data-sky-layer="02" aria-label="L2 overlay">
                    <h3>L2 Overlay</h3>
                    <div class="local-layer-divider" role="separator"></div>
                    <input type="text" value="L2 input" aria-label="L2 structure input" />
                  </aside>
                </section>
              </section>
            </section>
          </section>
        </section>

        <section class="local-layer-tab-content" data-primary-page="palettes" hidden>
          <section class="local-layer-sandbox local-layer-palette" aria-label="Palette comparison page">
            <h2 class="local-layer-model-title">Palettes</h2>
            <p class="local-layer-model-copy">Current SKY UX, CIELAB, and OKLCH ramps shown as vertically stacked columns.</p>

            <section class="local-palette-compare-grid" aria-label="Slate, gray, and blue palette comparisons">
              <article class="local-palette-family">
                <h3>Slate palette</h3>
                <div class="local-palette-columns">
                  <section class="local-palette-column" aria-label="Current SKY UX slate palette">
                    <h4>Current SKY UX Slate</h4>
                    <div class="local-palette-stack">
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-slate-1100, #141b26);"></span><span>#141b26</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-slate-1000, #1a2231);"></span><span>#1a2231</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-slate-900, #212c3f);"></span><span>#212c3f</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-slate-850, #2a384f);"></span><span>#2a384f</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-slate-800, #32435e);"></span><span>#32435e</span></div>
                    </div>
                  </section>

                  <section class="local-palette-column" aria-label="OKLCH Steel Fusion palette">
                    <h4>OKLCH Steel Fusion</h4>
                    <div class="local-palette-stack">
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#F9FCFF;"></span><span class="local-palette-value-group"><span>steel-fusion-25</span><span class="local-palette-hex">#F9FCFF</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#F3F7FB;"></span><span class="local-palette-value-group"><span>steel-fusion-50</span><span class="local-palette-hex">#F3F7FB</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#E8ECF1;"></span><span class="local-palette-value-group"><span>steel-fusion-100</span><span class="local-palette-hex">#E8ECF1</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#D2D7DD;"></span><span class="local-palette-value-group"><span>steel-fusion-200</span><span class="local-palette-hex">#D2D7DD</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#C7CDD4;"></span><span class="local-palette-value-group"><span>steel-fusion-250</span><span class="local-palette-hex">#C7CDD4</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#BCC3CA;"></span><span class="local-palette-value-group"><span>steel-fusion-300</span><span class="local-palette-hex">#BCC3CA</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#A7AEB7;"></span><span class="local-palette-value-group"><span>steel-fusion-400</span><span class="local-palette-hex">#A7AEB7</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#929BA4;"></span><span class="local-palette-value-group"><span>steel-fusion-500</span><span class="local-palette-hex">#929BA4</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#9CA4AE;"></span><span class="local-palette-value-group"><span>steel-fusion-550</span><span class="local-palette-hex">#9CA4AE</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#7E8792;"></span><span class="local-palette-value-group"><span>steel-fusion-600</span><span class="local-palette-hex">#7E8792</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#6D7781;"></span><span class="local-palette-value-group"><span>steel-fusion-700</span><span class="local-palette-hex">#6D7781</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#5D6771;"></span><span class="local-palette-value-group"><span>steel-fusion-800</span><span class="local-palette-hex">#5D6771</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#424952;"></span><span class="local-palette-value-group"><span>steel-fusion-900</span><span class="local-palette-hex">#424952</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#252A2E;"></span><span class="local-palette-value-group"><span>steel-fusion-970</span><span class="local-palette-hex">#252A2E</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#1E2226;"></span><span class="local-palette-value-group"><span>steel-fusion-1000</span><span class="local-palette-hex">#1E2226</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#1C1F24;"></span><span class="local-palette-value-group"><span>steel-fusion-1025</span><span class="local-palette-hex">#1C1F24</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#191D21;"></span><span class="local-palette-value-group"><span>steel-fusion-1050</span><span class="local-palette-hex">#191D21</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#171A1E;"></span><span class="local-palette-value-group"><span>steel-fusion-1075</span><span class="local-palette-hex">#171A1E</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#1C1F24;"></span><span class="local-palette-value-group"><span>steel-fusion-1100</span><span class="local-palette-hex">#1C1F24</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#0D1014;"></span><span class="local-palette-value-group"><span>steel-fusion-1175</span><span class="local-palette-hex">#0D1014</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#0A0E12;"></span><span class="local-palette-value-group"><span>steel-fusion-1200</span><span class="local-palette-hex">#0A0E12</span></span></div>
                    </div>
                  </section>

                  <section class="local-palette-column" aria-label="OKLCH Steel palette">
                    <h4>OKLCH Steel</h4>
                    <div class="local-palette-stack">
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#FAFCFE;"></span><span class="local-palette-value-group"><span>steel-25</span><span class="local-palette-hex">#FAFCFE</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#F3F6FA;"></span><span class="local-palette-value-group"><span>steel-50</span><span class="local-palette-hex">#F3F6FA</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#ECEFF4;"></span><span class="local-palette-value-group"><span>steel-100</span><span class="local-palette-hex">#ECEFF4</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#DDE2E9;"></span><span class="local-palette-value-group"><span>steel-200</span><span class="local-palette-hex">#DDE2E9</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#D2D8E0;"></span><span class="local-palette-value-group"><span>steel-250</span><span class="local-palette-hex">#D2D8E0</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#C4CBD4;"></span><span class="local-palette-value-group"><span>steel-300</span><span class="local-palette-hex">#C4CBD4</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#B4BCC6;"></span><span class="local-palette-value-group"><span>steel-350</span><span class="local-palette-hex">#B4BCC6</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#A2ABB7;"></span><span class="local-palette-value-group"><span>steel-400</span><span class="local-palette-hex">#A2ABB7</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#828C9A;"></span><span class="local-palette-value-group"><span>steel-500</span><span class="local-palette-hex">#828C9A</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#666B70;"></span><span class="local-palette-value-group"><span>steel-600</span><span class="local-palette-hex">#666B70</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#545C68;"></span><span class="local-palette-value-group"><span>steel-700</span><span class="local-palette-hex">#545C68</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#454D59;"></span><span class="local-palette-value-group"><span>steel-800</span><span class="local-palette-hex">#454D59</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#3C4450;"></span><span class="local-palette-value-group"><span>steel-850</span><span class="local-palette-hex">#3C4450</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#353D49;"></span><span class="local-palette-value-group"><span>steel-900</span><span class="local-palette-hex">#353D49</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#2A313C;"></span><span class="local-palette-value-group"><span>steel-1000</span><span class="local-palette-hex">#2A313C</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#272E39;"></span><span class="local-palette-value-group"><span>steel-1025</span><span class="local-palette-hex">#272E39</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#242B36;"></span><span class="local-palette-value-group"><span>steel-1050</span><span class="local-palette-hex">#242B36</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#212834;"></span><span class="local-palette-value-group"><span>steel-1075</span><span class="local-palette-hex">#212834</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#1D242F;"></span><span class="local-palette-value-group"><span>steel-1100</span><span class="local-palette-hex">#1D242F</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#131A24;"></span><span class="local-palette-value-group"><span>steel-1200</span><span class="local-palette-hex">#131A24</span></span></div>
                    </div>
                  </section>
                </div>
              </article>

              <article class="local-palette-family">
                <h3>Gray palette</h3>
                <div class="local-palette-columns">
                  <section class="local-palette-column" aria-label="Current SKY UX gray palette">
                    <h4>Current SKY UX Gray</h4>
                    <div class="local-palette-stack">
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-gray-1100, #161a1f);"></span><span>#161a1f</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-gray-1000, #1e2229);"></span><span>#1e2229</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-gray-900, #252b33);"></span><span>#252b33</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-gray-850, #30363d);"></span><span>#30363d</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-gray-800, #3b4047);"></span><span>#3b4047</span></div>
                    </div>
                  </section>

                  <section class="local-palette-column" aria-label="CIELAB gray palette">
                    <h4>CIELAB Gray</h4>
                    <div class="local-palette-stack">
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(8.5% 0.8 276);"></span><span>lch(8.5% 0.8 276)</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(11.5% 0.9 276);"></span><span>lch(11.5% 0.9 276)</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(15.0% 1.0 276);"></span><span>lch(15.0% 1.0 276)</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(18.5% 1.1 276);"></span><span>lch(18.5% 1.1 276)</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(22.5% 1.2 276);"></span><span>lch(22.5% 1.2 276)</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(26.5% 1.4 276);"></span><span>lch(26.5% 1.4 276)</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(31.0% 1.6 276);"></span><span>lch(31.0% 1.6 276)</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(36.0% 1.9 276);"></span><span>lch(36.0% 1.9 276)</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(41.0% 2.2 276);"></span><span>lch(41.0% 2.2 276)</span></div>
                    </div>
                  </section>

                  <section class="local-palette-column" aria-label="OKLCH gray palette">
                    <h4>OKLCH Gray</h4>
                    <div class="local-palette-stack">
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.16 0.004 255);"></span><span class="local-palette-value-group"><span>oklch(0.16 0.004 255)</span><span class="local-palette-hex">#0c0d0f</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.18 0.004 255);"></span><span class="local-palette-value-group"><span>oklch(0.18 0.004 255)</span><span class="local-palette-hex">#101213</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.20 0.005 255);"></span><span class="local-palette-value-group"><span>oklch(0.20 0.005 255)</span><span class="local-palette-hex">#151618</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.23 0.005 255);"></span><span class="local-palette-value-group"><span>oklch(0.23 0.005 255)</span><span class="local-palette-hex">#1b1d1f</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.26 0.006 255);"></span><span class="local-palette-value-group"><span>oklch(0.26 0.006 255)</span><span class="local-palette-hex">#222427</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.29 0.006 255);"></span><span class="local-palette-value-group"><span>oklch(0.29 0.006 255)</span><span class="local-palette-hex">#292c2e</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.32 0.007 255);"></span><span class="local-palette-value-group"><span>oklch(0.32 0.007 255)</span><span class="local-palette-hex">#303336</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.35 0.007 255);"></span><span class="local-palette-value-group"><span>oklch(0.35 0.007 255)</span><span class="local-palette-hex">#383b3e</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.39 0.008 255);"></span><span class="local-palette-value-group"><span>oklch(0.39 0.008 255)</span><span class="local-palette-hex">#424549</span></span></div>
                    </div>
                  </section>
                </div>
              </article>

              <article class="local-palette-family">
                <h3>Blue palette</h3>
                <div class="local-palette-columns">
                  <section class="local-palette-column" aria-label="Current SKY UX blue palette">
                    <h4>Current SKY UX Blue</h4>
                    <div class="local-palette-stack">
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-blue-1000, #0D2040);"></span><span>#0D2040</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-blue-900, #112B55);"></span><span>#112B55</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-blue-800, #1A4080);"></span><span>#1A4080</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-blue-700, #2256AA);"></span><span>#2256AA</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-blue-600, #2B6BD5);"></span><span>#2B6BD5</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-blue-500, #5589DD);"></span><span>#5589DD</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-blue-400, #80A6E6);"></span><span>#80A6E6</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-blue-350, #96B5EA);"></span><span>#96B5EA</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-blue-300, #AAC4EE);"></span><span>#AAC4EE</span></div>
                    </div>
                  </section>

                  <section class="local-palette-column" aria-label="CIELAB blue palette">
                    <h4>CIELAB Blue</h4>
                    <div class="local-palette-stack">
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(14.0% 20.0 284);"></span><span>lch(14.0% 20.0 284)</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(19.0% 27.0 284);"></span><span>lch(19.0% 27.0 284)</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(28.0% 39.0 285);"></span><span>lch(28.0% 39.0 285)</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(37.0% 50.0 286);"></span><span>lch(37.0% 50.0 286)</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(47.0% 58.0 286);"></span><span>lch(47.0% 58.0 286)</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(57.0% 50.0 282);"></span><span>lch(57.0% 50.0 282)</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(67.0% 38.0 278);"></span><span>lch(67.0% 38.0 278)</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(73.0% 31.0 276);"></span><span>lch(73.0% 31.0 276)</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(79.0% 25.0 274);"></span><span>lch(79.0% 25.0 274)</span></div>
                    </div>
                  </section>

                  <section class="local-palette-column" aria-label="OKLCH blue palette">
                    <h4>OKLCH Blue</h4>
                    <div class="local-palette-stack">
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.248 0.066 260.18);"></span><span class="local-palette-value-group"><span>oklch(0.248 0.066 260.18)</span><span class="local-palette-hex">#0d2040</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.295 0.083 259.60);"></span><span class="local-palette-value-group"><span>oklch(0.295 0.083 259.60)</span><span class="local-palette-hex">#112b55</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.383 0.117 260.21);"></span><span class="local-palette-value-group"><span>oklch(0.383 0.117 260.21)</span><span class="local-palette-hex">#1a4080</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.467 0.146 259.72);"></span><span class="local-palette-value-group"><span>oklch(0.467 0.146 259.72)</span><span class="local-palette-hex">#2256aa</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.51 0.165 265);"></span><span class="local-palette-value-group"><span>oklch(0.51 0.165 265)</span><span class="local-palette-hex">#365ec3</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.60 0.145 265);"></span><span class="local-palette-value-group"><span>oklch(0.60 0.145 265)</span><span class="local-palette-hex">#557cd6</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.69 0.120 265);"></span><span class="local-palette-value-group"><span>oklch(0.69 0.120 265)</span><span class="local-palette-hex">#7799e6</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.74 0.105 265);"></span><span class="local-palette-value-group"><span>oklch(0.74 0.105 265)</span><span class="local-palette-hex">#8aaaee</span></span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.78 0.090 265);"></span><span class="local-palette-value-group"><span>oklch(0.78 0.090 265)</span><span class="local-palette-hex">#9bb7f2</span></span></div>
                    </div>
                  </section>
                </div>
              </article>
            </section>
          </section>
        </section>

        <section class="local-layer-tab-content" data-primary-page="home" data-nav-page="evaluation-lab" hidden>
          <section class="local-layer-sandbox local-eval-lab" aria-label="Evaluation lab page">
            <header class="local-eval-controls" aria-label="Evaluation controls">
              <h2 class="local-layer-model-title">Evaluation Lab</h2>

              <div class="local-eval-control-groups">
                <section class="local-eval-control-group" aria-label="Theme toggle">
                  <h3>Theme</h3>
                  <div class="local-eval-control-buttons" role="tablist" aria-label="Theme">
                    <button type="button" class="local-eval-control-btn" data-eval-theme-target="light" aria-pressed="false">Light</button>
                    <button type="button" class="local-eval-control-btn" data-eval-theme-target="dark" aria-pressed="false">Dark</button>
                  </div>
                </section>

                <section class="local-eval-control-group" aria-label="Color model toggle">
                  <h3>Model</h3>
                  <div class="local-eval-control-buttons" role="tablist" aria-label="Color model">
                    <button type="button" class="local-eval-control-btn" data-eval-model-target="current" aria-pressed="false">Current</button>
                    <button type="button" class="local-eval-control-btn" data-eval-model-target="cielab" aria-pressed="false">CIELAB</button>
                    <button type="button" class="local-eval-control-btn" data-eval-model-target="oklch" aria-pressed="false">OKLCH</button>
                  </div>
                </section>
              </div>
            </header>

            <p class="local-layer-model-copy">Fixed fixture for evaluating readability, hierarchy, and interaction comfort across theme and color model combinations.</p>

            <section class="local-eval-fixture" aria-label="Evaluation fixture">
              <article class="local-eval-surface local-eval-typography" aria-label="Typography hierarchy sample">
                <h1>Heading Level 1</h1>
                <h2>Heading Level 2</h2>
                <h3>Heading Level 3</h3>
                <p>Body copy on the base surface for readability checks over longer text and mixed emphasis.</p>
                <p><strong>Strong text</strong> and <a href="javascript:void(0)">inline link</a> for scanning hierarchy.</p>
                <small>Caption and supporting text should remain legible without drawing focus from primary content.</small>
              </article>

              <article class="local-eval-surface local-eval-nesting" aria-label="Nested container sample">
                <h3>Container levels</h3>
                <p>Check surface progression and edge clarity across nested layers.</p>

                <section class="local-eval-surface local-eval-surface-level-2" aria-label="Nested container level 2">
                  <h4>Nested container</h4>
                  <p>Level 2 container for hierarchy evaluation.</p>

                  <section class="local-eval-surface local-eval-surface-level-3" aria-label="Nested container level 3">
                    <h4>Nested level 3</h4>
                    <p>Small text block for dense, low-contrast checks.</p>
                  </section>
                </section>
              </article>

              <article class="local-eval-surface local-eval-interaction" aria-label="Basic interaction sample">
                <h3>Interaction states</h3>

                <div class="local-eval-interaction-row">
                  <button type="button" class="local-eval-btn">Primary action</button>
                  <button type="button" class="local-eval-btn" disabled>Disabled action</button>
                </div>

                <div class="local-eval-interaction-row">
                  <label for="eval-input-active">Input</label>
                  <input id="eval-input-active" class="local-eval-input" type="text" value="Editable input" />
                </div>

                <div class="local-eval-interaction-row">
                  <label for="eval-input-disabled">Disabled input</label>
                  <input id="eval-input-disabled" class="local-eval-input" type="text" value="Disabled input" disabled />
                </div>
              </article>
            </section>
          </section>
        </section>

        <section class="local-layer-tab-content" data-primary-page="home" data-nav-page="dark-poc-report" hidden>
          <section class="local-layer-sandbox local-layer-dark-poc" aria-label="OKLCH PoC page">
            ${buildDarkPocReport()}
          </section>
        </section>
      </main>`;

    const primaryPageControls = app.querySelectorAll<HTMLElement>('[data-primary-page-target]');
    const primaryPagePanels = app.querySelectorAll<HTMLElement>('[data-primary-page]');
    const navPageButtons = app.querySelectorAll<HTMLButtonElement>('[data-nav-page-target]');
    const navPagePanels = app.querySelectorAll<HTMLElement>('[data-primary-page="home"][data-nav-page]');
    const tertiaryTabs = app.querySelector<HTMLElement>('.local-layer-tertiary-tabs');
    const layeringChildButtons = app.querySelectorAll<HTMLButtonElement>('[data-layering-child-target]');
    const demoModeButtons = app.querySelectorAll<HTMLButtonElement>('[data-demo-target]');
    const evalThemeButtons = app.querySelectorAll<HTMLButtonElement>('[data-eval-theme-target]');
    const evalModelButtons = app.querySelectorAll<HTMLButtonElement>('[data-eval-model-target]');
    const pocViewButtons = app.querySelectorAll<HTMLButtonElement>('[data-poc-view-target]');

    const applyPocSurfaceOverrides = (mode: LayeringMode): void => {
      const demoMode: DemoMode =
        document.body.dataset.demoMode === 'gray' ? 'gray' : 'slate';

      if (mode === 'dark-poc') {
        // Explicit PoC overrides only in dark-poc mode.
        // L2/L3 are intentionally swapped here for PoC testing.
        const anchors = getActiveDarkAnchors();
        const styles = getComputedStyle(app);
        const menuSurface =
          demoMode === 'gray'
            ? normalizeCssColor(styles.getPropertyValue('--bb-color-gray-850')) ?? anchors.slate900.hex
            : normalizeCssColor(
                styles.getPropertyValue('--sky-theme-color-background-container-menu') ||
                  styles.getPropertyValue('--sky-color-background-container-menu'),
              ) ?? '#212c3f';

        app.style.setProperty('--local-poc-surface-page', anchors.slate1100.hex);
        app.style.setProperty('--local-poc-surface-depth-0', anchors.slate1000.hex);
        app.style.setProperty('--local-poc-surface-depth-2', menuSurface);
        app.style.setProperty('--local-poc-surface-depth-3', anchors.slate900.hex);
        app.style.setProperty('--local-layer-border', anchors.elevationBorder.oklch);
        app.style.setProperty('--local-poc-border-elevation', anchors.elevationBorder.oklch);

        return;
      }

      // For all non-PoC modes, mirror active SKY UX tokens to avoid PoC bleed and white fallbacks.
      const styles = getComputedStyle(app);
      const pageSurface =
        demoMode === 'gray'
          ? normalizeCssColor(styles.getPropertyValue('--bb-color-gray-1100')) ?? '#161a1f'
          : normalizeCssColor(
              styles.getPropertyValue('--sky-theme-color-background-page') ||
                styles.getPropertyValue('--sky-color-background-page'),
            ) ?? '#141b26';
      const containerSurface =
        demoMode === 'gray'
          ? normalizeCssColor(styles.getPropertyValue('--bb-color-gray-1000')) ?? '#1e2229'
          : normalizeCssColor(
              styles.getPropertyValue('--sky-theme-color-background-container-base') ||
                styles.getPropertyValue('--sky-color-background-container-base'),
            ) ?? '#1a2231';
      const overlaySurface =
        demoMode === 'gray'
          ? normalizeCssColor(styles.getPropertyValue('--bb-color-gray-900')) ?? '#252b33'
          : normalizeCssColor(
              styles.getPropertyValue('--sky-theme-color-background-container-backdrop') ||
                styles.getPropertyValue('--sky-color-background-container-backdrop'),
            ) ?? '#212c3f';
      const currentDarkOverlaySurface =
        demoMode === 'gray'
          ? normalizeCssColor(styles.getPropertyValue('--bb-color-gray-900')) ?? '#252b33'
          : normalizeCssColor(
              styles.getPropertyValue('--sky-theme-color-background-container-menu') ||
                styles.getPropertyValue('--sky-color-background-container-menu'),
            ) ?? '#2a3950';
      const modalSurface =
        demoMode === 'gray'
          ? normalizeCssColor(styles.getPropertyValue('--bb-color-gray-850')) ?? '#30363d'
          : normalizeCssColor(
              styles.getPropertyValue('--sky-theme-color-background-container-menu') ||
                styles.getPropertyValue('--sky-color-background-container-menu'),
            ) ?? '#2a3950';
      const layerBorder =
        demoMode === 'gray'
          ? normalizeCssColor(styles.getPropertyValue('--bb-color-gray-800')) ?? '#3b4047'
          : normalizeCssColor(
              styles.getPropertyValue('--sky-theme-color-border-elevation') ||
                styles.getPropertyValue('--sky-color-border-elevation'),
            ) ?? '#5d7291';
      const isCurrentDarkMode =
        mode === 'current' && document.body.classList.contains('sky-theme-mode-dark');

      app.style.setProperty('--local-poc-surface-page', pageSurface);
      app.style.setProperty('--local-poc-surface-depth-0', containerSurface);
      app.style.setProperty(
        '--local-poc-surface-depth-2',
        isCurrentDarkMode ? currentDarkOverlaySurface : overlaySurface,
      );
      app.style.setProperty('--local-poc-surface-depth-3', modalSurface);
      app.style.setProperty('--local-layer-border', layerBorder);
      app.style.setProperty('--local-poc-border-elevation', layerBorder);
    };

    const applyPageBackgroundColor = (mode: LayeringMode): void => {
      const demoMode: DemoMode =
        document.body.dataset.demoMode === 'gray' ? 'gray' : 'slate';
      const root = app.querySelector<HTMLElement>('.local-layer-compare');

      if (!root) {
        return;
      }

      const styles = getComputedStyle(app);
      const isGrayPoc = demoMode === 'gray' && mode === 'dark-poc';
      const pageBackground = isGrayPoc
        ? getActiveDarkAnchors().slate1100.hex
        : demoMode === 'gray'
          ? normalizeCssColor(styles.getPropertyValue('--bb-color-gray-1100')) ?? '#161a1f'
          : normalizeCssColor(
              styles.getPropertyValue('--sky-theme-color-background-page') ||
                styles.getPropertyValue('--sky-color-background-page'),
            ) ?? '#141b26';

      root.style.backgroundColor = pageBackground;
    };

    const setDemoMode = (mode: DemoMode): void => {
      document.body.dataset.demoMode = mode;

      demoModeButtons.forEach((button) => {
        const isActive = button.dataset.demoTarget === mode;

        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });

      layeringChildButtons.forEach((button) => {
        if (button.dataset.layeringChildTarget === 'oklch-steel') {
          button.textContent = mode === 'gray' ? 'OKLCH / Gray' : 'OKLCH Steel';
        }

        if (button.dataset.layeringChildTarget === 'oklch-steel-fusion') {
          button.textContent = mode === 'gray' ? 'OKLCH Steel Fusion / Gray' : 'OKLCH Steel Fusion';
        }
      });

      const currentLayeringMode: LayeringMode =
        document.body.dataset.layering === 'experimental'
          ? 'experimental'
          : document.body.dataset.layering === 'oklch-steel'
            ? 'oklch-steel'
            : document.body.dataset.layering === 'oklch-steel-fusion'
              ? 'oklch-steel-fusion'
              : document.body.dataset.layering === 'dark-poc'
                ? 'dark-poc'
                : 'current';

      applyPocSurfaceOverrides(currentLayeringMode);
      applyPageBackgroundColor(currentLayeringMode);
      updatePocLiveStatus();
    };

    const setLayeringMode = (mode: LayeringMode): void => {
      document.body.dataset.layering = mode;
      applyPocSurfaceOverrides(mode);
      applyPageBackgroundColor(mode);

      layeringChildButtons.forEach((button) => {
        const isActive = button.dataset.layeringChildTarget === mode;

        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });

      updatePocLiveStatus();
    };

    const setNavPage = (page: HomePage): void => {
      navPagePanels.forEach((panel) => {
        panel.hidden = panel.dataset.navPage !== page;
      });

      navPageButtons.forEach((button) => {
        const isActive = button.dataset.navPageTarget === page;

        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });
    };

    const setPrimaryPage = (page: 'home' | 'palettes'): void => {
      primaryPagePanels.forEach((panel) => {
        panel.hidden = panel.dataset.primaryPage !== page;
      });

      primaryPageControls.forEach((control) => {
        const isActive = control.dataset.primaryPageTarget === page;

        control.classList.toggle('is-active', isActive);

        if (control instanceof HTMLButtonElement) {
          control.setAttribute('aria-pressed', String(isActive));
        }

        if (control instanceof HTMLAnchorElement) {
          if (isActive) {
            control.setAttribute('aria-current', 'page');
          } else {
            control.removeAttribute('aria-current');
          }
        }
      });

      if (tertiaryTabs) {
        tertiaryTabs.hidden = page !== 'home';
      }
    };

    const setLayeringChild = (child: LayeringMode): void => {
      layeringChildButtons.forEach((button) => {
        const isActive = button.dataset.layeringChildTarget === child;

        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });

      setLayeringMode(child);
    };

    const setEvalTheme = (theme: 'light' | 'dark'): void => {
      document.body.dataset.evalTheme = theme;

      evalThemeButtons.forEach((button) => {
        const isActive = button.dataset.evalThemeTarget === theme;

        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });

      updatePocLiveStatus();
    };

    const setEvalModel = (model: 'current' | 'cielab' | 'oklch'): void => {
      document.body.dataset.evalModel = model;

      evalModelButtons.forEach((button) => {
        const isActive = button.dataset.evalModelTarget === model;

        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });
    };

    const setPocView = (view: PocView): void => {
      document.body.dataset.pocView = view;

      pocViewButtons.forEach((button) => {
        const isActive = button.dataset.pocViewTarget === view;

        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });

      if (view === 'light' || view === 'dark') {
        setEvalTheme(view);
      }

      updatePocLiveStatus();
    };

    const setMatrixTab = (tab: string): void => {
      const tabButtons = app.querySelectorAll<HTMLButtonElement>('.local-poc-matrix-tab-btn');
      const tabPanels = app.querySelectorAll<HTMLElement>('.local-poc-matrix-tab');

      tabButtons.forEach((button) => {
        const isActive = button.dataset.matrixTab === tab;

        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });

      tabPanels.forEach((panel) => {
        const isActive = panel.dataset.matrixTab === tab;

        panel.style.display = isActive ? 'block' : 'none';
      });
    };

    navPageButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const target = button.dataset.navPageTarget;
        const page =
          target === 'layer-structure'
            ? 'layer-structure'
            : target === 'evaluation-lab'
                ? 'evaluation-lab'
              : target === 'dark-poc-report'
                ? 'dark-poc-report'
              : 'layering-mode';

        setNavPage(page);
      });
    });

    primaryPageControls.forEach((control) => {
      control.addEventListener('click', () => {
        const page = control.dataset.primaryPageTarget === 'palettes' ? 'palettes' : 'home';

        setPrimaryPage(page);
      });
    });

    layeringChildButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const child =
          button.dataset.layeringChildTarget === 'experimental'
            ? 'experimental'
            : button.dataset.layeringChildTarget === 'oklch-steel'
              ? 'oklch-steel'
              : button.dataset.layeringChildTarget === 'oklch-steel-fusion'
                ? 'oklch-steel-fusion'
                : button.dataset.layeringChildTarget === 'dark-poc'
                  ? 'dark-poc'
            : 'current';

        setLayeringChild(child);
      });
    });

    evalThemeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const theme = button.dataset.evalThemeTarget === 'light' ? 'light' : 'dark';

        setEvalTheme(theme);
      });
    });

    evalModelButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const model =
          button.dataset.evalModelTarget === 'cielab'
            ? 'cielab'
            : button.dataset.evalModelTarget === 'oklch'
              ? 'oklch'
            : 'current';

        setEvalModel(model);
      });
    });

    pocViewButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const view =
          button.dataset.pocViewTarget === 'light'
            ? 'light'
            : button.dataset.pocViewTarget === 'dark'
              ? 'dark'
              : 'side-by-side';

        setPocView(view);
      });
    });

    const matrixTabButtons = app.querySelectorAll<HTMLButtonElement>('.local-poc-matrix-tab-btn');

    matrixTabButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const tab = button.dataset.matrixTab || 'surfaces';

        setMatrixTab(tab);
      });
    });

    demoModeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const mode: DemoMode = button.dataset.demoTarget === 'gray' ? 'gray' : 'slate';

        setDemoMode(mode);
      });
    });

    setPrimaryPage('home');
    setNavPage('layering-mode');
    setDemoMode(initialDemoMode);
    setLayeringChild(initialLayeringMode);
    setEvalTheme(initialEvalTheme);
    setEvalModel(initialEvalModel);
    setPocView(initialPocView);
    updatePocLiveStatus();
  }
}

if (showPalettePreview) {
  const app = document.getElementById('app');

  if (app) {
    const grayRamp = [
      { step: '1100', hex: '#161a1f' },
      { step: '1000', hex: '#1e2229' },
      { step: '900', hex: '#252b33' },
      { step: '850', hex: '#30363d' },
      { step: '800', hex: '#3b4047' },
    ];

    const slateRamp = [
      { step: '1100', hex: '#141b26' },
      { step: '1000', hex: '#1a2231' },
      { step: '900', hex: '#212c3f' },
      { step: '850', hex: '#2a384f' },
      { step: '800', hex: '#32435e' },
    ];

    const navTemplate = (route: string): string => {
      const surfacesActive = route === 'surfaces' ? 'is-active' : '';
      const paletteActive = route === 'palette' ? 'is-active' : '';

      return `
        <header class="spa-header sky-box">
          <div>
            <h1>SKY UX Local SPA Preview</h1>
            <p>Theme-aware SPA shell for dark surfaces and CIELAB palette validation.</p>
          </div>
          <nav class="spa-nav" aria-label="Preview sections">
            <a class="spa-nav-link ${surfacesActive}" href="#/surfaces">Surface Demo</a>
            <a class="spa-nav-link ${paletteActive}" href="#/palette">Palette Ramp</a>
          </nav>
        </header>`;
    };

    const surfacePage = (): string => `
      <section class="palette-card sky-box">
        <h2>Systemic Dark Simulation</h2>
        <p>Inputs below are real <code>.sky-input-box</code> elements in page, container, and dimmed contexts.</p>
        <div class="demo-grid">
          <article class="demo-card sky-box page-surface">
            <h3>Page Surface</h3>
            <div class="sky-input-box">
              <input aria-label="Page surface input" placeholder="Page surface input" />
            </div>
          </article>
          <article class="demo-card sky-box">
            <h3>Container Base</h3>
            <div class="sky-input-box">
              <input aria-label="Container base input" placeholder="Container base input" />
            </div>
          </article>
          <article class="demo-card sky-box sky-theme-background-container-dimmed" data-sky-surface="container-dimmed">
            <h3>Container Dimmed</h3>
            <div class="sky-input-box">
              <input aria-label="Container dimmed input" placeholder="Container dimmed input" />
            </div>
          </article>
        </div>
      </section>`;

    const buildRamp = (
      title: string,
      data: Array<{ step: string; hex: string }>,
    ): string => {
      return `
        <section class="palette-card sky-box">
          <h2>${title} Ramp</h2>
          <p>Anchor: 1100, then nearest CIELAB targets at +4, +8, +12, +16 L*.</p>
          <div class="swatch-row">
            ${data
              .map(
                (item, index) => `
                  <article class="swatch sky-box page-surface">
                    <div class="chip" style="background:${item.hex}"></div>
                    <div class="meta">
                      <strong>Layer ${index}</strong>
                      <span>${title.toLowerCase()}.${item.step}</span>
                      <span>${item.hex}</span>
                    </div>
                  </article>`,
              )
              .join('')}
          </div>
        </section>`;
    };

    const palettePage = (): string => `
      ${buildRamp('Gray', grayRamp)}
      ${buildRamp('Slate', slateRamp)}`;

    const render = (): void => {
      const route = location.hash === '#/palette' ? 'palette' : 'surfaces';
      const pageContent = route === 'palette' ? palettePage() : surfacePage();

      app.innerHTML = `
        <div class="sky-page palette-preview-app">
          ${navTemplate(route)}
          <main class="palette-preview" id="spa-main">
            ${pageContent}
          </main>
        </div>`;
    };

    if (!location.hash) {
      location.hash = '#/surfaces';
    }

    window.addEventListener('hashchange', render);
    render();
  }
}
