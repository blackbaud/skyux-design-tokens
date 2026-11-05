import { describe, expect, test } from 'vitest';

import { getBrandCheckPage } from './brand-check';
import { describeDemo } from './demo';

describe('getBrandCheckPage', () => {
  test('renders a demo for every pick', () => {
    const page = getBrandCheckPage();

    expect(page.key).toBe('brand-check');
    expect(page.tokens.length).toBeGreaterThan(0);
    expect(page.tokens.filter((item) => !describeDemo(item))).toEqual([]);
  });
});
