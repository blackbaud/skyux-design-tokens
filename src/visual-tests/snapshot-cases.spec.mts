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
    ]);
  });

  test('gives every page its own uniquely named cases', () => {
    const names = getSnapshotCases(['borders', 'colors']).map(
      ({ name }) => name,
    );

    expect(names).toHaveLength(10);
    expect(new Set(names).size).toBe(10);
  });

  test('returns nothing when there are no pages', () => {
    expect(getSnapshotCases([])).toEqual([]);
  });
});
