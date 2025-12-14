module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    '@react-native-community',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    'react-native/no-inline-styles': 'off',
  },
};
