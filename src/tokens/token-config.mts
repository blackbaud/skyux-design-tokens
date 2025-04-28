export type Breakpoint = 'xs' | 's' | 'm' | 'l';

export type ReferenceTokenSet = {
  breakpoint?: Breakpoint;
  name: string;
  path: string;
  selector?: string;
};

export type TokenSet = {
  name: string;
  path: string;
  selector: string;
  outputPath: string;
  referenceTokens: ReferenceTokenSet[];
};

export type TokenConfig = {
  rootPath?: string;
  tokenSets: TokenSet[];
};

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
          name: 'modern-layout',
          path: 'layout/modern.json',
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
          name: 'bb-dark-xs',
          selector: '.sky-theme-mode-dark',
          path: 'color/bb-dark.json',
        },
        {
          name: 'bb-dark-m',
          selector: '.sky-theme-mode-dark',
          path: 'color/bb-dark-m.json',
          breakpoint: 'm',
        },
        {
          name: 'bb-productive',
          path: 'layout/bb-productive.json',
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
