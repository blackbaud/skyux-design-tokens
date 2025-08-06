import eslint from '@eslint/js';
import typescriptEslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';

export default typescriptEslint.config(
  eslint.configs.recommended,
  eslintConfigPrettier,
  {
    // Configuration for TypeScript files in src directory
    files: ['src/**/*.ts', 'src/**/*.mts'],
    extends: [...typescriptEslint.configs.strictTypeChecked],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
  {
    // Configuration for TypeScript files outside src directory (plugins, etc.)
    files: ['plugins/**/*.ts', 'plugins/**/*.mts', '*.ts', '*.mts'],
    extends: [...typescriptEslint.configs.recommended],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      // No project reference for files outside tsconfig
    },
    rules: {
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
  {
    // Configuration for JavaScript files
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
  {
    ignores: ['coverage/', 'dist/', 'vite.config.js'],
  },
);
