import { EmittedFile } from 'rollup';
import { describe, expect, it, vi } from 'vitest';
import * as exports from '../src/tokens/token-config.mts';
import { buildStyleDictionaryPlugin } from './build-style-dictionary-plugin.mjs';
import * as assetsUtils from './shared/assets-utils.mjs';
import { TokenSet } from '../src/types/token-set';

vi.stubEnv('PACKAGEJSON_VERSION', undefined);

describe('buildStyleDictionaryPlugin', () => {
  async function validate(
    tokenSets: TokenSet[],
    expectedEmittedFiles: Partial<EmittedFile>[],
    assetsCssMock = async (basePath: string) => '',
  ): Promise<void> {
    vi.spyOn(assetsUtils, 'generateAssetsCss').mockImplementation(
      assetsCssMock,
    );
    vi.spyOn(exports, 'tokenConfig', 'get').mockReturnValue({
      rootPath: 'plugins/fixtures/',
      tokenSets,
    });
    const plugin = buildStyleDictionaryPlugin();
    const emitFileSpy = vi.fn();
    if (plugin.generateBundle) {
      await plugin.generateBundle.call({
        emitFile: emitFileSpy,
      });
    }

    expect(emitFileSpy).toHaveBeenCalledTimes(expectedEmittedFiles.length);

    for (const { fileName, source } of expectedEmittedFiles) {
      expect(emitFileSpy).toHaveBeenCalledWith({
        type: 'asset',
        fileName,
        source,
      });
    }
  }
  it('should create style files for each token set provided', async () => {
    const tokenSets: TokenSet[] = [
      {
        name: 'muted',
        selector: '.sky-theme-muted',
        path: 'base-muted.json',
        outputPath: 'muted.css',
        referenceTokens: [
          {
            name: 'muted-colors',
            path: 'muted-colors.json',
          },
          {
            name: 'muted-dark-colors',
            path: 'muted-dark-colors.json',
            selector: '.sky-theme-mode-dark',
          },
        ],
      },
      {
        name: 'rainbow',
        selector: '.sky-theme-rainbow',
        path: 'base-rainbow.json',
        outputPath: 'rainbow.css',
        referenceTokens: [
          {
            name: 'rainbow-colors',
            path: 'rainbow-colors.json',
          },
        ],
      },
    ];

    const expectedEmittedFiles: Partial<EmittedFile>[] = [
      {
        fileName: 'assets/scss/muted.css',
        source: `.sky-theme-muted {
  --modern-color-black: #000000;
  --modern-color-gray-1: #e2e3e4;
  --modern-color-red-1: #f7a08f;
  --modern-color-red-2: #ef4044;
  --modern-color-white: #ffffff;
  --modern-space-lg: 20px;
  --modern-space-md: 15px;
  --modern-space-s: 10px;
}
.sky-theme-muted {
  --sky-color-background-danger: var(--modern-color-red-2);
  --sky-color-text-default: var(--modern-color-gray-1);
}
.sky-theme-muted.sky-theme-mode-dark {
  --sky-color-background-danger: var(--modern-color-black);
  --sky-color-text-default: var(--modern-color-red-1);
}
`,
      },
      {
        fileName: 'assets/scss/rainbow.css',
        source: `.sky-theme-rainbow {
  --rainbow-color-gray-1: #e2e3e7;
  --rainbow-color-gray-2: #c0c2c5;
  --rainbow-color-red-1: #fc0330;
  --rainbow-color-red-2: #8a2538;
  --rainbow-space-s: 10px;
}
.sky-theme-rainbow {
  --sky-color-background-danger: var(--rainbow-color-gray-1);
  --sky-color-text-default: var(--rainbow-color-red-1);
}
`,
      },
    ];
    await validate(tokenSets, expectedEmittedFiles);
  });

  it('should include the correct media queries for breakpoints', async () => {
    const tokenSets: TokenSet[] = [
      {
        name: 'responsive-rainbow',
        selector: '.sky-theme-rainbow',
        outputPath: 'responsive-rainbow.css',
        path: 'base-rainbow.json',
        referenceTokens: [
          {
            name: 'rainbow-colors-xs',
            responsive: {
              breakpoint: 'xs',
            },
            path: 'responsive-rainbow-colors-xs.json',
          },
          {
            name: 'rainbow-colors-md',
            responsive: {
              breakpoint: 'm',
            },
            path: 'responsive-rainbow-colors-m.json',
          },
          {
            name: 'rainbow-colors-sm',
            responsive: {
              breakpoint: 's',
            },
            path: 'responsive-rainbow-colors-s.json',
          },
        ],
      },
    ];

    const expectedEmittedFiles: Partial<EmittedFile>[] = [
      {
        fileName: 'assets/scss/responsive-rainbow.css',
        source: `.sky-theme-rainbow {
  --rainbow-color-gray-1: #e2e3e7;
  --rainbow-color-gray-2: #c0c2c5;
  --rainbow-color-red-1: #fc0330;
  --rainbow-color-red-2: #8a2538;
  --rainbow-space-s: 10px;
}
.sky-theme-rainbow {
  --sky-color-text-default: var(--rainbow-color-red-1);
}
@media (min-width: 768px) {
.sky-theme-rainbow {
  --sky-color-text-default: var(--rainbow-color-gray-2);
}
}
@media (min-width: 992px) {
.sky-theme-rainbow {
  --sky-color-text-default: var(--rainbow-color-gray-1);
}
}
`,
      },
    ];
    await validate(tokenSets, expectedEmittedFiles);
  });

  it('should add units to unitless zero values', async () => {
    const tokenSets: TokenSet[] = [
      {
        name: 'zeroes',
        selector: '.sky-theme-zero',
        outputPath: 'zeroes.css',
        path: 'zeroes.json',
        referenceTokens: [],
      },
    ];

    const expectedEmittedFiles: Partial<EmittedFile>[] = [
      {
        fileName: 'assets/scss/zeroes.css',
        source: `.sky-theme-zero {
  --zeroTest-space-1: 0rem;
  --zeroTest-space-2: 0rem;
  --zeroTest-space-3: 0rem;
  --zeroTest-space-4: 0rem;
  --zeroTest-space-5: 0px;
  --zeroTest-space-6: 0;
  --zeroTest-space-7: #000000;
}
`,
      },
    ];

    await validate(tokenSets, expectedEmittedFiles);
  });

  it('should add font declarations', async () => {
    const tokenSets: TokenSet[] = [
      {
        name: 'zeroes',
        selector: '.sky-theme-zero',
        outputPath: 'zeroes.css',
        path: 'zeroes.json',
        referenceTokens: [],
      },
    ];

    const expectedEmittedFiles: Partial<EmittedFile>[] = [
      {
        fileName: 'assets/scss/zeroes.css',
        source: `@font-face {
  font-family: Test;
  src: url('../test.tff');
}

.sky-theme-zero {
  --zeroTest-space-1: 0rem;
  --zeroTest-space-2: 0rem;
  --zeroTest-space-3: 0rem;
  --zeroTest-space-4: 0rem;
  --zeroTest-space-5: 0px;
  --zeroTest-space-6: 0;
  --zeroTest-space-7: #000000;
}
`,
      },
    ];

    const assetsCssMock = async (basePath: string) => `@font-face {
  font-family: Test;
  src: url('${basePath}test.tff');
}`;

    await validate(tokenSets, expectedEmittedFiles, assetsCssMock);
  });

  it('should generate the correct blackbaud and modern styles', async () => {
    const plugin = buildStyleDictionaryPlugin();
    const emitFileSpy = vi.fn();
    if (plugin.generateBundle) {
      await plugin.generateBundle.call({
        emitFile: emitFileSpy,
      });
    }

    const modernResults = emitFileSpy.mock.calls.find(
      (call) => call[0]?.fileName === 'assets/scss/modern.css',
    )?.[0];
    const blackbaudResults = emitFileSpy.mock.calls.find(
      (call) => call[0]?.fileName === 'assets/scss/blackbaud.css',
    )?.[0];

    expect(modernResults?.source).toMatchSnapshot();
    expect(blackbaudResults?.source).toMatchSnapshot();
  });
});
