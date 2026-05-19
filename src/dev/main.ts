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
        : 'current';
    const initialEvalTheme =
      document.body.dataset.evalTheme === 'light' ? 'light' : 'dark';
    const initialEvalModel =
      document.body.dataset.evalModel === 'cielab'
        ? 'cielab'
        : document.body.dataset.evalModel === 'oklch'
          ? 'oklch'
          : 'current';

    document.body.dataset.layering = initialLayeringMode;
    document.body.dataset.evalTheme = initialEvalTheme;
    document.body.dataset.evalModel = initialEvalModel;

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
          <section class="local-layer-mode-toggle" aria-label="Layering token mode control">
            <div class="local-layer-mode-tabs" role="tablist" aria-label="Layering token mode">
              <button type="button" class="local-layer-mode-tab local-layer-primary-tab" data-layering-child-target="current" aria-pressed="false">Current SKY UX</button>
              <button type="button" class="local-layer-mode-tab local-layer-primary-tab" data-layering-child-target="experimental" aria-pressed="false">Experimental</button>
              <button type="button" class="local-layer-mode-tab local-layer-primary-tab" data-layering-child-target="oklch-slate" aria-pressed="false">OKLCH Slate</button>
              <button type="button" class="local-layer-mode-tab local-layer-primary-tab" data-layering-child-target="cielab-slate" aria-pressed="false">CIELAB Slate</button>
            </div>
          </section>
          <div class="local-layer-primary-tabs" role="tablist" aria-label="Primary pages">
            <button type="button" class="local-layer-primary-tab" data-nav-page-target="layering-mode" aria-pressed="false">Layering mode</button>
            <button type="button" class="local-layer-primary-tab" data-nav-page-target="layer-structure" aria-pressed="false">Layer structure</button>
            <button type="button" class="local-layer-primary-tab" data-nav-page-target="palettes" aria-pressed="false">Palettes</button>
            <a class="local-layer-primary-tab" href="/local-spa/palette.html">Palette (Detailed)</a>
            <button type="button" class="local-layer-primary-tab" data-nav-page-target="evaluation-lab" aria-pressed="false">Evaluation Lab</button>
          </div>
        </section>

        <section class="local-layer-tab-content" data-nav-page="layering-mode">
          <section class="local-layer-sandbox local-layer-sandbox-standard" aria-label="Layering mode page">
            <h2 class="local-layer-model-title">Layering mode</h2>
            <p class="local-layer-model-copy">Single container view that updates between current SKY UX, experimental, and strict slate-only OKLCH and CIELAB behavior.</p>
            ${buildLayerStack('layering')}
          </section>
        </section>

        <section class="local-layer-tab-content" data-nav-page="layer-structure" hidden>
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

        <section class="local-layer-tab-content" data-nav-page="palettes" hidden>
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
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#0d1118;"></span><span>1200</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#11161e;"></span><span>1150</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#141b26;"></span><span>1100</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#171e2b;"></span><span>1050</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#1a2231;"></span><span>1000</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#1d2738;"></span><span>950</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#212c3f;"></span><span>900</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#2a384f;"></span><span>850</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#32435e;"></span><span>800</span></div>
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
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#101317;"></span><span>1200</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#14181d;"></span><span>1150</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#161a1f;"></span><span>1100</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#1a1e24;"></span><span>1050</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#1e2229;"></span><span>1000</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#21262e;"></span><span>950</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#252b33;"></span><span>900</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#30363d;"></span><span>850</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:#3b4047;"></span><span>800</span></div>
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
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(12.54% 23.29 283.28);"></span><span>1000</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(17.93% 29.24 283.76);"></span><span>900</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(27.96% 41.57 285.74);"></span><span>800</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(37.66% 51.90 285.82);"></span><span>700</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(46.75% 62.88 286.66);"></span><span>600</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(57.12% 48.79 279.83);"></span><span>500</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(67.70% 36.46 275.80);"></span><span>400</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(73.20% 29.92 274.13);"></span><span>350</span></div>
                      <div class="local-palette-stack-row"><span class="local-palette-chip" style="background:lch(78.58% 23.67 271.49);"></span><span>300</span></div>
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

        <section class="local-layer-tab-content" data-nav-page="evaluation-lab" hidden>
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
      </main>`;

    const navPageButtons = app.querySelectorAll<HTMLButtonElement>('[data-nav-page-target]');
    const navPagePanels = app.querySelectorAll<HTMLElement>('[data-nav-page]');
    const layeringChildButtons = app.querySelectorAll<HTMLButtonElement>('[data-layering-child-target]');
    const evalThemeButtons = app.querySelectorAll<HTMLButtonElement>('[data-eval-theme-target]');
    const evalModelButtons = app.querySelectorAll<HTMLButtonElement>('[data-eval-model-target]');

    const setLayeringMode = (
      mode: 'current' | 'experimental' | 'oklch-slate' | 'cielab-slate',
    ): void => {
      document.body.dataset.layering = mode;

      layeringChildButtons.forEach((button) => {
        const isActive = button.dataset.layeringChildTarget === mode;

        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });
    };

    const setNavPage = (
      page: 'layering-mode' | 'layer-structure' | 'palettes' | 'evaluation-lab',
    ): void => {
      navPagePanels.forEach((panel) => {
        panel.hidden = panel.dataset.navPage !== page;
      });

      navPageButtons.forEach((button) => {
        const isActive = button.dataset.navPageTarget === page;

        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });
    };

    const setLayeringChild = (
      child: 'current' | 'experimental' | 'oklch-slate' | 'cielab-slate',
    ): void => {
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
    };

    const setEvalModel = (model: 'current' | 'cielab' | 'oklch'): void => {
      document.body.dataset.evalModel = model;

      evalModelButtons.forEach((button) => {
        const isActive = button.dataset.evalModelTarget === model;

        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });
    };

    navPageButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const target = button.dataset.navPageTarget;
        const page =
          target === 'layer-structure'
            ? 'layer-structure'
            : target === 'palettes'
              ? 'palettes'
              : target === 'evaluation-lab'
                ? 'evaluation-lab'
              : 'layering-mode';

        setNavPage(page);
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

    setNavPage('layering-mode');
    setLayeringChild(initialLayeringMode);
    setEvalTheme(initialEvalTheme);
    setEvalModel(initialEvalModel);
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
