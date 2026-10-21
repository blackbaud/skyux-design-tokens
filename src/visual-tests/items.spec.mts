import { describe, expect, test } from 'vitest';

import { getPages, getStyleItems, getTokenItems } from './items';

describe('getStyleItems', () => {
  test('flattens nested groups and skips items without a current class', () => {
    const items = getStyleItems({
      name: 'Spacing',
      styles: [
        {
          name: 'Margin-top XS',
          className: 'sky-theme-margin-top-xs',
          properties: { 'margin-top': 'var(--sky-theme-space-stacked-xs)' },
        },
        { name: 'Deprecated only', deprecatedClassNames: ['sky-old'] },
        { name: 'Excluded', className: 'sky-excluded', excludeFromDocs: true },
      ],
      groups: [
        {
          name: 'Paragraphs',
          styles: [{ name: 'Paragraph', selectors: ['p'] }],
        },
      ],
    });

    expect(items).toEqual([
      {
        name: 'Margin-top XS',
        itemType: 'classes',
        codeValue: 'sky-theme-margin-top-xs',
        selectors: [],
        properties: { 'margin-top': 'var(--sky-theme-space-stacked-xs)' },
        demoMetadata: undefined,
      },
      {
        name: 'Paragraph',
        itemType: 'classes',
        codeValue: '',
        selectors: ['p'],
        properties: undefined,
        demoMetadata: undefined,
      },
    ]);
  });
});

describe('getTokenItems', () => {
  test('wraps custom properties in var() and skips deprecated-only tokens', () => {
    const items = getTokenItems({
      groupName: 'Colors',
      tokens: [
        {
          name: 'Page',
          customProperty: '--sky-theme-color-background-page',
          demoMetadata: { type: 'color-swatch' },
        },
        {
          name: 'Old',
          deprecatedCustomProperties: ['--sky-background-color-old'],
        },
      ],
    });

    expect(items).toEqual([
      {
        name: 'Page',
        itemType: 'tokens',
        codeValue: 'var(--sky-theme-color-background-page)',
        selectors: [],
        customProperty: '--sky-theme-color-background-page',
        cssProperty: undefined,
        demoMetadata: { type: 'color-swatch' },
      },
    ]);
  });

  test('combines a multi-prop group into one item', () => {
    const demoMetadata = { type: 'text', renderAs: 'multi-prop' } as const;

    const items = getTokenItems({
      groupName: 'Heading 1',
      demoMetadata,
      tokens: [
        {
          name: 'Heading 1 size',
          customProperty: '--sky-theme-font-heading-1-size',
          cssProperty: 'font-size',
        },
        {
          name: 'Heading 1 weight',
          customProperty: '--sky-theme-font-heading-1-weight',
          cssProperty: 'font-weight',
        },
        { name: 'No CSS property', customProperty: '--sky-theme-other' },
      ],
    });

    expect(items).toEqual([
      {
        name: 'Heading 1',
        itemType: 'tokens',
        codeValue: '',
        selectors: [],
        demoMetadata,
        multiPropRows: [
          {
            cssProperty: 'font-size',
            codeValue: 'var(--sky-theme-font-heading-1-size)',
          },
          {
            cssProperty: 'font-weight',
            codeValue: 'var(--sky-theme-font-heading-1-weight)',
          },
        ],
      },
    ]);
  });
});

describe('getPages', () => {
  test('creates one page per top-level group from both files', () => {
    const pages = getPages(
      {
        groups: [
          { name: 'Borders', styles: [{ name: 'A', className: 'a' }] },
          { name: 'Colors', styles: [{ name: 'B', className: 'b' }] },
        ],
      },
      {
        groups: [
          {
            groupName: 'Colors',
            tokens: [{ name: 'C', customProperty: '--c' }],
          },
        ],
      },
    );

    expect(
      pages.map((p) => [p.key, p.classes.length, p.tokens.length]),
    ).toEqual([
      ['borders', 1, 0],
      ['colors', 1, 1],
    ]);
  });
});
