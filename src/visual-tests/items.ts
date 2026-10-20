import type {
  PublicApiStyle,
  PublicApiStyleGroup,
  PublicApiStyles,
  PublicApiToken,
  PublicApiTokenGroup,
  PublicApiTokens,
} from '@blackbaud/skyux-branding-builder';

/** Not exported by the builder. */
export type DemoMetadata = NonNullable<PublicApiStyle['demoMetadata']>;

export interface MultiPropRow {
  cssProperty: string;
  codeValue: string;
}

/**
 * A class or custom property flattened from the public API JSON, with the
 * values the demo needs. Mirrors the item the docs SPA builds for its demos.
 */
export interface StyleApiItem {
  name: string;
  itemType: 'classes' | 'tokens';
  /** The class name for classes, or `var(--custom-property)` for tokens. */
  codeValue: string;
  selectors: string[];
  customProperty?: string;
  cssProperty?: string;
  properties?: Record<string, string>;
  demoMetadata?: DemoMetadata;
  multiPropRows?: MultiPropRow[];
}

export interface VisualTestPage {
  /** The lowercase page key used in the `page` query param, e.g. `colors`. */
  key: string;
  name: string;
  classes: StyleApiItem[];
  tokens: StyleApiItem[];
}

/**
 * Builds one page per top-level group (Borders, Colors, etc.) found in either
 * JSON file, in the order the styles JSON lists them.
 */
export function getPages(
  styles: PublicApiStyles,
  tokens: PublicApiTokens,
): VisualTestPage[] {
  const pages = new Map<string, VisualTestPage>();

  const getPage = (name: string): VisualTestPage => {
    const key = name.toLowerCase();
    let page = pages.get(key);
    if (!page) {
      page = { key, name, classes: [], tokens: [] };
      pages.set(key, page);
    }
    return page;
  };

  for (const group of styles.groups ?? []) {
    getPage(group.name).classes.push(...getStyleItems(group));
  }

  for (const group of tokens.groups ?? []) {
    getPage(group.groupName).tokens.push(...getTokenItems(group));
  }

  return [...pages.values()];
}

export function getStyleItems(group: PublicApiStyleGroup): StyleApiItem[] {
  return [
    ...(group.styles ?? []).filter(isStyleVisible).map(normalizeStyle),
    ...(group.groups ?? []).flatMap(getStyleItems),
  ];
}

export function getTokenItems(group: PublicApiTokenGroup): StyleApiItem[] {
  const items = isMultiPropGroup(group)
    ? [buildMultiPropItem(group)]
    : (group.tokens ?? []).filter(isTokenVisible).map(normalizeToken);

  return [...items, ...(group.groups ?? []).flatMap(getTokenItems)];
}

/**
 * Deprecated and obsolete names aren't defined in this repo's CSS, so only
 * items with a current class name, selector, or custom property are tested.
 */
function isStyleVisible(style: PublicApiStyle): boolean {
  return (
    !style.excludeFromDocs && (!!style.className || !!style.selectors?.length)
  );
}

function isTokenVisible(token: PublicApiToken): boolean {
  return !!token.customProperty;
}

/**
 * True when the group's tokens should render as a single combined demo rather
 * than individual items.
 */
function isMultiPropGroup(group: PublicApiTokenGroup): boolean {
  return (
    !!group.tokens?.length && group.demoMetadata?.renderAs === 'multi-prop'
  );
}

function buildMultiPropItem(group: PublicApiTokenGroup): StyleApiItem {
  return {
    name: group.groupName,
    itemType: 'tokens',
    codeValue: '',
    selectors: [],
    demoMetadata: group.demoMetadata,
    multiPropRows: (group.tokens ?? []).flatMap((token) =>
      token.cssProperty && token.customProperty
        ? [
            {
              cssProperty: token.cssProperty,
              codeValue: `var(${token.customProperty})`,
            },
          ]
        : [],
    ),
  };
}

function normalizeStyle(style: PublicApiStyle): StyleApiItem {
  return {
    name: style.name,
    itemType: 'classes',
    codeValue: style.className ?? '',
    selectors: style.selectors ?? [],
    properties: style.properties,
    demoMetadata: style.demoMetadata,
  };
}

function normalizeToken(token: PublicApiToken): StyleApiItem {
  return {
    name: token.name,
    itemType: 'tokens',
    codeValue: token.customProperty ? `var(${token.customProperty})` : '',
    selectors: [],
    customProperty: token.customProperty,
    cssProperty: token.cssProperty,
    demoMetadata: token.demoMetadata,
  };
}
