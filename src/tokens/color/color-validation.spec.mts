import { expect, test } from 'vitest';

import baseDark from './base-dark.json';
import baseLight from './base-light.json';

/**
 * A token node is a leaf once it has a "$value" property. Everything else is
 * a nested group to recurse into.
 */
function isTokenNode(value: unknown): value is { $value: unknown } {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.prototype.hasOwnProperty.call(value, '$value')
  );
}

/**
 * Flattens a token tree into a list of dot-delimited token paths, e.g.
 * `color.text.default`, so token sets can be diffed by name alone.
 */
function getTokenPaths(
  tokens: Record<string, unknown>,
  prefix: string[] = [],
): string[] {
  return Object.entries(tokens).flatMap(([key, value]) => {
    const path = [...prefix, key];

    if (isTokenNode(value)) {
      return [path.join('.')];
    }

    return getTokenPaths(value as Record<string, unknown>, path);
  });
}

/** Returns the token paths present in `sourcePaths` but absent from `targetPaths`. */
function getMissingTokenPaths(
  sourcePaths: string[],
  targetPaths: string[],
): string[] {
  const targetSet = new Set(targetPaths);

  return sourcePaths.filter((tokenPath) => !targetSet.has(tokenPath));
}

function formatMissingTokensMessage(
  missingTokenPaths: string[],
  sourceFile: string,
  targetFile: string,
): string {
  return `The following tokens are defined in ${sourceFile} but missing from ${targetFile}:\n${missingTokenPaths
    .map((tokenPath) => `  - ${tokenPath}`)
    .join('\n')}`;
}

test('should have the same "base" reference tokens for light and dark modes', () => {
  const lightTokenPaths = getTokenPaths(baseLight);
  const darkTokenPaths = getTokenPaths(baseDark);

  const missingFromDark = getMissingTokenPaths(lightTokenPaths, darkTokenPaths);
  const missingFromLight = getMissingTokenPaths(darkTokenPaths, lightTokenPaths);

  const failureMessages = [
    missingFromDark.length > 0 &&
      formatMissingTokensMessage(
        missingFromDark,
        'base-light.json',
        'base-dark.json',
      ),
    missingFromLight.length > 0 &&
      formatMissingTokensMessage(
        missingFromLight,
        'base-dark.json',
        'base-light.json',
      ),
  ].filter((message) => typeof message === 'string');

  expect(failureMessages, failureMessages.join('\n\n')).toEqual([]);
});
