import '@skyux/theme/css/sky.css';
import '@skyux/theme/css/themes/modern/styles.css';

document.body.classList.add(
  'local-dev-tokens',
  'sky-theme-modern',
  'sky-theme-brand-base',
  'sky-theme-brand-blackbaud',
  'sky-theme-mode-dark',
);

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
        : document.body.dataset.layering === 'oklch-slate'
          ? 'oklch-slate'
          : document.body.dataset.layering === 'cielab-slate'
            ? 'cielab-slate'
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

    document.body.dataset.layering = initialLayeringMode;
    document.body.dataset.evalTheme = initialEvalTheme;
    document.body.dataset.evalModel = initialEvalModel;
    document.body.dataset.pocView = initialPocView;

    type LayeringMode =
      | 'current'
      | 'experimental'
      | 'oklch-slate'
      | 'cielab-slate'
      | 'dark-poc';
    type HomePage =
      | 'layering-mode'
      | 'layer-structure'
      | 'evaluation-lab'
      | 'dark-poc-report';
    type PocView = 'light' | 'dark' | 'side-by-side';

    const pocLightBaseline = {
      slate1100: '#f7f9fc',
      slate1000: '#ffffff',
      slate900: '#f0f4f9',
      slate200: '#4f5e73',
      slate50: '#1d2736',
      textDefault: '#1d2736',
      textDeemphasized: '#4f5e73',
      textHeading: '#161a1f',
      divider: '#c2cfde',
      elevationBorder: '#b2c0d3',
      linkDefault: '#1859d1',
      linkHover: '#1f67e3',
      linkActive: '#154daf',
      linkFocus: '#1859d1',
      linkVisited: '#6d43c8',
    } as const;

    const pocAnchors = {
      slate1100: '#121824',
      slate1000: '#1b2433',
      slate900: '#27354a',
      slate200: '#b8c7da',
      slate50: '#e8eef7',
      textDefault: '#e8eef7',
      textDeemphasized: '#b8c7da',
      textHeading: '#f3f7fd',
      divider: '#4f607b',
      elevationBorder: '#5d7291',
      linkDefault: '#8bb8ff',
      linkHover: '#a2c6ff',
      linkActive: '#73a8ff',
      linkFocus: '#8bb8ff',
      linkVisited: '#baa5ff',
    } as const;

    const matrixRows = [
      {
        role: 'Page',
        light: '{bb.color.slate.100}',
        currentDark: '{bb.color.gray.1100}',
        lightHex: pocLightBaseline.slate1100,
        darkHex: pocAnchors.slate1100,
        candidateDark: 'poc.slate.1100',
        rationale:
          'Base layer anchored darker to maintain clear separation from containers.',
      },
      {
        role: 'Container base',
        light: '{color.background.container.dimmed}',
        currentDark: '{bb.color.gray.1000}',
        lightHex: pocLightBaseline.slate1000,
        darkHex: pocAnchors.slate1000,
        candidateDark: 'poc.slate.1000',
        rationale: 'Primary content surface lifted one step above page.',
      },
      {
        role: 'Menu',
        light: '{color.background.container.backdrop}',
        currentDark: '{bb.color.gray.900}',
        lightHex: pocLightBaseline.slate900,
        darkHex: pocAnchors.slate900,
        candidateDark: 'poc.slate.900',
        rationale: 'Floating layer uses stronger lift while avoiding card-like detachment.',
      },
      {
        role: 'Text default',
        light: '{bb.color.gray.1000}',
        currentDark: '{bb.color.gray.25}',
        lightHex: pocLightBaseline.textDefault,
        darkHex: pocAnchors.textDefault,
        candidateDark: 'poc.textDefault',
        rationale: 'Optimized for long-form readability on 1100/1000 surfaces.',
      },
      {
        role: 'Text deemphasized',
        light: '{bb.color.gray.600}',
        currentDark: '{bb.color.gray.300}',
        lightHex: pocLightBaseline.textDeemphasized,
        darkHex: pocAnchors.textDeemphasized,
        candidateDark: 'poc.textDeemphasized',
        rationale: 'Secondary tier stays distinct but not low-contrast.',
      },
      {
        role: 'Heading',
        light: '{bb.color.blue.900}',
        currentDark: '{bb.color.gray.50}',
        lightHex: pocLightBaseline.textHeading,
        darkHex: pocAnchors.textHeading,
        candidateDark: 'poc.textHeading',
        rationale: 'Heading tier remains visually authoritative over body copy.',
      },
      {
        role: 'Divider',
        light: '{bb.color.slate.300}',
        currentDark: '{bb.color.gray.800}',
        lightHex: pocLightBaseline.divider,
        darkHex: pocAnchors.divider,
        candidateDark: 'poc.divider',
        rationale: 'Structural separators visible without introducing noise.',
      },
      {
        role: 'Elevation border',
        light: '{bb.color.slate.250}',
        currentDark: '{bb.color.gray.800}',
        lightHex: pocLightBaseline.elevationBorder,
        darkHex: pocAnchors.elevationBorder,
        candidateDark: 'poc.elevationBorder',
        rationale: 'Overlay boundaries read cleanly on page and containers.',
      },
      {
        role: 'Interactive text',
        light: '{bb.color.blue.600}',
        currentDark: '{bb.color.blue.500}',
        lightHex: pocLightBaseline.linkDefault,
        darkHex: pocAnchors.linkDefault,
        candidateDark: 'poc.linkDefault',
        rationale: 'Interactive affordance remains explicit with underline support.',
      },
      {
        role: 'Link states',
        light: 'blue state ramp',
        currentDark: 'blue.500 / blue.400 mix',
        lightHex: `${pocLightBaseline.linkDefault} -> ${pocLightBaseline.linkVisited}`,
        darkHex: `${pocAnchors.linkDefault} -> ${pocAnchors.linkVisited}`,
        candidateDark: 'poc.link* state set',
        rationale: 'Default/hover/active/focus/visited are all distinguishable.',
      },
    ] as const;

    const wcagChecks = [
      {
        label: 'Body text on page',
        light: { fg: pocLightBaseline.textDefault, bg: pocLightBaseline.slate1100 },
        dark: { fg: pocAnchors.textDefault, bg: pocAnchors.slate1100 },
        min: 4.5,
      },
      {
        label: 'Body text on container',
        light: { fg: pocLightBaseline.textDefault, bg: pocLightBaseline.slate1000 },
        dark: { fg: pocAnchors.textDefault, bg: pocAnchors.slate1000 },
        min: 4.5,
      },
      {
        label: 'Deemphasized text on page',
        light: { fg: pocLightBaseline.textDeemphasized, bg: pocLightBaseline.slate1100 },
        dark: { fg: pocAnchors.textDeemphasized, bg: pocAnchors.slate1100 },
        min: 4.5,
      },
      {
        label: 'Heading on page',
        light: { fg: pocLightBaseline.textHeading, bg: pocLightBaseline.slate1100 },
        dark: { fg: pocAnchors.textHeading, bg: pocAnchors.slate1100 },
        min: 3,
      },
      {
        label: 'Link default on page',
        light: { fg: pocLightBaseline.linkDefault, bg: pocLightBaseline.slate1100 },
        dark: { fg: pocAnchors.linkDefault, bg: pocAnchors.slate1100 },
        min: 4.5,
      },
      {
        label: 'Link visited on page',
        light: { fg: pocLightBaseline.linkVisited, bg: pocLightBaseline.slate1100 },
        dark: { fg: pocAnchors.linkVisited, bg: pocAnchors.slate1100 },
        min: 4.5,
      },
      {
        label: 'Divider on page (non-text)',
        light: { fg: pocLightBaseline.divider, bg: pocLightBaseline.slate1100 },
        dark: { fg: pocAnchors.divider, bg: pocAnchors.slate1100 },
        min: 3,
      },
      {
        label: 'Elevation border on page (non-text)',
        light: { fg: pocLightBaseline.elevationBorder, bg: pocLightBaseline.slate1100 },
        dark: { fg: pocAnchors.elevationBorder, bg: pocAnchors.slate1100 },
        min: 3,
      },
    ] as const;

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
      const matrixHtml = matrixRows
        .map(
          (row) => `
            <tr>
              <td>${row.role}</td>
              <td>${row.light}</td>
              <td>${row.currentDark}</td>
              <td><span class="local-poc-chip" style="background:${row.lightHex}"></span>${row.lightHex}</td>
              <td><span class="local-poc-chip" style="background:${row.darkHex}"></span>${row.darkHex}</td>
              <td>${row.candidateDark}</td>
              <td>${row.rationale}</td>
            </tr>`,
        )
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
          </header>

          <section class="local-poc-card" aria-label="Candidate anchors">
            <h3>Candidate anchors</h3>
            <ul class="local-poc-anchor-list">
              <li data-poc-mode="light"><span class="local-poc-chip" style="background:${pocLightBaseline.slate1100}"></span>1100 (page): ${pocLightBaseline.slate1100}</li>
              <li data-poc-mode="light"><span class="local-poc-chip" style="background:${pocLightBaseline.slate1000}"></span>1000 (container): ${pocLightBaseline.slate1000}</li>
              <li data-poc-mode="light"><span class="local-poc-chip" style="background:${pocLightBaseline.slate900}"></span>900 (menu/overlay): ${pocLightBaseline.slate900}</li>
              <li data-poc-mode="light"><span class="local-poc-chip" style="background:${pocLightBaseline.slate200}"></span>200 (deemphasized text intent): ${pocLightBaseline.slate200}</li>
              <li data-poc-mode="light"><span class="local-poc-chip" style="background:${pocLightBaseline.slate50}"></span>50 (default text intent): ${pocLightBaseline.slate50}</li>
              <li data-poc-mode="dark"><span class="local-poc-chip" style="background:${pocAnchors.slate1100}"></span>1100 (page): ${pocAnchors.slate1100}</li>
              <li data-poc-mode="dark"><span class="local-poc-chip" style="background:${pocAnchors.slate1000}"></span>1000 (container): ${pocAnchors.slate1000}</li>
              <li data-poc-mode="dark"><span class="local-poc-chip" style="background:${pocAnchors.slate900}"></span>900 (menu/overlay): ${pocAnchors.slate900}</li>
              <li data-poc-mode="dark"><span class="local-poc-chip" style="background:${pocAnchors.slate200}"></span>200 (deemphasized text intent): ${pocAnchors.slate200}</li>
              <li data-poc-mode="dark"><span class="local-poc-chip" style="background:${pocAnchors.slate50}"></span>50 (default text intent): ${pocAnchors.slate50}</li>
            </ul>
          </section>

          <section class="local-poc-card" aria-label="Role mapping matrix">
            <h3>Role mapping matrix</h3>
            <div class="local-poc-table-wrap">
              <table class="local-poc-table">
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Light semantic</th>
                    <th>Current dark</th>
                    <th>Light baseline</th>
                    <th>Dark translation</th>
                    <th>Candidate dark</th>
                    <th>Rationale</th>
                  </tr>
                </thead>
                <tbody>${matrixHtml}</tbody>
              </table>
            </div>
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
            <p>Affordance rule: links are underlined by default, and state changes must remain distinguishable on page, container, and menu surfaces.</p>
            <div class="local-poc-link-row" data-poc-mode="light" style="background:${pocLightBaseline.slate1100}">
              <a href="javascript:void(0)" class="local-poc-link local-poc-link-light" data-link-state="default">Default link</a>
              <a href="javascript:void(0)" class="local-poc-link local-poc-link-light" data-link-state="hover">Hover link</a>
              <a href="javascript:void(0)" class="local-poc-link local-poc-link-light" data-link-state="active">Active link</a>
              <a href="javascript:void(0)" class="local-poc-link local-poc-link-light" data-link-state="focus">Focus link</a>
              <a href="javascript:void(0)" class="local-poc-link local-poc-link-light" data-link-state="visited">Visited link</a>
            </div>
            <div class="local-poc-link-row" data-poc-mode="dark" style="background:${pocAnchors.slate1100}">
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
              <li>Status and data-viz families are explicitly deferred to Phase 2.</li>
            </ul>
            <h4>Recommended next iteration steps</h4>
            <ol>
              <li>Run this matrix against additional long-form content fixtures and controls.</li>
              <li>Promote passed values into provisional dark reference tokens only after design review.</li>
              <li>Extend the same validation method to status and data-viz families.</li>
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

      const snapshot = {
        pageBg: readColor(styles.getPropertyValue('--local-layer-l0-bg'), '#141b26'),
        containerBg: readColor(styles.getPropertyValue('--local-layer-l1-bg'), '#1a2231'),
        textDefault: readColor(
          styles.getPropertyValue('--sky-theme-color-text-default'),
          fallback,
        ),
        textDeemphasized: readColor(
          styles.getPropertyValue('--local-layer-text-muted'),
          fallback,
        ),
        heading: readColor(
          styles.getPropertyValue('--sky-theme-color-text-heading'),
          fallback,
        ),
        divider: readColor(styles.getPropertyValue('--local-layer-divider'), fallback),
        elevationBorder: readColor(styles.getPropertyValue('--local-layer-border'), fallback),
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

      const light = readThemeSnapshot('light');
      const dark = readThemeSnapshot('dark');

      if (!light || !dark) {
        return;
      }

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
      <section class="local-layer-surface local-layer-l0" data-sky-layer="00" aria-label="Layer 0 page surface">
        <span class="local-layer-chip">L0 Page Surface</span>
        <h1>L0 Dark Mode Surface Layering Sandbox</h1>
        <p>Baseline page layer for testing hierarchy, border treatment, and token behavior.</p>
        <div class="local-layer-divider" role="separator"></div>
        <label for="${idPrefix}-l0-input">L0 Input</label>
        <input id="${idPrefix}-l0-input" type="text" value="L0 input on page background" />
        <a href="javascript:void(0)">L0 link for baseline contrast</a>

        <section class="local-layer-surface local-layer-l1" data-sky-layer="01" aria-label="Layer 1 container surface">
          <span class="local-layer-chip">L1 Container Surface</span>
          <h2>L1 Primary Container</h2>
          <p>Container layer for core content, with nested content to inspect intra-layer contrast.</p>
          <div class="local-layer-divider" role="separator"></div>
          <label for="${idPrefix}-l1-input">L1 Input</label>
          <input id="${idPrefix}-l1-input" type="text" value="L1 container input" />
          <a href="javascript:void(0)">L1 link inside container</a>

          <section class="local-layer-surface local-layer-l1-nested" data-sky-layer="01" aria-label="Nested content inside layer 1">
            <span class="local-layer-chip">Nested In L1</span>
            <h3>L1 Nested Content Block</h3>
            <p>Use this block to inspect separators and text contrast within the same surface level.</p>
            <div class="local-layer-divider" role="separator"></div>
            <label for="${idPrefix}-l1-nested-input">L1 Nested Input</label>
            <input id="${idPrefix}-l1-nested-input" type="text" value="Nested input for contrast checks" />
            <a href="javascript:void(0)">L1 nested link</a>
          </section>

          <aside class="local-layer-surface local-layer-l2" data-sky-layer="02" aria-label="Layer 2 floating overlay">
            <span class="local-layer-chip">L2 Floating Overlay</span>
            <h3>L2 Dropdown Overlay</h3>
            <p>Overlay layer for edge contrast and border readability over lower layers.</p>
            <div class="local-layer-divider" role="separator"></div>
            <label for="${idPrefix}-l2-input">L2 Input</label>
            <input id="${idPrefix}-l2-input" type="text" value="Overlay input" />
            <a href="javascript:void(0)">L2 overlay link</a>
          </aside>
        </section>

        <section class="local-layer-surface local-layer-l3" data-sky-layer="03" aria-label="Layer 3 modal surface">
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
          <div class="local-layer-primary-tabs local-layer-main-tabs" role="navigation" aria-label="Primary navigation">
            <a class="local-layer-primary-tab" href="https://localhost:5176/?local-preview=sandbox" data-primary-page-target="home">Home</a>
            <button type="button" class="local-layer-primary-tab" data-primary-page-target="palettes" aria-pressed="false">Palettes</button>
          </div>
          <section class="local-layer-mode-toggle" aria-label="Layering token mode control">
            <div class="local-layer-mode-tabs" role="tablist" aria-label="Layering token mode">
              <button type="button" class="local-layer-mode-tab local-layer-primary-tab" data-layering-child-target="current" aria-pressed="false">Current SKY UX</button>
              <button type="button" class="local-layer-mode-tab local-layer-primary-tab" data-layering-child-target="experimental" aria-pressed="false">Experimental</button>
              <button type="button" class="local-layer-mode-tab local-layer-primary-tab" data-layering-child-target="oklch-slate" aria-pressed="false">OKLCH Slate</button>
              <button type="button" class="local-layer-mode-tab local-layer-primary-tab" data-layering-child-target="cielab-slate" aria-pressed="false">CIELAB Slate</button>
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
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-slate-1100, #141b26);"></span><span>1100</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-slate-1000, #1a2231);"></span><span>1000</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-slate-900, #212c3f);"></span><span>900</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-slate-850, #2a384f);"></span><span>850</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-slate-800, #32435e);"></span><span>800</span></div>
                    </div>
                  </section>

                  <section class="local-palette-column" aria-label="CIELAB slate palette">
                    <h4>CIELAB Slate</h4>
                    <div class="local-palette-stack">
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(10.0% 5.0 279);"></span><span>1200</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(12.5% 6.0 279);"></span><span>1150</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(15.5% 7.0 279);"></span><span>1100</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(18.5% 8.0 279);"></span><span>1050</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(22.0% 9.0 279);"></span><span>1000</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(25.5% 10.5 279);"></span><span>950</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(29.5% 12.0 279);"></span><span>900</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(34.0% 13.5 279);"></span><span>850</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(39.0% 15.0 279);"></span><span>800</span></div>
                    </div>
                  </section>

                  <section class="local-palette-column" aria-label="OKLCH slate palette">
                    <h4>OKLCH Slate</h4>
                    <div class="local-palette-stack">
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.16 0.018 255);"></span><span>1200</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.18 0.020 255);"></span><span>1150</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.20 0.023 255);"></span><span>1100</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.22 0.026 255);"></span><span>1050</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.24 0.029 255);"></span><span>1000</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.27 0.033 255);"></span><span>950</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.30 0.037 255);"></span><span>900</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.34 0.041 255);"></span><span>850</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.38 0.045 255);"></span><span>800</span></div>
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
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-gray-1100, #161a1f);"></span><span>1100</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-gray-1000, #1e2229);"></span><span>1000</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-gray-900, #252b33);"></span><span>900</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-gray-850, #30363d);"></span><span>850</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-gray-800, #3b4047);"></span><span>800</span></div>
                    </div>
                  </section>

                  <section class="local-palette-column" aria-label="CIELAB gray palette">
                    <h4>CIELAB Gray</h4>
                    <div class="local-palette-stack">
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(8.5% 0.8 276);"></span><span>1200</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(11.5% 0.9 276);"></span><span>1150</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(15.0% 1.0 276);"></span><span>1100</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(18.5% 1.1 276);"></span><span>1050</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(22.5% 1.2 276);"></span><span>1000</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(26.5% 1.4 276);"></span><span>950</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(31.0% 1.6 276);"></span><span>900</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(36.0% 1.9 276);"></span><span>850</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(41.0% 2.2 276);"></span><span>800</span></div>
                    </div>
                  </section>

                  <section class="local-palette-column" aria-label="OKLCH gray palette">
                    <h4>OKLCH Gray</h4>
                    <div class="local-palette-stack">
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.16 0.004 255);"></span><span>1200</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.18 0.004 255);"></span><span>1150</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.20 0.005 255);"></span><span>1100</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.23 0.005 255);"></span><span>1050</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.26 0.006 255);"></span><span>1000</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.29 0.006 255);"></span><span>950</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.32 0.007 255);"></span><span>900</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.35 0.007 255);"></span><span>850</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.39 0.008 255);"></span><span>800</span></div>
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
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-blue-1000, #0D2040);"></span><span>1000</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-blue-900, #112B55);"></span><span>900</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-blue-800, #1A4080);"></span><span>800</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-blue-700, #2256AA);"></span><span>700</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-blue-600, #2B6BD5);"></span><span>600</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-blue-500, #5589DD);"></span><span>500</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-blue-400, #80A6E6);"></span><span>400</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-blue-350, #96B5EA);"></span><span>350</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background: var(--bb-color-blue-300, #AAC4EE);"></span><span>300</span></div>
                    </div>
                  </section>

                  <section class="local-palette-column" aria-label="CIELAB blue palette">
                    <h4>CIELAB Blue</h4>
                    <div class="local-palette-stack">
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(14.0% 20.0 284);"></span><span>1000</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(19.0% 27.0 284);"></span><span>900</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(28.0% 39.0 285);"></span><span>800</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(37.0% 50.0 286);"></span><span>700</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(47.0% 58.0 286);"></span><span>600</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(57.0% 50.0 282);"></span><span>500</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(67.0% 38.0 278);"></span><span>400</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(73.0% 31.0 276);"></span><span>350</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(79.0% 25.0 274);"></span><span>300</span></div>
                    </div>
                  </section>

                  <section class="local-palette-column" aria-label="OKLCH blue palette">
                    <h4>OKLCH Blue</h4>
                    <div class="local-palette-stack">
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.248 0.066 260.18);"></span><span>1000</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.295 0.083 259.60);"></span><span>900</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.383 0.117 260.21);"></span><span>800</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.467 0.146 259.72);"></span><span>700</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.51 0.165 265);"></span><span>600</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.60 0.145 265);"></span><span>500</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.69 0.120 265);"></span><span>400</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.74 0.105 265);"></span><span>350</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:oklch(0.78 0.090 265);"></span><span>300</span></div>
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
    const evalThemeButtons = app.querySelectorAll<HTMLButtonElement>('[data-eval-theme-target]');
    const evalModelButtons = app.querySelectorAll<HTMLButtonElement>('[data-eval-model-target]');
    const pocViewButtons = app.querySelectorAll<HTMLButtonElement>('[data-poc-view-target]');

    const setLayeringMode = (mode: LayeringMode): void => {
      document.body.dataset.layering = mode;

      layeringChildButtons.forEach((button) => {
        const isActive = button.dataset.layeringChildTarget === mode;

        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });
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
            : button.dataset.layeringChildTarget === 'oklch-slate'
              ? 'oklch-slate'
              : button.dataset.layeringChildTarget === 'cielab-slate'
                ? 'cielab-slate'
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

    setPrimaryPage('home');
    setNavPage('layering-mode');
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
