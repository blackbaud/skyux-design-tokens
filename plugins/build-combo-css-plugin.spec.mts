import type { Rollup } from 'vite';
import { describe, expect, it, vi } from 'vitest';
import { buildComboCssPlugin } from './build-combo-css-plugin.mts';

function createAsset(source: string): Rollup.OutputAsset {
  return {
    type: 'asset',
    source,
  } as Rollup.OutputAsset;
}

function createChunk(): Rollup.OutputChunk {
  return {
    type: 'chunk',
    code: '',
  } as Rollup.OutputChunk;
}

describe('build combo css plugin', () => {
  it('should concatenate the source assets in order and emit the combo file', async () => {
    const plugin = buildComboCssPlugin({
      fileName: 'bundles/combo.css',
      sourceFileNames: ['bundles/a.css', 'bundles/b.css', 'bundles/c.css'],
    });
    const emitFileSpy = vi.fn();
    const bundle: Rollup.OutputBundle = {
      'bundles/a.css': createAsset('.a {}\n'),
      'bundles/b.css': createAsset('.b {}\n'),
      'bundles/c.css': createAsset('.c {}\n'),
    };

    if (typeof plugin.generateBundle !== 'function') {
      throw new Error('Expected generateBundle to be a function');
    }
    await plugin.generateBundle.call(
      { emitFile: emitFileSpy } as unknown as Rollup.PluginContext,
      {} as Rollup.NormalizedOutputOptions,
      bundle,
      false,
    );

    expect(emitFileSpy).toHaveBeenCalledExactlyOnceWith({
      type: 'asset',
      fileName: 'bundles/combo.css',
      source: '.a {}\n\n.b {}\n\n.c {}\n',
    });
  });

  it('should throw when a source fileName is missing from the bundle', async () => {
    const plugin = buildComboCssPlugin({
      fileName: 'bundles/combo.css',
      sourceFileNames: ['bundles/a.css', 'bundles/missing.css'],
    });
    const bundle: Rollup.OutputBundle = {
      'bundles/a.css': createAsset('.a {}\n'),
    };

    const { generateBundle } = plugin;
    if (typeof generateBundle !== 'function') {
      throw new Error('Expected generateBundle to be a function');
    }

    expect(() =>
      generateBundle.call(
        { emitFile: vi.fn() } as unknown as Rollup.PluginContext,
        {} as Rollup.NormalizedOutputOptions,
        bundle,
        false,
      ),
    ).toThrow(
      'Cannot build combo file "bundles/combo.css": expected "bundles/missing.css" to already be emitted as a CSS asset.',
    );
  });

  it('should throw when a source fileName refers to a chunk instead of an asset', async () => {
    const plugin = buildComboCssPlugin({
      fileName: 'bundles/combo.css',
      sourceFileNames: ['bundles/a.css'],
    });
    const bundle: Rollup.OutputBundle = {
      'bundles/a.css': createChunk(),
    };

    const { generateBundle } = plugin;
    if (typeof generateBundle !== 'function') {
      throw new Error('Expected generateBundle to be a function');
    }

    expect(() =>
      generateBundle.call(
        { emitFile: vi.fn() } as unknown as Rollup.PluginContext,
        {} as Rollup.NormalizedOutputOptions,
        bundle,
        false,
      ),
    ).toThrow(
      'Cannot build combo file "bundles/combo.css": expected "bundles/a.css" to already be emitted as a CSS asset.',
    );
  });
});
