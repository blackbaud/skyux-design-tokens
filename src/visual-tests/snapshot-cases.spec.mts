import { describe, expect, test } from 'vitest';

import { parseSettings } from './settings';
import { getSnapshotCases } from './snapshot-cases';

describe('getSnapshotCases', () => {
  test('snapshots the default theme once and each modern mode and brand', () => {
    expect(getSnapshotCases(['colors']).map(({ name }) => name)).toEqual([
      'colors - default',
      'colors - modern light base',
      'colors - modern light blackbaud',
      'colors - modern dark base',
      'colors - modern dark blackbaud',
      'brand-check - modern light blackbaud',
      'brand-check - modern light jg',
    ]);
  });

  test('builds queries that select the named page and theme', () => {
    expect(
      getSnapshotCases(['colors']).map(({ query }) =>
        parseSettings(new URLSearchParams(query)),
      ),
    ).toEqual([
      {
        page: 'colors',
        theme: 'default',
        mode: 'light',
        brand: 'base',
        spacing: 'standard',
      },
      {
        page: 'colors',
        theme: 'modern',
        mode: 'light',
        brand: 'base',
        spacing: 'standard',
      },
      {
        page: 'colors',
        theme: 'modern',
        mode: 'light',
        brand: 'blackbaud',
        spacing: 'standard',
      },
      {
        page: 'colors',
        theme: 'modern',
        mode: 'dark',
        brand: 'base',
        spacing: 'standard',
      },
      {
        page: 'colors',
        theme: 'modern',
        mode: 'dark',
        brand: 'blackbaud',
        spacing: 'standard',
      },
      {
        page: 'brand-check',
        theme: 'modern',
        mode: 'light',
        brand: 'blackbaud',
        spacing: 'standard',
      },
      {
        page: 'brand-check',
        theme: 'modern',
        mode: 'light',
        brand: 'jg',
        spacing: 'standard',
      },
    ]);
  });

  test('gives every page its own uniquely named cases', () => {
    const names = getSnapshotCases(['borders', 'colors']).map(
      ({ name }) => name,
    );

    expect(names).toHaveLength(12);
    expect(new Set(names).size).toBe(12);
  });

  test('still snapshots the brand check when there are no other pages', () => {
    expect(getSnapshotCases([]).map(({ name }) => name)).toEqual([
      'brand-check - modern light blackbaud',
      'brand-check - modern light jg',
    ]);
  });
});
