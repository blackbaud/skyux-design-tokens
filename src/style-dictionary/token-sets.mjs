export const tokenSets = [
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
    selector: '.sky-theme-modern.sky-theme-brand-blackbaud',
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
      {
        name: 'bb-compact',
        selector: '.sky-theme-mode-compact',
        path: 'layout/bb-compact.json',
      },
      {
        name: 'bb-spacious',
        selector: '.sky-theme-mode-spacious',
        path: 'layout/bb-spacious.json',
      },
    ],
  },
];