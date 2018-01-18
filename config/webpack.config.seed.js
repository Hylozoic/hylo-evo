const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack')

var path = require('path')

module.exports = {
  target: 'node',
  entry: [
    './scripts/seed/index.js'
  ],
  output: {
    path: path.resolve(__dirname, '..', 'scripts', 'seed'),
    filename: 'bundle.js'
  },
  resolve: {
    // NOTE: fixes issue with yarn link and peerDependencies
    // https://github.com/webpack/webpack/issues/985#issuecomment-261497772
    symlinks: false,
    modules: [
      path.resolve(__dirname, '..', 'src')
    ],
    extensions: [ '.js' ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, '..', 'src'),
        exclude: /^bundle.js$/,
        loader: 'babel-loader',
        options: {
          // This is a feature of `babel-loader` for webpack (not Babel itself).
          // It enables caching results in ./node_modules/.cache/babel-loader/
          // directory for faster rebuilds.
          cacheDirectory: false
        }
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      API_URI: "'http://localhost:3001'",
      GRAPHQL_URI: "'http://localhost:3001/noo/graphql'",

      // These values can be altered to suit. Remember, the seed process might
      // be quite slow with large numbers since it's one API request at a time.

      // Chance a user will create a community. Multiply this by total users
      // for an idea of how many communities you'll get.
      USER_COMMUNITY_CHANCE: 0.3,

      // Total users
      USER_COUNT: 10
    })
  ],

  node: {
    dirname: true
  },

  externals: [ nodeExternals() ],

  stats: {
    hash: false,
    version: false,
    timings: false,
    assets: false,
    modules: false,
    warnings: false
  }
}
