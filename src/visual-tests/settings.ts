export const THEMES = ['default', 'modern'] as const;
export const MODES = ['light', 'dark'] as const;
export const BRANDS = ['base', 'blackbaud'] as const;
export const SPACINGS = ['standard', 'compact'] as const;

export interface VisualTestSettings {
  /** The page key to show, or `undefined` to show every page. */
  page: string | undefined;
  theme: (typeof THEMES)[number];
  mode: (typeof MODES)[number];
  brand: (typeof BRANDS)[number];
  spacing: (typeof SPACINGS)[number];
}

/**
 * Reads settings from query params, e.g.
 * `?page=colors&theme=modern&mode=dark&brand=blackbaud&spacing=compact`.
 * Missing or unknown values fall back to the first option.
 */
export function parseSettings(params: URLSearchParams): VisualTestSettings {
  return {
    page: params.get('page')?.toLowerCase() || undefined,
    theme: pick(params.get('theme'), THEMES),
    mode: pick(params.get('mode'), MODES),
    brand: pick(params.get('brand'), BRANDS),
    spacing: pick(params.get('spacing'), SPACINGS),
  };
}

/**
 * The body classes the built CSS is scoped to. The default theme is defined on
 * `:root`, so mode, brand, and spacing only apply to the modern theme.
 */
export function getThemeClasses(settings: VisualTestSettings): string[] {
  if (settings.theme === 'default') {
    return ['sky-theme-default'];
  }

  const classes = [
    'sky-theme-modern',
    'sky-theme-brand-base',
    `sky-theme-mode-${settings.mode}`,
  ];

  if (settings.brand === 'blackbaud') {
    classes.push('sky-theme-brand-blackbaud');
  }

  if (settings.spacing === 'compact') {
    classes.push('sky-theme-spacing-compact');
  }

  return classes;
}

function pick<T extends string>(
  value: string | null,
  options: readonly T[],
): T {
  return options.find((option) => option === value) ?? options[0];
}
