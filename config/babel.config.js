const sharedConfig = require('./webpack.config.shared')
const paths = require('./paths')

module.exports = function (api) {
  if (api) {
    console.log('Using Babel config with environment:', api.env())
    api.cache(true)
  } else {
    console.log('Referencing Babel config (not running Babel)')
  }

  const reactCSSModulesPlugin = [
    'react-css-modules',
    {
      generateScopedName: sharedConfig.cssLoader.options.localIdentName,
      filetypes: {
        '.scss': 'postcss-scss'
      },
      exclude: 'node_modules',
      searchPaths: [
        'src',
      ]
    }
  ]

  return {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react'
    ],
    ignore: [
      paths.resolveApp('scripts/templates/*')
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties'
    ],
    env: {
      test: {
        plugins: [
          'data-stylename'
        ]
      },
      development: {
        plugins: [
          [
            reactCSSModulesPlugin[0],
            {
              ...reactCSSModulesPlugin[1],
              webpackHotModuleReloading: true
            }
          ]
        ]
      },
      production: {
        plugins: [
          reactCSSModulesPlugin
        ],
        compact: true
      },
      server: {
        plugins: [
          reactCSSModulesPlugin
        ],
        compact: true
      }
    }
  }
}
