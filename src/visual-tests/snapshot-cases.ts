import { BRAND_CHECK_PAGE_KEY } from './brand-check';
import { LOCAL_BRANDS, MODES } from './settings';

export interface SnapshotCase {
  name: string;
  query: string;
}

/**
 * The default theme ignores mode, brand, and spacing, so it is snapshotted
 * once. Spacing stays at `standard` because the built CSS has no compact
 * spacing overrides, which would make compact snapshots duplicates.
 */
const THEME_VARIANTS: Record<string, string>[] = [
  { theme: 'default' },
  ...MODES.flatMap((mode) =>
    LOCAL_BRANDS.map((brand) => ({ theme: 'modern', mode, brand })),
  ),
];

const BRAND_CHECK_VARIANTS: Record<string, string>[] = [
  { theme: 'modern', mode: 'light', brand: 'blackbaud' },
  { theme: 'modern', mode: 'light', brand: 'jg' },
];

export function getSnapshotCases(pageKeys: string[]): SnapshotCase[] {
  return [
    ...pageKeys.flatMap((page) =>
      THEME_VARIANTS.map((variant) => toCase(page, variant)),
    ),
    ...BRAND_CHECK_VARIANTS.map((variant) =>
      toCase(BRAND_CHECK_PAGE_KEY, variant),
    ),
  ];
}

function toCase(page: string, variant: Record<string, string>): SnapshotCase {
  return {
    name: `${page} - ${Object.values(variant).join(' ')}`,
    query: new URLSearchParams({ page, ...variant }).toString(),
  };
}
