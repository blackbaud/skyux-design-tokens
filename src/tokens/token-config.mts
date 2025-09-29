import { TokenConfig } from '@blackbaud/skyux-branding-builder';

export const tokenConfig: TokenConfig = {
  projectName: 'skyux-design-tokens',
  tokenSets: [
    {
      name: 'modern',
      path: 'base-modern.json',
      selector: '.sky-theme-modern',
      outputPath: 'modern.css',
      referenceTokens: [
        {
          name: 'modern-colors',
          path: 'color/modern.json',
        },
        {
          name: 'modern-layout',
          path: 'layout/modern.json',
        },
      ],
    },
    {
      name: 'base',
      path: 'base-blackbaud.json',
      selector: '.sky-theme-modern.sky-theme-brand-base',
      outputPath: 'base.css',
      referenceTokens: [
        {
          name: 'base-light',
          path: 'color/base-light.json',
        },
        {
          name: 'base-dark',
          selector: '.sky-theme-mode-dark',
          path: 'color/base-dark.json',
        },
        {
          name: 'base-productive',
          path: 'layout/base-productive.json',
        },
      ],
    },
    {
      name: 'blackbaud',
      path: 'base-blackbaud.json',
      selector:
        '.sky-theme-modern.sky-theme-brand-base.sky-theme-brand-blackbaud',
      outputPath: 'blackbaud.css',
      referenceTokens: [
        {
          name: 'bb-light',
          path: 'color/bb-light.json',
        },
        {
          name: 'bb-dark',
          selector: '.sky-theme-mode-dark',
          path: 'color/bb-dark.json',
        },
        {
          name: 'bb-productive',
          path: 'layout/bb-productive.json',
        },
      ],
    },
  ],
};
