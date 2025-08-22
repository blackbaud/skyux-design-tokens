import { describe, expect, it, vi } from 'vitest';
import { buildStyleDictionaryPlugin } from '@blackbaud/skyux-branding-builder';
import { tokenConfig } from '../src/tokens/token-config.mts';

vi.stubEnv('PACKAGEJSON_VERSION', undefined);

describe('build styles', () => {
  it('should generate the correct base, blackbaud, and modern styles', async () => {
    const plugin = buildStyleDictionaryPlugin(tokenConfig);
    const emitFileSpy = vi.fn();
    if (plugin.generateBundle) {
      await plugin.generateBundle.call({
        emitFile: emitFileSpy,
      });
    }

    const modernResults = emitFileSpy.mock.calls.find(
      (call) => call[0]?.fileName === 'assets/scss/modern.css',
    )?.[0];
    const baseResults = emitFileSpy.mock.calls.find(
      (call) => call[0]?.fileName === 'assets/scss/base.css',
    )?.[0];
    const blackbaudResults = emitFileSpy.mock.calls.find(
      (call) => call[0]?.fileName === 'assets/scss/blackbaud.css',
    )?.[0];

    expect(modernResults?.source).toMatchSnapshot();
    expect(baseResults?.source).toMatchSnapshot();
    expect(blackbaudResults?.source).toMatchSnapshot();
  });
});
