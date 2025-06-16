import { TokenConfig } from '../types/token-config';

export const tokenConfig: TokenConfig = {
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
          name: 'modern-layout-xs',
          path: 'layout/modern.json',
          responsive: {
            breakpoint: 'xs',
            includesContainer: true,
          },
        },
        {
          name: 'modern-layout-sm',
          path: 'layout/modern-sm-min.json',
          responsive: {
            breakpoint: 's',
            includesContainer: true,
          },
        },
      ],
    },
    {
      name: 'blackbaud',
      path: 'base-blackbaud.json',
      selector: '.sky-theme-modern.sky-theme-brand-base',
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
          name: 'bb-productive-xs',
          path: 'layout/bb-productive.json',
          responsive: {
            breakpoint: 'xs',
            includesContainer: true,
          },
        },
        {
          name: 'bb-productive-sm',
          path: 'layout/bb-prod-sm-min.json',
          responsive: {
            breakpoint: 's',
            includesContainer: true,
          },
        },
        {
          name: 'bb-compact',
          selector: '.sky-theme-mode-compact',
          path: 'layout/bb-compact.json',
        },
      ],
    },
  ],
};
