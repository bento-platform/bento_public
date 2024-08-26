module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  plugins: ['react', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    'react/prop-types': 'off', // disable prop-types since we're using TypeScript
    '@typescript-eslint/explicit-module-boundary-types': 'off', // allow implicit return types
    '@typescript-eslint/no-empty-interface': 'off', // allow empty interfaces
    'no-unused-vars': 'off', // disable no-unused-vars since @typescript-eslint/no-unused-vars does the same
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // enable @typescript-eslint/no-unused-vars
    '@typescript-eslint/no-non-null-assertion': 'off',
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
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
