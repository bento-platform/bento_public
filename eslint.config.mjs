import globals from 'globals';
import js from '@eslint/js';

// Parser
import tsParser from '@typescript-eslint/parser';

// Plugins
import tsEsLint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooksEsLint from 'eslint-plugin-react-hooks';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  js.configs.recommended,
  tsEsLint.configs.eslintRecommended,
  ...tsEsLint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  eslintPluginPrettierRecommended,
  reactHooksEsLint.configs.flat.recommended,
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.es2021, ...globals.node },
      parser: tsParser,
    },
    rules: {
      'react/prop-types': 'off', // disable prop-types since we're using TypeScript
      '@typescript-eslint/explicit-module-boundary-types': 'off', // allow implicit return types
      '@typescript-eslint/no-empty-object-type': 'off', // allow empty object type
      'no-unused-vars': 'off', // disable no-unused-vars since @typescript-eslint/no-unused-vars does the same
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // enable @typescript-eslint/no-unused-vars
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/exhaustive-deps': ['error'],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
