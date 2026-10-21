import type {
  PublicApiStyles,
  PublicApiTokens,
} from '@blackbaud/skyux-branding-builder';

import { FONT_FAMILY, getFontFaceSources, type FontTokens } from './fonts';
import { getPages } from './items';
import { renderControls, renderPage } from './render';
import { getThemeClasses, parseSettings } from './settings';

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

  app.append(
    renderControls(
      settings,
      pages.map((page) => page.key),
    ),
    ...pages
      .filter((page) => !settings.page || page.key === settings.page)
      .map(renderPage),
  );
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
  await Promise.all(
    getFontFaceSources(tokens).map(async ({ url, weight, style }) => {
      const face = new FontFace(FONT_FAMILY, `url(${url}) format('woff')`, {
        weight,
        style,
      });
      document.fonts.add(face);
      await face.load();
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
