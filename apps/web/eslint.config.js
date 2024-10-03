import globals from 'globals'
import path from 'node:path'
import url from 'node:url'
import babelParser from '@babel/eslint-parser'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import { fixupPluginRules } from '@eslint/compat'
// import eslintConfigPrettier from 'eslint-config-prettier'
// import eslintConfigStandard from 'eslint-config-standard'
// import importPlugin from 'eslint-plugin-import'
// import jest from 'eslint-plugin-jest'
// import nPlugin from 'eslint-plugin-n'
// import promisePlugin from 'eslint-plugin-promise'
import react from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
// import testingLibrary from 'eslint-plugin-testing-library'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

// ESLINT 8/9
export default [
  js.configs.recommended,
  // eslintConfigStandard,
  {
    ignores: ['**/node_modules', '**/public']
  },
  ...compat.extends('standard', 'standard-jsx', 'standard-react'),
  // ...fixupConfigRules(
  //   compat.config({
  //     extends: ['prettier', 'standard', 'standard-jsx', 'standard-react']
  //   })
  // ),
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
    plugins: {
      react,
      reactHooksPlugin
      //'react-hooks': fixupPluginRules(reactHooksPlugin)
      // jest,
      // 'testing-library': testingLibrary,
      // import: importPlugin,
      // n: nPlugin,
      // promise: promisePlugin
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: babelParser,
      // ecmaVersion: 5,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          configFile: './babel.config.cjs'
        }
        // project: './tsconfig.json',
        // sourceType: 'module'
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node
      }
    },
    settings: {
      react: {
        version: 'detect'
      },
      jest: {
        version: 29
      }
    },
    rules: {
      // Add your custom rules here
      // 'react/react-in-jsx-scope': 'off',
      ...reactHooksPlugin.configs.recommended.rules,
      'prettier/prettier': 'off',
      'react/prop-types': 'off',
      'react/no-children-prop': 'warn',
      'react/jsx-handler-names': 'warn',
      'react/jsx-fragments': 'warn',
      'react/jsx-wrap-multilines': 'warn',
      'eslint/indent': 'off',
      'react-hooks/exhaustive-deps': 'warn'
      // 'import/export': 'off',
    }
  },
  {
    files: ['**/*.test.{js,jsx,ts,tsx}'],
    extends: [
      'plugin:jest/recommended',
      'plugin:testing-library/react'
    ]
  }
  // eslintConfigPrettier
]

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)
// const compat = new FlatCompat({
//     baseDirectory: __dirname,
//     recommendedConfig: js.configs.recommended,
//     allConfig: js.configs.all
// })

// export default [
//     nodePlugin.configs['flat/recommended-script'],
//     {
//         ignores: ['**/node_modules', '**/public'],
//     },
//     ...compat.extends('prettier', 'standard', 'standard-jsx', 'standard-react'),
//     {
//         plugins: {
//             react,
//         },
//         languageOptions: {
//             globals: {
//                 ...jest.environments.globals.globals,
//             },

//             parser: babelParser,
//             ecmaVersion: 5,
//             sourceType: 'script',

//             parserOptions: {
//                 requireConfigFile: false,

//                 babelOptions: {
//                     configFile: './babel.config.cjs',
//                 },

//                 project: './tsconfig.json',
//                 sourceType: 'module'
//             },
//         },

//         settings: {
//             react: {
//                 version: 'detect',
//             },
//             jest: {
//                 version: '29.7.0',
//             },
//         },

//         rules: {
//             'prettier/prettier': 'off',
//             'react/prop-types': 'off',
//             'react/no-children-prop': 'warn',
//             'react/jsx-handler-names': 'warn',
//             'react/jsx-fragments': 'warn',
//             'react/jsx-wrap-multilines': 'warn',
//             'import/export': 'off',
//         },
//     },
//     ...compat.extends('plugin:jest/recommended', 'plugin:testing-library/react').map(config => ({
//         ...config,
//         files: ['**/*.test.js', '**/*.spec.js'],
//     })), {
//     files: ['**/*.test.js', '**/*.spec.js'],

//     ecmaFeatures: {
//         modules: true,
//         spread: true,
//         restParams: true
//     },

//     plugins: {
//         jest,
//         'testing-library': testingLibrary,
//     },

//     rules: {
//         'jest/no-disabled-tests': 'warn',
//         'jest/no-focused-tests': 'error',
//         'jest/no-identical-title': 'error',
//         'jest/prefer-to-have-length': 'warn',
//         'jest/valid-expect': 'error',
//         'testing-library/prefer-screen-queries': 'off',
//         'testing-library/prefer-user-event': 'off',
//         'testing-library/await-async-query': 'error',
//         'testing-library/no-await-sync-query': 'error',
//         'testing-library/no-debugging-utils': 'warn',
//         'testing-library/no-dom-import': 'off',

//         'testing-library/consistent-data-testid': [2, {
//             testIdAttribute: ['testID'],
//             testIdPattern: '^TestId(__[A-Z]*)?$',
//         }],
//         'n/exports-style': ['error', 'module.exports']
//     },
// }]
