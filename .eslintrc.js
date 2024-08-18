module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': [
    'plugin:react/recommended',
  ],
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
    },
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  'plugins': [
    "@typescript-eslint",
    "react",
    "react-hooks",
    "jsx-a11y",
    "jest",
    "testing-library",
    "import",
  ],
  'rules': {
    'max-len': [2, 120, {
      'ignoreComments': true,
      'ignoreTrailingComments': true,
      'ignoreUrls': true,
      'ignoreStrings': true,
      'ignoreTemplateLiterals': true,
    }],
    'linebreak-style': ['error', 'windows'],
    'no-empty': 'error',
    'no-multiple-empty-lines': 'warn',
    'no-var': 'error',
    'prefer-const': 'error',
  },
};
