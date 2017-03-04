var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
var InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')
var WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin')
var getClientEnvironment = require('./env')
var paths = require('./paths')

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
var publicPath = '/'
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
var publicUrl = ''
// Get environment variables to inject into our app.
var env = getClientEnvironment(publicUrl)

// This is the development configuration.
// It is focused on developer experience and fast rebuilds.
// The production configuration is different and lives in a separate file.
module.exports = {
  devtool: 'cheap-module-source-map',

  entry: [
    require.resolve('react-dev-utils/webpackHotDevClient'),
    require.resolve('./polyfills'),
    paths.appIndexJs
  ],
  output: {
    path: paths.appBuild,
    pathinfo: true,
    filename: 'static/js/bundle.js',
    publicPath: publicPath
  },
  resolve: {
    fallback: paths.nodePaths,
    extensions: ['.js', '.json', '.jsx', ''],
    alias: {
      'react-native': 'react-native-web'
    },
    // LEJ: Allow /src to operate as it's own absolute root
    root: [paths.appSrc]
  },

  module: {
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'eslint',
        include: paths.appSrc
      }
    ],
    loaders: [
      // Static resources
      {
        exclude: [
          /\.html$/,
          /\.(js|jsx)$/,
          /\.scss$/,
          /\.css$/,
          /\.json$/,
          /\.svg$/
        ],
        loader: 'url',
        query: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      // Babel
      {
        test: /\.(js|jsx)$/,
        include: [paths.appNodeModules, paths.appSrc],
        loader: 'babel',
        query: {
          cacheDirectory: true
        }
      },
      // Global SASS resources (not loaded through modules)
      {
        test: /\.(css|scss|sass)$/,
        include: [
          paths.appCssGlobal
        ],
        loaders: [
          'style?sourceMap',
          'css?importLoaders=3',
          'postcss',
          'sass?sourceMap',
          'sass-resources'
        ]
      },
      // CSS Modules for all SASS files not in resources or global
      {
        test: /\.(css|scss|sass)$/,
        exclude: [
          paths.appSassResources,
          paths.appCssGlobal
        ],
        loaders: [
          'style?sourceMap',
          'css?modules&importLoaders=3&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
          'postcss',
          'sass?sourceMap',
          'sass-resources'
        ]
      },
      // JSON is not enabled by default in Webpack but both Node and Browserify
      // allow it implicitly so we also enable it.
      {
        test: /\.json$/,
        loader: 'json'
      },
      // "file" loader for svg
      {
        test: /\.svg$/,
        loader: 'file',
        query: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      }
    ]
  },

  // LEJ: Define global SASS variables in the files specified here
  // for preloading by the sass-resources loader. The explicit
  // load order is on purpose.
  sassResources: [
    paths.appSassResources + '/_app.scss',
    paths.appSassResources + '/_bootstrap-customization.scss'
  ],

  postcss: function () {
    return [
      require('postcss-cssnext')({
        browsers: [
          '>1%',
          'last 4 versions',
          'Firefox ESR',
          'not ie < 9' // React doesn't support IE8 anyway
        ]
      })
    ]
  },
  plugins: [
    // Makes the public URL available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In development, this will be an empty string.
    new InterpolateHtmlPlugin({
      PUBLIC_URL: publicUrl
    }),
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml
    }),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
    new webpack.DefinePlugin(env),
    // This is necessary to emit hot updates (currently CSS only):
    new webpack.HotModuleReplacementPlugin(),
    // Watcher doesn't work well if you mistype casing in a path so we use
    // a plugin that prints an error when you attempt to do this.
    // See https://github.com/facebookincubator/create-react-app/issues/240
    new CaseSensitivePathsPlugin(),
    // If you require a missing module and then `npm install` it, you still have
    // to restart the development server for Webpack to discover it. This plugin
    // makes the discovery automatic so you don't have to restart.
    // See https://github.com/facebookincubator/create-react-app/issues/186
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    // Required for bootstrap-loader
    new webpack.ProvidePlugin({
      'window.Tether': 'tether'
    })
  ],
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
}
