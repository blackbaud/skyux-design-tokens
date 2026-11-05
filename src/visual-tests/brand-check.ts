import type { DemoMetadata, StyleApiItem, VisualTestPage } from './items';

export const BRAND_CHECK_PAGE_KEY = 'brand-check';

type BrandCheckType =
  | 'font-family'
  | 'font-size'
  | 'text-color'
  | 'color-swatch'
  | 'border-color'
  | 'border-width'
  | 'spacing'
  | 'image';

interface BrandCheckToken {
  customProperty: string;
  type: BrandCheckType;
}

/** JustGiving values differ from base, so base leaks show. */
const TOKENS: BrandCheckToken[] = [
  { customProperty: '--sky-font-family-primary', type: 'font-family' },
  { customProperty: '--sky-font-size-heading-1', type: 'font-size' },
  { customProperty: '--sky-font-size-body-m', type: 'font-size' },
  { customProperty: '--sky-color-text-heading', type: 'text-color' },
  { customProperty: '--sky-color-text-default', type: 'text-color' },
  { customProperty: '--sky-color-text-action', type: 'text-color' },
  { customProperty: '--sky-color-background-page', type: 'color-swatch' },
  {
    customProperty: '--sky-color-background-action-primary-base',
    type: 'color-swatch',
  },
  { customProperty: '--sky-color-border-input-base', type: 'border-color' },
  { customProperty: '--sky-border-width-accent', type: 'border-width' },
  { customProperty: '--sky-border-width-input-focus', type: 'border-width' },
  { customProperty: '--sky-space-gap-action_group-m', type: 'spacing' },
  { customProperty: '--sky-space-gap-form-l', type: 'spacing' },
  { customProperty: '--sky-space-gap-label-m', type: 'spacing' },
  { customProperty: '--sky-image-logo-primary-src', type: 'image' },
  { customProperty: '--sky-image-select_icon-base', type: 'image' },
];

export function getBrandCheckPage(): VisualTestPage {
  return {
    key: BRAND_CHECK_PAGE_KEY,
    name: 'Brand check',
    classes: [],
    tokens: TOKENS.map(({ customProperty, type }) => ({
      name: customProperty,
      itemType: 'tokens',
      codeValue: `var(${customProperty})`,
      selectors: [],
      customProperty,
      ...getDemoFields(type),
    })),
  };
}

function getDemoFields(
  type: BrandCheckType,
): Pick<StyleApiItem, 'cssProperty' | 'demoMetadata'> {
  switch (type) {
    case 'font-family':
    case 'font-size':
      return { cssProperty: type, demoMetadata: { type: 'text' } };
    case 'spacing':
    case 'image':
      return {};
    default:
      return { demoMetadata: { type } satisfies DemoMetadata };
  }
}
