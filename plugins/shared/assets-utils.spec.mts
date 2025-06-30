import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { fixAssetsUrlValue, generateAssetsCss } from './assets-utils.mts';

// Mock fs modules
vi.mock('fs', () => ({
  existsSync: vi.fn(),
}));

vi.mock('fs/promises', () => ({
  readFile: vi.fn(),
}));

// Mock the package.json import
vi.mock('../../package.json', () => ({
  default: {
    name: '@blackbaud/test-package',
    version: '0.0.1',
  },
}));

// Mock console methods to avoid noise in test output
const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

describe('assets-utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('PACKAGEJSON_VERSION', undefined);
  });

  afterEach(() => {
    consoleWarnSpy.mockClear();
    consoleErrorSpy.mockClear();
  });

  describe('fixAssetsUrlValue', () => {
    it('should return original value when basePath is undefined', () => {
      const value = '~/assets/fonts/roboto.ttf';
      const expected = "url('~/assets/fonts/roboto.ttf')";
      const result = fixAssetsUrlValue(undefined, value);
      expect(result).toBe(expected);
    });

    it('should replace ~/assets/ with basePath when basePath is provided', () => {
      const basePath = '/static/assets/';
      const value = '~/assets/fonts/roboto.ttf';
      const expected = "url('/static/assets/fonts/roboto.ttf')";
      const result = fixAssetsUrlValue(basePath, value);
      expect(result).toBe(expected);
    });

    it('should handle empty basePath string', () => {
      const basePath = '';
      const value = '~/assets/fonts/roboto.ttf';
      const expected = "url('fonts/roboto.ttf')";
      const result = fixAssetsUrlValue(basePath, value);
      expect(result).toBe(expected);
    });

    it('should handle values without ~/assets/ pattern', () => {
      const basePath = '/assets/';
      const value = '/some/other/path/font.ttf';
      const expected = "url('/some/other/path/font.ttf')";
      const result = fixAssetsUrlValue(basePath, value);
      expect(result).toBe(expected);
    });

    it('should return CDN url when package environment variable set', () => {
      const basePath = '/';
      const stub = vi.stubEnv('PACKAGEJSON_VERSION', '0.0.1');
      const value = '~/assets/fonts/roboto-regular.ttf';
      const expected =
        "url('https://sky.blackbaudcdn.net/static/test-package/0.0.1/assets/fonts/roboto-regular.ttf')";
      const result = fixAssetsUrlValue(basePath, value);

      expect(result).toBe(expected);
    });
  });

  describe('generateAssetsCss', () => {
    const mockAssetsConfig = {
      fonts: [
        {
          family: 'Roboto',
          style: 'normal',
          weight: '100 900',
          src: '~/assets/fonts/roboto-variable.ttf',
        },
        {
          family: 'Roboto',
          style: 'italic',
          weight: '100 900',
          src: '~/assets/fonts/roboto-italic-variable.ttf',
        },
      ],
    };

    it('should generate CSS font declarations with assets base path', async () => {
      const basePath = '/static/assets/';

      vi.mocked(existsSync).mockReturnValue(true);
      vi.mocked(readFile).mockResolvedValue(JSON.stringify(mockAssetsConfig));

      const result = await generateAssetsCss(basePath);

      expect(existsSync).toHaveBeenCalledWith('public/assets/assets.json');
      expect(readFile).toHaveBeenCalledWith(
        'public/assets/assets.json',
        'utf-8',
      );

      const expected = `@font-face {
  font-family: 'Roboto';
  src: url('/static/assets/fonts/roboto-variable.ttf');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Roboto';
  src: url('/static/assets/fonts/roboto-italic-variable.ttf');
  font-weight: 100 900;
  font-style: italic;
  font-display: swap;
}`;

      expect(result).toBe(expected);
    });

    it('should generate CSS font declarations without base path', async () => {
      const basePath = '';

      vi.mocked(existsSync).mockReturnValue(true);
      vi.mocked(readFile).mockResolvedValue(JSON.stringify(mockAssetsConfig));

      const result = await generateAssetsCss(basePath);

      const expected = `@font-face {
  font-family: 'Roboto';
  src: url('fonts/roboto-variable.ttf');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Roboto';
  src: url('fonts/roboto-italic-variable.ttf');
  font-weight: 100 900;
  font-style: italic;
  font-display: swap;
}`;

      expect(result).toBe(expected);
    });

    it('should return empty string when assets.json does not exist', async () => {
      vi.mocked(existsSync).mockReturnValue(false);

      const result = await generateAssetsCss('/assets/');

      expect(result).toBe('');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'assets.json not found in public/assets folder',
      );
      expect(readFile).not.toHaveBeenCalled();
    });

    it('should return empty string when no fonts are found in assets.json', async () => {
      const assetsConfigNoFonts = { fonts: [] };

      vi.mocked(existsSync).mockReturnValue(true);
      vi.mocked(readFile).mockResolvedValue(
        JSON.stringify(assetsConfigNoFonts),
      );

      const result = await generateAssetsCss('/assets/');

      expect(result).toBe('');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'No fonts found in assets.json',
      );
    });

    it('should return empty string when fonts property is missing', async () => {
      const assetsConfigMissingFonts = {};

      vi.mocked(existsSync).mockReturnValue(true);
      vi.mocked(readFile).mockResolvedValue(
        JSON.stringify(assetsConfigMissingFonts),
      );

      const result = await generateAssetsCss('/assets/');

      expect(result).toBe('');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'No fonts found in assets.json',
      );
    });

    it('should handle JSON parsing errors', async () => {
      vi.mocked(existsSync).mockReturnValue(true);
      vi.mocked(readFile).mockResolvedValue('invalid json');

      await expect(generateAssetsCss('/assets/')).rejects.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error generating font CSS:',
        expect.any(Error),
      );
    });

    it('should handle file reading errors', async () => {
      const readError = new Error('File read error');

      vi.mocked(existsSync).mockReturnValue(true);
      vi.mocked(readFile).mockRejectedValue(readError);

      await expect(generateAssetsCss('/assets/')).rejects.toThrow(
        'File read error',
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error generating font CSS:',
        readError,
      );
    });

    it('should format multiple fonts correctly', async () => {
      const multipleFontsConfig = {
        fonts: [
          {
            family: 'Roboto',
            style: 'normal',
            weight: '400',
            src: '~/assets/fonts/roboto-regular.ttf',
          },
          {
            family: 'Open Sans',
            style: 'italic',
            weight: '700',
            src: '~/assets/fonts/opensans-bold-italic.ttf',
          },
        ],
      };

      vi.mocked(existsSync).mockReturnValue(true);
      vi.mocked(readFile).mockResolvedValue(
        JSON.stringify(multipleFontsConfig),
      );

      const result = await generateAssetsCss('/assets/');

      const expected = `@font-face {
  font-family: 'Roboto';
  src: url('/assets/fonts/roboto-regular.ttf');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Open Sans';
  src: url('/assets/fonts/opensans-bold-italic.ttf');
  font-weight: 700;
  font-style: italic;
  font-display: swap;
}`;

      expect(result).toBe(expected);
    });
  });
});
