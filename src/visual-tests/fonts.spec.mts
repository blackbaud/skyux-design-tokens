import { describe, expect, test } from 'vitest';

import { getFontFaceSources } from './fonts';

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
