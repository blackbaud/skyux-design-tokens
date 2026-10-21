export const THEMES = ['default', 'modern'] as const;
export const MODES = ['light', 'dark'] as const;
export const BRANDS = ['base', 'blackbaud'] as const;
export const SPACINGS = ['standard', 'compact'] as const;

export interface VisualTestSettings {
  page: string | undefined;
  theme: (typeof THEMES)[number];
  mode: (typeof MODES)[number];
  brand: (typeof BRANDS)[number];
  spacing: (typeof SPACINGS)[number];
}

export function parseSettings(params: URLSearchParams): VisualTestSettings {
  return {
    page: params.get('page')?.toLowerCase() || undefined,
    theme: pick(params.get('theme'), THEMES),
    mode: pick(params.get('mode'), MODES),
    brand: pick(params.get('brand'), BRANDS),
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
