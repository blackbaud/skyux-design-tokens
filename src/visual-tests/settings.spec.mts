import { describe, expect, test } from 'vitest';

import { getThemeClasses, parseSettings } from './settings';

describe('parseSettings', () => {
  test('defaults to every page in the default theme', () => {
    expect(parseSettings(new URLSearchParams())).toEqual({
      page: undefined,
      theme: 'default',
      mode: 'light',
      brand: 'base',
      spacing: 'standard',
    });
  });

  test('reads known values and ignores unknown ones', () => {
    expect(
      parseSettings(
        new URLSearchParams(
          'page=Colors&theme=modern&mode=dark&brand=blackbaud&spacing=huge',
        ),
      ),
    ).toEqual({
      page: 'colors',
      theme: 'modern',
      mode: 'dark',
      brand: 'blackbaud',
      spacing: 'standard',
    });
  });
});

describe('getThemeClasses', () => {
  test('ignores modern-only settings for the default theme', () => {
    expect(
      getThemeClasses(
        parseSettings(new URLSearchParams('mode=dark&brand=blackbaud')),
      ),
    ).toEqual(['sky-theme-default']);
  });

  test('adds mode, brand, and spacing classes for the modern theme', () => {
    expect(
      getThemeClasses(
        parseSettings(
          new URLSearchParams(
            'theme=modern&mode=dark&brand=blackbaud&spacing=compact',
          ),
        ),
      ),
    ).toEqual([
      'sky-theme-modern',
      'sky-theme-brand-base',
      'sky-theme-mode-dark',
      'sky-theme-brand-blackbaud',
      'sky-theme-spacing-compact',
    ]);
  });
});
