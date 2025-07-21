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
    'import/no-extraneous-dependencies': 'off',
    'react/require-default-props': 'off',
    'react/no-unused-prop-types': 'off',
    'react/prop-types': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/alt-text': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/dot-notation': 'off',
    'react/require-default-props': [
      'error',
      {
        functions: 'defaultArguments',
      },
    ],
  },
};
