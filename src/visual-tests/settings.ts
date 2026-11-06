export const THEMES = ['default', 'modern'] as const;
export const MODES = ['light', 'dark'] as const;
export const BRANDS = ['base', 'blackbaud', 'jg'] as const;
export const SPACINGS = ['standard', 'compact'] as const;

type Brand = (typeof BRANDS)[number];
type Mode = (typeof MODES)[number];

const BRAND_STYLESHEET_URLS: Partial<Record<Brand, string>> = {
  jg: 'https://sky.blackbaudcdn.net/static/skyux-brand-jg/4/jg.css',
};

export const LOCAL_BRANDS = BRANDS.filter(
  (brand) => !BRAND_STYLESHEET_URLS[brand],
);

const BRAND_MODES: Partial<Record<Brand, readonly Mode[]>> = {
  jg: ['light'],
};

export interface VisualTestSettings {
  page: string | undefined;
  theme: (typeof THEMES)[number];
  mode: Mode;
  brand: Brand;
  spacing: (typeof SPACINGS)[number];
}

export function parseSettings(params: URLSearchParams): VisualTestSettings {
  const brand = pick(params.get('brand'), BRANDS);

  return {
    page: params.get('page')?.toLowerCase() || undefined,
    theme: pick(params.get('theme'), THEMES),
    mode: pick(params.get('mode'), BRAND_MODES[brand] ?? MODES),
    brand,
    spacing: pick(params.get('spacing'), SPACINGS),
  };
}

export function getThemeClasses(settings: VisualTestSettings): string[] {
  if (settings.theme === 'default') {
    return ['sky-theme-default'];
  }

  const classes = [
    'sky-theme-modern',
    'sky-theme-brand-base',
    `sky-theme-mode-${settings.mode}`,
  ];

  if (settings.brand !== 'base') {
    classes.push(`sky-theme-brand-${settings.brand}`);
  }

  if (settings.spacing === 'compact') {
    classes.push('sky-theme-spacing-compact');
  }

  return classes;
}

export function getBrandStylesheetUrl(
  settings: VisualTestSettings,
): string | undefined {
  return settings.theme === 'modern'
    ? BRAND_STYLESHEET_URLS[settings.brand]
    : undefined;
}

export function resolvePage(
  page: string | undefined,
  pageKeys: string[],
): string | undefined {
  return page && pageKeys.includes(page) ? page : undefined;
}

function pick<T extends string>(
  value: string | null,
  options: readonly T[],
): T {
  return options.find((option) => option === value) ?? options[0];
}
