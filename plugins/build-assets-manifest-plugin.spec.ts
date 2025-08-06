import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { buildAssetsManifestPlugin } from './build-assets-manifest-plugin.mts';
import * as assetsUtils from './shared/assets-utils.mts';
import { AssetsConfig } from './shared/assets-config';
import type { EmittedAsset } from 'rollup';

// Mock dependencies
vi.mock('./shared/assets-utils.mts', () => ({
  fixAssetsUrl: vi.fn(),
}));

vi.mock('fs', () => ({
  existsSync: vi.fn(),
  readFile: vi.fn(),
}));

vi.mock('fs/promises', () => ({
  readFile: vi.fn(),
}));

vi.mock('util', () => ({
  promisify: vi.fn((fn) => fn),
}));

const { existsSync } = await import('fs');
const { readFile } = await import('fs/promises');

describe('build-assets-manifest-plugin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('buildAssetsManifestPlugin', () => {
    // Helper function to create plugin and execute generateBundle
    async function executePluginGenerateBundle(
      plugin: ReturnType<typeof buildAssetsManifestPlugin>,
      emitFileSpy: Mock<(emittedFile: EmittedAsset) => string>,
    ) {
      if (plugin.generateBundle) {
        await (
          plugin.generateBundle as (this: {
            emitFile: (emittedFile: EmittedAsset) => string;
          }) => void | Promise<void>
        ).call({
          emitFile: emitFileSpy,
        });
      }
    }

    // Helper function to setup file system mocks
    function setupFileSystemMocks(
      fileExists: boolean,
      fileContent?: string | Error,
    ) {
      vi.mocked(existsSync).mockReturnValue(fileExists);

      if (fileContent instanceof Error) {
        vi.mocked(readFile).mockRejectedValue(fileContent);
      } else if (fileContent !== undefined) {
        vi.mocked(readFile).mockResolvedValue(fileContent);
      }
    }

    // Helper function to create and manage console spy
    function createConsoleSpy(method: 'warn' | 'error') {
      const spy = vi.spyOn(console, method).mockImplementation(() => {});
      return {
        spy,
        restore: () => spy.mockRestore(),
      };
    }

    // Helper function to expect emitted file
    function expectEmittedFile(
      emitFileSpy: Mock<(emittedFile: EmittedAsset) => string>,
      fileName: string,
      content: unknown,
    ) {
      expect(emitFileSpy).toHaveBeenCalledWith({
        type: 'asset',
        fileName,
        source: JSON.stringify(content, null, 2),
      });
    }

    // Helper function to create test setup
    function createTestSetup() {
      const plugin = buildAssetsManifestPlugin();
      const emitFileSpy = vi.fn<(emittedFile: EmittedAsset) => string>();
      const mockFixAssetsUrl = vi.mocked(assetsUtils.fixAssetsUrl);

      return {
        plugin,
        emitFileSpy,
        mockFixAssetsUrl,
      };
    }

    // Helper function to run plugin test with assets config
    async function testPluginWithAssetsConfig(
      assetsConfig: AssetsConfig,
      mockReturnValues: string | string[],
      expectedCalls?: Array<{ basePath: string; url: string }>,
    ) {
      const { plugin, emitFileSpy, mockFixAssetsUrl } = createTestSetup();
      const assetsJson = JSON.stringify(assetsConfig);

      // Setup mock return values
      if (Array.isArray(mockReturnValues)) {
        mockReturnValues.forEach((value) => {
          mockFixAssetsUrl.mockReturnValueOnce(value);
        });
      } else {
        mockFixAssetsUrl.mockReturnValue(mockReturnValues);
      }

      setupFileSystemMocks(true, assetsJson);
      await executePluginGenerateBundle(plugin, emitFileSpy);

      // Verify expected calls if provided
      if (expectedCalls) {
        expectedCalls.forEach(({ basePath, url }) => {
          expect(mockFixAssetsUrl).toHaveBeenCalledWith(basePath, url);
        });
        expect(mockFixAssetsUrl).toHaveBeenCalledTimes(expectedCalls.length);
      }

      return { emitFileSpy, mockFixAssetsUrl };
    }

    // Helper function to test error scenarios
    async function testErrorScenario(
      fileExists: boolean,
      fileContent: string | Error,
      expectedConsoleMethod: 'warn' | 'error',
      expectedMessage: string,
      expectErrorObject = false,
    ) {
      const { plugin, emitFileSpy } = createTestSetup();
      const { spy: consoleSpy, restore } = createConsoleSpy(
        expectedConsoleMethod,
      );

      setupFileSystemMocks(fileExists, fileContent);
      await executePluginGenerateBundle(plugin, emitFileSpy);

      if (expectErrorObject) {
        expect(consoleSpy).toHaveBeenCalledWith(
          expectedMessage,
          expect.any(Error),
        );
      } else {
        expect(consoleSpy).toHaveBeenCalledWith(expectedMessage);
      }
      expect(emitFileSpy).not.toHaveBeenCalled();

      restore();
      return { consoleSpy, emitFileSpy };
    }

    it('should create a plugin with default options', () => {
      const plugin = buildAssetsManifestPlugin();

      expect(plugin.name).toBe('build-assets-manifest');
      expect(plugin.generateBundle).toBeDefined();
    });

    it('should handle missing assets.json file', async () => {
      await testErrorScenario(
        false,
        '',
        'warn',
        'assets.json not found in public/assets folder',
      );
    });

    it('should transform assets.json with default options', async () => {
      const { emitFileSpy } = await testPluginWithAssetsConfig(
        { fonts: [] },
        '',
      );
      expectEmittedFile(emitFileSpy, 'assets/assets.json', { fonts: [] });
    });

    it('should transform assets.json with real asset data', async () => {
      const assetsConfig: AssetsConfig = {
        images: {
          favicon: {
            src: '~/assets/images/favicon.ico',
          },
        },
      };

      const { emitFileSpy } = await testPluginWithAssetsConfig(
        assetsConfig,
        '/base/assets/images/favicon.ico',
        [{ basePath: './', url: '~/assets/images/favicon.ico' }],
      );

      const expectedConfig: AssetsConfig = {
        images: {
          favicon: {
            src: '/base/assets/images/favicon.ico',
          },
        },
      };

      expectEmittedFile(emitFileSpy, 'assets/assets.json', expectedConfig);
    });

    it('should handle assets.json with fonts', async () => {
      const assetsConfig: AssetsConfig = {
        fonts: [
          {
            family: 'Roboto',
            style: 'normal',
            weight: '400',
            src: '~/assets/fonts/roboto-variable.ttf',
          },
        ],
      };

      const { emitFileSpy } = await testPluginWithAssetsConfig(
        assetsConfig,
        '/base/assets/fonts/roboto-variable.ttf',
        [{ basePath: './', url: '~/assets/fonts/roboto-variable.ttf' }],
      );

      const expectedConfig: AssetsConfig = {
        fonts: [
          {
            family: 'Roboto',
            style: 'normal',
            weight: '400',
            src: '/base/assets/fonts/roboto-variable.ttf',
          },
        ],
      };

      expectEmittedFile(emitFileSpy, 'assets/assets.json', expectedConfig);
    });

    it('should handle assets.json with both images and fonts', async () => {
      const assetsConfig: AssetsConfig = {
        images: {
          favicon: {
            src: '~/assets/images/favicon.ico',
          },
        },
        fonts: [
          {
            family: 'Roboto',
            style: 'normal',
            weight: '400',
            src: '~/assets/fonts/roboto-variable.ttf',
          },
        ],
      };

      const { emitFileSpy } = await testPluginWithAssetsConfig(
        assetsConfig,
        [
          '/base/assets/fonts/roboto-variable.ttf',
          '/base/assets/images/favicon.ico',
        ],
        [
          { basePath: './', url: '~/assets/fonts/roboto-variable.ttf' },
          { basePath: './', url: '~/assets/images/favicon.ico' },
        ],
      );

      const expectedConfig: AssetsConfig = {
        images: {
          favicon: {
            src: '/base/assets/images/favicon.ico',
          },
        },
        fonts: [
          {
            family: 'Roboto',
            style: 'normal',
            weight: '400',
            src: '/base/assets/fonts/roboto-variable.ttf',
          },
        ],
      };

      expectEmittedFile(emitFileSpy, 'assets/assets.json', expectedConfig);
    });

    it('should handle invalid JSON gracefully', async () => {
      await testErrorScenario(
        true,
        '{ invalid json }',
        'error',
        'Error transforming assets.json:',
        true, // Expect error object
      );
    });

    it('should handle empty assets.json file', async () => {
      await testErrorScenario(
        true,
        '',
        'warn',
        'assets.json is empty',
        false, // No error object expected
      );
    });

    it('should handle assets with non-~/assets paths', async () => {
      const { plugin, emitFileSpy, mockFixAssetsUrl } = createTestSetup();
      const assetsConfig: AssetsConfig = {
        images: {
          favicon: {
            src: '/static/icon.svg',
          },
        },
        fonts: [
          {
            family: 'Arial',
            style: 'normal',
            weight: '400',
            src: '/fonts/arial.ttf',
          },
        ],
      };
      const assetsJson = JSON.stringify(assetsConfig);

      setupFileSystemMocks(true, assetsJson);
      await executePluginGenerateBundle(plugin, emitFileSpy);

      // fixAssetsUrl should not be called for non-~/assets paths
      expect(mockFixAssetsUrl).not.toHaveBeenCalled();

      // The assets should remain unchanged
      expectEmittedFile(emitFileSpy, 'assets/assets.json', assetsConfig);
    });

    it('should handle transformation failure and show warning', async () => {
      await testErrorScenario(
        true,
        '{"images": {"favicon": {"src": }}}', // Missing value
        'warn',
        'Failed to transform assets.json',
        false, // No error object expected
      );
    });

    it('should handle mixed paths (some with ~/assets, some without)', async () => {
      const { plugin, emitFileSpy, mockFixAssetsUrl } = createTestSetup();
      const assetsConfig: AssetsConfig = {
        images: {
          favicon: {
            src: 'https://cdn.example.com/logo.png',
          },
        },
        fonts: [
          {
            family: 'Roboto',
            style: 'normal',
            weight: '400',
            src: '~/assets/fonts/roboto-variable.ttf',
          },
        ],
      };
      const assetsJson = JSON.stringify(assetsConfig);

      mockFixAssetsUrl.mockReturnValue(
        '/base/assets/fonts/roboto-variable.ttf',
      );
      setupFileSystemMocks(true, assetsJson);
      await executePluginGenerateBundle(plugin, emitFileSpy);

      // fixAssetsUrl should only be called for ~/assets paths
      expect(mockFixAssetsUrl).toHaveBeenCalledTimes(1);
      expect(mockFixAssetsUrl).toHaveBeenCalledWith(
        './',
        '~/assets/fonts/roboto-variable.ttf',
      );

      const expectedConfig: AssetsConfig = {
        images: {
          favicon: {
            src: 'https://cdn.example.com/logo.png',
          },
        },
        fonts: [
          {
            family: 'Roboto',
            style: 'normal',
            weight: '400',
            src: '/base/assets/fonts/roboto-variable.ttf',
          },
        ],
      };

      expectEmittedFile(emitFileSpy, 'assets/assets.json', expectedConfig);
    });

    it('should handle assets.json with only fonts (no images)', async () => {
      const plugin = buildAssetsManifestPlugin();
      const emitFileSpy = vi.fn<(emittedFile: EmittedAsset) => string>();
      const mockFixAssetsUrl = vi.mocked(assetsUtils.fixAssetsUrl);

      const assetsConfig: AssetsConfig = {
        fonts: [
          {
            family: 'Roboto',
            style: 'normal',
            weight: '400',
            src: '~/assets/fonts/roboto.ttf',
          },
        ],
      };

      const assetsJson = JSON.stringify(assetsConfig);

      mockFixAssetsUrl.mockReturnValue('./fonts/roboto.ttf');
      setupFileSystemMocks(true, assetsJson);

      await executePluginGenerateBundle(plugin, emitFileSpy);

      expect(mockFixAssetsUrl).toHaveBeenCalledWith(
        './',
        '~/assets/fonts/roboto.ttf',
      );

      const expectedConfig: AssetsConfig = {
        fonts: [
          {
            family: 'Roboto',
            style: 'normal',
            weight: '400',
            src: './fonts/roboto.ttf',
          },
        ],
      };

      expectEmittedFile(emitFileSpy, 'assets/assets.json', expectedConfig);
    });

    it('should handle assets.json with only images (no fonts)', async () => {
      const plugin = buildAssetsManifestPlugin();
      const emitFileSpy = vi.fn<(emittedFile: EmittedAsset) => string>();
      const mockFixAssetsUrl = vi.mocked(assetsUtils.fixAssetsUrl);

      const assetsConfig: AssetsConfig = {
        images: {
          favicon: {
            src: '~/assets/images/logo.png',
          },
        },
      };

      const assetsJson = JSON.stringify(assetsConfig);

      mockFixAssetsUrl.mockReturnValue('./images/logo.png');
      setupFileSystemMocks(true, assetsJson);

      await executePluginGenerateBundle(plugin, emitFileSpy);

      expect(mockFixAssetsUrl).toHaveBeenCalledWith(
        './',
        '~/assets/images/logo.png',
      );

      const expectedConfig: AssetsConfig = {
        images: {
          favicon: {
            src: './images/logo.png',
          },
        },
      };

      expectEmittedFile(emitFileSpy, 'assets/assets.json', expectedConfig);
    });

    it('should handle file read errors', async () => {
      const plugin = buildAssetsManifestPlugin();
      const emitFileSpy = vi.fn<(emittedFile: EmittedAsset) => string>();
      const { spy: errorSpy, restore } = createConsoleSpy('error');

      const readError = new Error('File read failed');

      setupFileSystemMocks(true, readError);

      await executePluginGenerateBundle(plugin, emitFileSpy);

      expect(errorSpy).toHaveBeenCalledWith(
        'Error processing assets.json:',
        readError,
      );
      expect(emitFileSpy).not.toHaveBeenCalled();

      restore();
    });
  });
});
