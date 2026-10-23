import type {
  PublicApiStyles,
  PublicApiTokens,
} from '@blackbaud/skyux-branding-builder';

import {
  FONT_FAMILY,
  getFontFaceCss,
  getFontFaceSources,
  type FontTokens,
} from './fonts';
import { getPages } from './items';
import { renderControls, renderPage } from './render';
import { getThemeClasses, parseSettings, resolvePage } from './settings';

const STYLESHEET_URL = 'bundles/base_blackbaud_public-api.css';
const STYLES_URL = 'bundles/public-api-styles.json';
const TOKENS_URL = 'bundles/public-api-tokens.json';
const DESIGN_TOKENS_URL = 'json/design-tokens.json';

async function main(): Promise<void> {
  const settings = parseSettings(new URLSearchParams(location.search));
  document.body.classList.add(...getThemeClasses(settings));

  const [styles, tokens] = await Promise.all([
    fetchJson<PublicApiStyles>(STYLES_URL),
    fetchJson<PublicApiTokens>(TOKENS_URL),
    loadStylesheet(STYLESHEET_URL),
    fetchJson<FontTokens>(DESIGN_TOKENS_URL).then(loadFonts),
  ]);

  const pages = getPages(styles, tokens);
  const app = document.getElementById('app');
  if (!app) {
    throw new Error('Missing #app element.');
  }

  const pageKeys = pages.map((page) => page.key);
  const selectedPage = resolvePage(settings.page, pageKeys);

  app.append(
    renderControls({ ...settings, page: selectedPage }, pageKeys),
    ...pages
      .filter((page) => !selectedPage || page.key === selectedPage)
      .map(renderPage),
  );

  document.body.dataset['ready'] = 'true';
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Could not load ${url} (${String(response.status)}). Run \`npm run build\` first.`,
    );
  }
  return (await response.json()) as T;
}

async function loadFonts(tokens: FontTokens): Promise<void> {
  const sources = getFontFaceSources(tokens);

  const fontFaceStyle = document.createElement('style');
  fontFaceStyle.textContent = getFontFaceCss(sources);
  document.head.append(fontFaceStyle);

  await Promise.all(
    sources.map(async ({ url, weight, style }) => {
      let faces: FontFace[] = [];
      try {
        faces = await document.fonts.load(
          `${style} ${weight} 1em "${FONT_FAMILY}"`,
        );
      } catch {
        // A face that fails to download rejects; handled with the empty case below.
      }
      if (!faces.length || faces.some((face) => face.status !== 'loaded')) {
        throw new Error(`Could not load the ${FONT_FAMILY} font from ${url}.`);
      }
    }),
  );
}

function loadStylesheet(href: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = () => {
      resolve();
    };
    link.onerror = () => {
      reject(new Error(`Could not load ${href}. Run \`npm run build\` first.`));
    };
    document.head.append(link);
  });
}

main().catch((error: unknown) => {
  document.body.textContent = String(error);
  throw error;
});
