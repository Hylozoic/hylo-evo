const sharedConfig = require('./webpack.config.shared')

module.exports = function (api) {
  if (api) api.cache(true)

  const reactCSSModulesPlugin = [
    'react-css-modules',
    {
      generateScopedName: sharedConfig.cssLoader.options.localIdentName,
      filetypes: {
        '.scss': 'postcss-scss'
      },
      exclude: 'node_modules',
      searchPaths: [
        'src'
      ],
      webpackHotModuleReloading: true
    }
  ]

  return {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react'
    ],
    ignore: [
      '../scripts/templates/*'
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
        plugins: [reactCSSModulesPlugin]
      },
      production: {
        plugins: [reactCSSModulesPlugin],
        compact: true
      }
    }
  }
}
