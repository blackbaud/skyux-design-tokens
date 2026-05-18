document.body.classList.add(
  'local-dev-tokens',
  'sky-theme-modern',
  'sky-theme-brand-base',
  'sky-theme-brand-blackbaud',
  'sky-theme-mode-dark',
);

document.body.classList.remove('sky-theme-default');

const urlParams = new URLSearchParams(window.location.search);
const showPalettePreview = urlParams.get('local-preview') === 'palette';

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
