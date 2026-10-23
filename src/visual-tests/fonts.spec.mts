import { describe, expect, test } from 'vitest';

import { getFontFaceCss, getFontFaceSources } from './fonts';

describe('getFontFaceSources', () => {
  test('lists each weight and the italic style, skipping nested groups', () => {
    expect(
      getFontFaceSources({
        text: {
          weight: {
            light: { file: 'light.woff', value: '300' },
            regular: { file: 'regular.woff', value: '400' },
            condensed: {
              light: { file: 'cond-light.woff', value: '300' },
            },
          },
          style: { italic: { file: 'italic.woff', value: 'italic' } },
        },
      }),
    ).toEqual([
      { url: 'light.woff', weight: '300', style: 'normal' },
      { url: 'regular.woff', weight: '400', style: 'normal' },
      { url: 'italic.woff', weight: '400', style: 'italic' },
    ]);
  });

  test('returns nothing when the tokens have no font files', () => {
    expect(getFontFaceSources({})).toEqual([]);
  });
});

describe('getFontFaceCss', () => {
  test('creates one @font-face rule per source', () => {
    expect(
      getFontFaceCss([
        { url: 'light.woff', weight: '300', style: 'normal' },
        { url: 'italic.woff', weight: '400', style: 'italic' },
      ]),
    ).toBe(
      [
        '@font-face { font-family: "BLKB Sans"; src: url("light.woff") format("woff"); font-weight: 300; font-style: normal; }',
        '@font-face { font-family: "BLKB Sans"; src: url("italic.woff") format("woff"); font-weight: 400; font-style: italic; }',
      ].join('\n'),
    );
  });

  test('returns an empty string when there are no sources', () => {
    expect(getFontFaceCss([])).toBe('');
  });
});
