import { tokenConfig } from './token-config.mts';
import { expect, test } from 'vitest';

test('should have token sets in the correct format', () => {
  const tokenSets = tokenConfig.tokenSets;

  expect(tokenSets[0].name).toEqual('base');
  expect(tokenSets[0].selector).toEqual(
    '.sky-theme-modern.sky-theme-brand-base',
  );
  expect(tokenSets[0].path).toEqual('base-blackbaud.json');
  expect({
    name: 'base-light',
    path: 'color/base-light.json',
  }).toBeOneOf(tokenSets[0].referenceTokens);
  expect({
    name: 'base-dark',
    selector: '.sky-theme-mode-dark',
    path: 'color/base-dark.json',
  }).toBeOneOf(tokenSets[0].referenceTokens);
  expect({
    name: 'base-productive',
    path: 'layout/base-productive.json',
  }).toBeOneOf(tokenSets[0].referenceTokens);

  expect(tokenSets[1].name).toEqual('blackbaud');
  expect(tokenSets[1].selector).toEqual(
    '.sky-theme-modern.sky-theme-brand-base.sky-theme-brand-blackbaud',
  );
  expect(tokenSets[1].path).toEqual('base-blackbaud.json');
  expect({
    name: 'bb-light',
    path: 'color/bb-light.json',
  }).toBeOneOf(tokenSets[1].referenceTokens);
  expect({
    name: 'bb-dark',
    selector: '.sky-theme-mode-dark',
    path: 'color/bb-dark.json',
  }).toBeOneOf(tokenSets[1].referenceTokens);
});
