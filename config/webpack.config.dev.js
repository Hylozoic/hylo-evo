const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')
const getClientEnvironment = require('./env')
const paths = require('./paths')
const sharedConfig = require('./webpack.config.shared')

const publicPath = '/'
const publicUrl = ''
const env = getClientEnvironment(publicUrl)

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: [
    require.resolve('react-dev-utils/webpackHotDevClient'),
    require.resolve('./polyfills'),
    paths.appIndexJs
  ],
  output: {
    path: paths.appBuild,
    pathinfo: true,
    filename: 'assets/js/bundle.js',
    publicPath: publicPath,
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
  },
  resolve: {
    // NOTE: fixes issue with yarn link and peerDependencies
    // https://github.com/webpack/webpack/issues/985#issuecomment-261497772
    symlinks: true,
    modules: [
      paths.appSrc,
      path.resolve(__dirname, '..', 'node_modules'),
      'node_modules'
    ].concat(paths.nodePaths),
    extensions: ['.mjs', '.js', '.json', '.jsx'],
    alias: {
      'react-native': 'react-native-web'
    },
    fallback: {
      fs: false,
      net: false,
      tls: false,
      path: require.resolve('path-browserify')
    }
  },
  module: {
    rules: [
      // Disable require.ensure as it's not a standard language feature.
      { parser: { requireEnsure: false } },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      },
      // First, run the linter.
      // It's important to do this before Babel processes the JS.
      // Using standard js linter
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        loader: 'standard-loader',
        include: paths.appSrc,
        options: {
          // Emit errors instead of warnings (default = false)
          error: false,
          // enable snazzy output (default = true)
          snazzy: true,
          // other config options to be passed through to standard e.g.
          parser: '@babel/eslint-parser'
        }
      },
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          // "url" loader works like "file" loader except that it embeds assets
          // smaller than specified limit in bytes as data URLs to avoid requests.
          // A missing `test` is equivalent to a match.
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'assets/media/[name].[hash:8].[ext]'
            }
          },
          // Graphql files
          sharedConfig.graphqlLoader,
          // Process application JS with Babel.
          // The preset includes JSX, Flow, TypeScript, and some ESnext features.
          {
            test: /\.jsx?$/,
            include: paths.appSrc,
            loader: require.resolve('babel-loader'),
            options: {
              configFile: paths.babelConfigFile,
              // `babel-loader` specific config (not Babel itself)
              customize: require.resolve(
                'babel-preset-react-app/webpack-overrides'
              ),
              cacheDirectory: true
            }
          },
          sharedConfig.tsLoader,
          // Process any JS outside of the app with Babel.
          // Unlike the application JS, we only compile the standard ES features.
          {
            test: /\.(js|mjs)$/,
            exclude: /@babel(?:\/|\\{1,2})runtime/,
            loader: require.resolve('babel-loader'),
            options: {
              babelrc: false,
              configFile: false,
              compact: false,
              presets: [
                [
                  require.resolve('babel-preset-react-app/dependencies'),
                  { helpers: true }
                ]
              ],
              ignore: [ './node_modules/mapbox-gl/dist/mapbox-gl.js' ],
              cacheDirectory: true,
              // If an error happens in a package, it's possible to be
              // because it was compiled. Thus, we don't want the browser
              // debugger to show the original code. Instead, the code
              // being evaluated would be much more helpful.
              sourceMaps: false
            }
          },
          // Plain CSS file loading, primarily used to load from `node_modules` provided stylesheets
          // e.g. mapbox, slick carousel, tippy, etc
          {
            test: /\.css$/,
            use: [
              'style-loader',
              'css-loader'
            ]
          },
          // CSS Modules for all SASS files not in resources or global
          {
            test: /\.(scss|sass)$/,
            use: [
              'style-loader',
              sharedConfig.cssLoader,
              sharedConfig.postcssLoader,
              'sass-loader',
              sharedConfig.sassResourcesLoader
            ]
          },
          sharedConfig.fileLoader
        ]
      }
    ]
  },
  plugins: [
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml
    }),
    // Makes some environment variables available in index.html.
    // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In development, this will be an empty string.
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
    new webpack.DefinePlugin(env.stringified),
    // To strip all locales except “en”
    new MomentLocalesPlugin(),
    // Required for hylo-shared package, but ideally would be handled by
    // the package build itself
    new webpack.IgnorePlugin({ resourceRegExp: /jsdom$/ })
  ],
  // Turn off performance hints during development because we don't do any
  // splitting or minification in interest of speed. These warnings become
  // cumbersome.
  performance: {
    hints: false
  },
  // Add the following Webpack 5 specific configurations
  target: 'web',
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  },
  optimization: {
    moduleIds: 'named',
    chunkIds: 'named'
  }
}
