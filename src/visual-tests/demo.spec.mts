import { describe, expect, test } from 'vitest';

import { describeDemo } from './demo';
import type { StyleApiItem } from './items';

function token(overrides: Partial<StyleApiItem>): StyleApiItem {
  const customProperty = overrides.customProperty ?? '--sky-theme-test';
  return {
    name: 'Test',
    itemType: 'tokens',
    codeValue: `var(${customProperty})`,
    selectors: [],
    customProperty,
    ...overrides,
  };
}

function cssClass(overrides: Partial<StyleApiItem>): StyleApiItem {
  return {
    name: 'Test',
    itemType: 'classes',
    codeValue: 'sky-theme-test',
    selectors: [],
    ...overrides,
  };
}

describe('describeDemo', () => {
  test('returns undefined when there is nothing to demo', () => {
    expect(describeDemo(token({}))).toBeUndefined();
    expect(
      describeDemo(cssClass({ demoMetadata: { type: 'none' } })),
    ).toBeUndefined();
  });

  test.each([
    ['color-swatch', 'background-color'],
    ['border', 'border-top'],
    ['border-color', 'border-top-color'],
    ['border-width', 'border-top-width'],
    ['border-style', 'border-top-style'],
    ['border-radius', 'border-radius'],
    ['elevation', 'box-shadow'],
    ['icon-color', 'color'],
    ['icon-background-color', 'background-color'],
  ] as const)('applies a %s token to %s', (type, property) => {
    const demo = describeDemo(token({ demoMetadata: { type } }));

    expect(demo?.classNames).toEqual(['vt-demo-box', `vt-demo-type-${type}`]);
    expect(demo?.style?.[property]).toBe('var(--sky-theme-test)');
  });

  test('applies metadata background and color', () => {
    const demo = describeDemo(
      token({
        demoMetadata: {
          type: 'icon-color',
          background: '--sky-theme-color-background-container-success',
        },
      }),
    );

    expect(demo).toEqual({
      tag: 'div',
      classNames: ['vt-demo-box', 'vt-demo-type-icon-color'],
      style: {
        'background-color':
          'var(--sky-theme-color-background-container-success)',
        color: 'var(--sky-theme-test)',
      },
      children: [{ tag: 'span', icon: true }],
    });
  });

  test('applies a class to the box, or to the text for text demos', () => {
    expect(
      describeDemo(cssClass({ demoMetadata: { type: 'color-swatch' } }))
        ?.classNames,
    ).toEqual(['vt-demo-box', 'vt-demo-type-color-swatch', 'sky-theme-test']);

    const textDemo = describeDemo(cssClass({ demoMetadata: { type: 'text' } }));
    expect(textDemo?.classNames).toEqual(['vt-demo-box', 'vt-demo-type-text']);
    expect(textDemo?.children).toEqual([
      {
        tag: 'span',
        classNames: ['vt-demo-text', 'sky-theme-test'],
        style: {},
        text: 'Bb',
      },
    ]);
  });

  test('applies a container class to the box and fills it with sample content', () => {
    const demo = describeDemo(
      cssClass({
        codeValue: 'sky-theme-container-danger',
        demoMetadata: { type: 'container' },
      }),
    );

    expect(demo?.classNames).toEqual([
      'vt-demo-box',
      'vt-demo-type-container',
      'sky-theme-container-danger',
    ]);
    expect(demo?.children?.map((child) => child.classNames)).toEqual([
      ['sky-theme-font-heading-4'],
      ['sky-theme-font-body-m'],
      ['sky-theme-font-body-deemphasized-m'],
      ['vt-demo-icon'],
      ['vt-demo-nested', 'sky-theme-container-default'],
    ]);
    expect(demo?.children?.[3]).toEqual({
      tag: 'span',
      classNames: ['vt-demo-icon'],
      icon: true,
    });
  });

  test('nests a backdrop container in the default container', () => {
    const demo = describeDemo(
      cssClass({
        codeValue: 'sky-theme-container-default',
        demoMetadata: { type: 'container' },
      }),
    );

    expect(demo?.children?.[4]?.classNames).toEqual([
      'vt-demo-nested',
      'sky-theme-container-backdrop',
    ]);
  });

  test('renders an element demo from the first selector', () => {
    const demo = describeDemo(
      cssClass({
        codeValue: '',
        selectors: ['strong'],
        demoMetadata: { type: 'text', renderAs: 'element', text: 'Strong' },
      }),
    );

    expect(demo?.children).toEqual([{ tag: 'strong', text: 'Strong' }]);
  });

  test('applies every multi-prop row to the box', () => {
    const demo = describeDemo(
      token({
        codeValue: '',
        demoMetadata: {
          type: 'text',
          renderAs: 'multi-prop',
          color: '--sky-theme-color-text-heading',
        },
        multiPropRows: [
          { cssProperty: 'font-size', codeValue: 'var(--size)' },
          { cssProperty: 'font-weight', codeValue: 'var(--weight)' },
        ],
      }),
    );

    expect(demo?.style).toEqual({
      color: 'var(--sky-theme-color-text-heading)',
      'font-size': 'var(--size)',
      'font-weight': 'var(--weight)',
    });
  });

  test('falls back to a text demo for tokens with a CSS property', () => {
    const demo = describeDemo(token({ cssProperty: 'font-family' }));

    expect(demo?.children?.[0]?.style).toEqual({
      'font-family': 'var(--sky-theme-test)',
    });
  });

  describe('spacing', () => {
    test.each([
      ['--sky-theme-space-stacked-m', 'vt-spacing-bar-stacked', 'height'],
      ['--sky-theme-space-inline-m', 'vt-spacing-bar-inline', 'width'],
      ['--sky-theme-space-conditional-input', 'vt-spacing-bar-inline', 'width'],
    ])('sizes a bar for %s', (customProperty, className, property) => {
      const demo = describeDemo(token({ customProperty }));

      expect(demo?.classNames).toEqual(['vt-spacing-bar', className]);
      expect(demo?.style).toEqual({ [property]: `var(${customProperty})` });
    });

    test('pads a frame for inset tokens', () => {
      const demo = describeDemo(
        token({ customProperty: '--sky-theme-space-inset-balanced-m' }),
      );

      expect(demo?.classNames).toEqual(['vt-spacing-frame']);
      expect(demo?.style).toEqual({
        padding: 'var(--sky-theme-space-inset-balanced-m)',
      });
    });

    test('applies padding classes to the frame', () => {
      const demo = describeDemo(
        cssClass({
          codeValue: 'sky-theme-padding-top-m',
          properties: { 'padding-top': 'var(--sky-theme-space-stacked-m)' },
        }),
      );

      expect(demo?.classNames).toEqual([
        'vt-spacing-frame',
        'sky-theme-padding-top-m',
      ]);
    });

    test('applies margin classes to the content inside a container', () => {
      const demo = describeDemo(
        cssClass({
          codeValue: 'sky-theme-margin-left-m',
          properties: { 'margin-left': 'var(--sky-theme-space-inline-m)' },
        }),
      );

      expect(demo).toEqual({
        tag: 'div',
        classNames: ['vt-spacing-container'],
        children: [
          {
            tag: 'div',
            classNames: ['vt-spacing-content', 'sky-theme-margin-left-m'],
          },
        ],
      });
    });

    test('ignores classes that mix spacing with other properties', () => {
      expect(
        describeDemo(
          cssClass({
            properties: { 'list-style': 'none', 'padding-left': '0' },
          }),
        ),
      ).toBeUndefined();
    });
  });
});
