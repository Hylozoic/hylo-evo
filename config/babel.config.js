const sharedConfig = require('./webpack.config.shared')
const paths = require('./paths')

module.exports = function (api) {
  if (api) {
    api.cache(true)
    console.log('Using Babel config with environment:', api.env())
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

  // const reactCSSModulesPlugin = [
  //   'react-css-modules',
  //   {
  //     generateScopedName: sharedConfig.cssLoader.options.localIdentName,
  //     handleMissingStyleName: 'warn',
  //     filetypes: {
  //       '.scss': {
  //         syntax: 'postcss-scss',
  //         plugins: [
  //           [
  //             'postcss-nested',
  //             {
  //               preserveEmpty: true
  //             }
  //           ],
  //           [
  //             'postcss-modules-resolve-path',
  //             {
  //               paths: [paths.appSrc]
  //             }
  //           ]
  //         ],
  //       }
  //     },
  //     exclude: 'node_modules'
  //   }
  // ]

  // const reactCSSModulesPluginServer = [
  //   'react-css-modules',
  //   {
  //     generateScopedName: sharedConfig.cssLoader.options.localIdentName,
  //     handleMissingStyleName: 'warn',
  //     filetypes: {
  //       '.scss': {
  //         syntax: 'postcss-scss',
  //         // removeImport: true
  //         plugins: [
  //           // 'precss',
  //           [
  //             'postcss-nested',
  //             {
  //               preserveEmpty: true
  //             }
  //           ],
  //           [
  //             'postcss-modules-resolve-path',
  //             {
  //               paths: [paths.appSrc, paths.appNodeModules]
  //             }
  //           ],
  //           'postcss-sass'
  //         ],
  //       }
  //     },
  //     exclude: 'node_modules'
  //   }
  // ]