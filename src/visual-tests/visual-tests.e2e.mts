import type {
  PublicApiStyles,
  PublicApiTokens,
} from '@blackbaud/skyux-branding-builder';
import percySnapshot from '@percy/playwright';
import { expect, test } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { getPages } from './items';
import { getSnapshotCases } from './snapshot-cases';

const BUNDLES_DIR = path.resolve(import.meta.dirname, '../../dist/bundles');
const SCREENSHOT_DIR = path.resolve(
  import.meta.dirname,
  '../../test-results/screenshots',
);

mkdirSync(SCREENSHOT_DIR, { recursive: true });

function readBundle(fileName: string): unknown {
  try {
    return JSON.parse(readFileSync(path.join(BUNDLES_DIR, fileName), 'utf8'));
  } catch (error) {
    throw new Error(
      `Could not read dist/bundles/${fileName}. Run \`npm run build\` first. ${String(error)}`,
    );
  }
}

const pageKeys = getPages(
  readBundle('public-api-styles.json') as PublicApiStyles,
  readBundle('public-api-tokens.json') as PublicApiTokens,
).map((page) => page.key);

for (const { name, query } of getSnapshotCases(pageKeys)) {
  test(name, async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    await page.goto(`./?${query}`);

    // Reports any page error in place of the ready flag so failures show why.
    await expect
      .poll(
        async () =>
          pageErrors.join('\n') ||
          (await page.locator('body').getAttribute('data-ready')),
        { message: 'The page did not finish rendering.', timeout: 30_000 },
      )
      .toBe('true');
    await expect(page.locator('.vt-tile').first()).toBeVisible();

    const fileName = `${name.replace(/[^a-z0-9]+/gi, '-')}.png`;
    const filePath = path.join(SCREENSHOT_DIR, fileName);
    await page.screenshot({
      fullPage: true,
      path: filePath,
      style: `.vt-controls { visibility: hidden !important; }`,
      type: 'png',
    });
    await percySnapshot(page, name);
  });
}
