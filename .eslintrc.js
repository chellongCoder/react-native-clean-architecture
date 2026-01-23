module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['react-hooks', '@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    '@react-native',
  ],
  ignorePatterns: ['babel.config.js', 'metro.config.js', 'webpack.config.js'],
  rules: {
    'prettier/prettier': ['error', {endOfLine: 'auto'}, {usePrettierrc: true}],
    'react-native/no-inline-styles': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
