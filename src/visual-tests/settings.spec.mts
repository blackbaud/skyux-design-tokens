import { describe, expect, test } from 'vitest';

import {
  getBrandStylesheetUrl,
  getThemeClasses,
  parseSettings,
  resolvePage,
} from './settings';

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

  test("falls back to a brand's first supported mode", () => {
    expect(
      parseSettings(new URLSearchParams('theme=modern&mode=dark&brand=jg'))
        .mode,
    ).toBe('light');
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

  test('adds the brand class and limits a brand to its supported modes', () => {
    expect(
      getThemeClasses(
        parseSettings(new URLSearchParams('theme=modern&mode=dark&brand=jg')),
      ),
    ).toEqual([
      'sky-theme-modern',
      'sky-theme-brand-base',
      'sky-theme-mode-light',
      'sky-theme-brand-jg',
    ]);
  });
});

describe('getBrandStylesheetUrl', () => {
  test('returns a stylesheet for a modern external brand', () => {
    expect(
      getBrandStylesheetUrl(
        parseSettings(new URLSearchParams('theme=modern&brand=jg')),
      ),
    ).toBeDefined();
  });

  test('returns nothing for built-in brands and the default theme', () => {
    expect(
      getBrandStylesheetUrl(
        parseSettings(new URLSearchParams('theme=modern&brand=blackbaud')),
      ),
    ).toBeUndefined();
    expect(
      getBrandStylesheetUrl(parseSettings(new URLSearchParams('brand=jg'))),
    ).toBeUndefined();
  });
});

describe('resolvePage', () => {
  test('keeps a known page', () => {
    expect(resolvePage('colors', ['colors', 'spacing'])).toBe('colors');
  });

  test('falls back to every page for an unknown page', () => {
    expect(resolvePage('color', ['colors', 'spacing'])).toBeUndefined();
  });
});
