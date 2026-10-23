import { BRANDS, MODES } from './settings';

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
    BRANDS.map((brand) => ({ theme: 'modern', mode, brand })),
  ),
];

export function getSnapshotCases(pageKeys: string[]): SnapshotCase[] {
  return pageKeys.flatMap((page) =>
    THEME_VARIANTS.map((variant) => ({
      name: `${page} - ${Object.values(variant).join(' ')}`,
      query: new URLSearchParams({ page, ...variant }).toString(),
    })),
  );
}
