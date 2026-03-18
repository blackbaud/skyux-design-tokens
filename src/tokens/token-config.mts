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
      publicTokens: [
        {
          name: 'public-layout',
          path: 'public/layout.json',
          docsPath: 'public/docs/layout.json',
        },
        // {
        //   name: 'public-typography',
        //   path: 'public/typography.json',
        // },
        {
          name: 'public-elevation',
          path: 'public/elevation.json',
          docsPath: 'public/docs/elevation.json',
        },
        // {
        //   name: 'public-color',
        //   path: 'public/color.json',
        // },
        // {
        //   name: 'public-border',
        //   path: 'public/border.json',
        // },
      ],
      publicStyles: [
        { name: 'spacing', path: '../classes/public/spacing.json' },
        // { name: 'typography', path: '../classes/public/typography.json' },
        { name: 'elevation', path: '../classes/public/elevation.json' },
        // { name: 'color', path: '../classes/public/color.json' },
        // { name: 'border', path: '../classes/public/borders.json' },
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
      ],
    },
    {
      name: 'default',
      path: 'default/base.json',
      selector: '.sky-theme-default',
      outputPath: 'default.css',
      referenceTokens: [],
      publicTokens: [
        {
          name: 'public-layout',
          path: 'public/default/layout.json',
          docsPath: 'public/docs/layout.json',
        },
        // {
        //   name: 'public-typography',
        //   path: 'public/default/typography.json',
        // },
        {
          name: 'public-elevation',
          path: 'public/default/elevation.json',
          docsPath: 'public/docs/elevation.json',
        },
        // {
        //   name: 'public-color',
        //   path: 'public/default/color.json',
        // },
        // {
        //   name: 'public-border',
        //   path: 'public/default/border.json',
        // },
      ],
      publicStyles: [
        { name: 'spacing', path: '../classes/public/spacing.json' },
        // { name: 'typography', path: '../classes/public/typography.json' },
        { name: 'elevation', path: '../classes/public/elevation.json' },
        // { name: 'color', path: '../classes/public/color.json' },
        // { name: 'border', path: '../classes/public/borders.json' },
      ],
    },
  ],
};
