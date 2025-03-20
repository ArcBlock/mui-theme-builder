const path = require('path');

module.exports = {
  root: true,
  extends: ['@arcblock/eslint-config-ts'],
  parserOptions: {
    project: path.resolve(__dirname, 'tsconfig.eslint.json'),
  },
  globals: {
    logger: true,
  },
  rules: {
    'unicorn/filename-case': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'jsx-a11y/alt-text': 'off',
    'react/require-default-props': 'off',
    'react/no-unused-prop-types': 'off',
    'react/prop-types': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    '@typescript-eslint/indent': 'off',
  },
};
