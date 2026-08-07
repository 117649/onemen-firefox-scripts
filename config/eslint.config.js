import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import mozilla from 'eslint-plugin-mozilla';
import {defineConfig} from 'eslint/config';
import globals from 'globals';

export default defineConfig([
  {
    name: 'global-ignore',
    ignores: [
      '.github',
      'logs/',
      '.vscode',
      '**/*local*/**',
      '**/*local*.*',
      '**/*.d.ts',
      '**/@types/**',
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: {js},
    extends: ['js/recommended'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2024,
        ...mozilla.environments['browser-window'].globals,
        ...mozilla.environments.specific.globals,
        // firefox scripts globals
        BOOTSTRAP_REASONS: 'readonly',
        Blocklist: 'readonly',
        ChromeManifest: 'readonly',
        ConsoleAPI: 'readonly',
        getNameFromRDF: 'readonly',
        InstallRDF: 'readonly',
        Management: 'readonly',
        USE_RDFNS_ATTR: 'readonly',
        _uc: 'readonly',
        logger: 'readonly',
        lockPref: 'readonly',
        pref: 'readonly',
        RDF_R: 'readonly',
        UC: 'readonly',
        xPref: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^ignored',
        },
      ],
      'prefer-const': 'error',
    },
  },

  eslintConfigPrettier, // Add at the end to disable formatting rules
]);
