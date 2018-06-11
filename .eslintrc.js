/**
 *
 * eslint 配置
 */
module.exports = {
  extends: ['airbnb-base', 'plugin:react/recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true
    }
  },
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true,
    es6: true,
    commonjs: true
  },
  plugins: ['react', 'prettier'],
  globals: {},

  rules: {
    'prettier/prettier': ['error', { singleQuote: true }],
    indent: ['error', 2],
    'no-mixed-operators': 'warn',
    'prefer-destructuring': 'warn',
    'prefer-const': 'off',
    'no-underscore-dangle': 'off',
    'no-throw-literal': 'error',
    'no-param-reassign': 'error',
    'no-lone-blocks': 'error',
    'no-new': 'error',
    'class-methods-use-this': 'warn',
    'react/prop-types': 'off',
    'no-unused-vars': 'warn'
  }
};
