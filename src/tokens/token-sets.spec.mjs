import { tokenSets } from './token-sets.mjs';
import { expect, test } from 'vitest';

test('should have token sets in the correct format', () => {
  expect(tokenSets[0].name).toEqual('modern');
  expect(tokenSets[0].selector).toEqual('.sky-theme-modern');
  expect(tokenSets[0].path).toEqual('base-modern.json');
  expect(tokenSets[0].outputPath).toEqual('modern.css');
  expect({
    name: 'modern-colors',
    path: 'color/modern.json',
  }).toBeOneOf(tokenSets[0].referenceTokens);
  expect({
    name: 'modern-layout',
    path: 'layout/modern.json',
  }).toBeOneOf(tokenSets[0].referenceTokens);
  expect(tokenSets[1].name).toEqual('blackbaud');
  expect(tokenSets[1].selector).toEqual(
    '.sky-theme-modern.sky-theme-brand-base',
  );
  expect(tokenSets[1].path).toEqual('base-blackbaud.json');
  expect(tokenSets[1].outputPath).toEqual('blackbaud.css');
  expect({
    name: 'bb-light',
    path: 'color/bb-light.json',
  }).toBeOneOf(tokenSets[1].referenceTokens);
  expect({
    name: 'bb-dark',
    selector: '.sky-theme-mode-dark',
    path: 'color/bb-dark.json',
  }).toBeOneOf(tokenSets[1].referenceTokens);
  expect({
    name: 'bb-productive',
    path: 'layout/bb-productive.json',
  }).toBeOneOf(tokenSets[1].referenceTokens);
  expect({
    name: 'bb-compact',
    selector: '.sky-theme-mode-compact',
    path: 'layout/bb-compact.json',
  }).toBeOneOf(tokenSets[1].referenceTokens);
});
