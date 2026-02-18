import globals from 'globals';
import js from '@eslint/js';

// Parser
import tsParser from '@typescript-eslint/parser';

// Plugins
import tsEsLint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooksEsLint from 'eslint-plugin-react-hooks';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import prettier from 'eslint-plugin-prettier';

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
    plugins: {
      react,
      'react-hooks': reactHooksEsLint,
      prettier,
    },
    // env: {
    //   browser: true,
    //   es2021: true,
    //   node: true,
    // },
    // plugins: ['react', '@typescript-eslint'],
    // extends: [
    //   'eslint:recommended',
    //   'plugin:react/recommended',
    //   'plugin:@typescript-eslint/eslint-recommended',
    //   'plugin:@typescript-eslint/recommended',
    //   'plugin:prettier/recommended',
    //   'plugin:react-hooks/recommended',
    //   'plugin:react/jsx-runtime',
    // ],
    rules: {
      'react/prop-types': 'off', // disable prop-types since we're using TypeScript
      '@typescript-eslint/explicit-module-boundary-types': 'off', // allow implicit return types
      '@typescript-eslint/no-empty-interface': 'off', // allow empty interfaces
      'no-unused-vars': 'off', // disable no-unused-vars since @typescript-eslint/no-unused-vars does the same
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // enable @typescript-eslint/no-unused-vars
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      'comma-dangle': [
        'error',
        {
          arrays: 'always-multiline',
          objects: 'always-multiline',
          imports: 'always-multiline',
          exports: 'always-multiline',
        },
      ],
      semi: ['error', 'always'],
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
