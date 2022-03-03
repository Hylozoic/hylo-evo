module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  extends: [
    'standard',
    'standard-react',
    'standard-jsx',
    'eslint-config-prettier'
  ],
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      configFile: './babel.config.js'
    },
    ecmaFeatures: {
      jsx: true
    },
    project: './tsconfig.json'
  },
  plugins: [
    'react'
  ],
  rules: {
    'prettier/prettier': 'off',
    'react/prop-types': 'off',
    'react/no-children-prop': 'warn',
    'react/jsx-fragments': 'warn',
    'react/jsx-wrap-multilines': 'warn',
    'import/export': 'off'
  },
  env: {
    'jest/globals': true
  },
  overrides: [
    {
      files: [
        '**/*.test.js',
        '**/*.spec.js'
      ],
      extends: [
        'plugin:jest/recommended',
        'plugin:testing-library/react'
      ],
      plugins: [
        'jest',
        'testing-library'
      ],
      rules: {
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 'error',
        'testing-library/prefer-screen-queries': 'off',
        'testing-library/prefer-user-event': 'off',
        'testing-library/await-async-query': 'error',
        'testing-library/no-await-sync-query': 'error',
        'testing-library/no-debugging-utils': 'warn',
        'testing-library/no-dom-import': 'off',
        'testing-library/consistent-data-testid': [
          2,
          {
            testIdAttribute: ['testID'],
            testIdPattern: '^TestId(__[A-Z]*)?$'
          }
        ]
      },
      settings: {
        jest: {
          version: require('jest/package.json').version
        }
      }
    }
  ]
}
