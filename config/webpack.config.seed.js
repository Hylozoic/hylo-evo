const path = require('path')
const webpack = require('webpack')
const webpackNodeExternals = require('webpack-node-externals')

module.exports = {
  target: 'node',

  entry: './scripts/seed/index.js',

  output: {
    path: path.resolve(__dirname, '../scripts/seed/'),
    filename: 'bundle.js'
  },

  resolve: {
    modules: [
      path.resolve(__dirname, '../src/'),
      'node_modules'
    ],
    extensions: [ '.js' ]
  },

  externals: [ webpackNodeExternals() ],

  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, '../src/'),
        exclude: /^bundle.js$/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: false
        }
      }
    ]
  },

  node: {
    __dirname: false
  },

  plugins: [
    new webpack.DefinePlugin({
      API_URI: "'http://localhost:3001'",
      GRAPHQL_URI: "'http://localhost:3001/noo/graphql'",

      // These values can be altered to suit. Remember, the seed process might
      // be quite slow with large numbers since it's one API request at a time.

      // Sample size of total users to put in each community
      MEMBER_COUNT: 5,

      // Posts to generate per member per community (so if your MEMBER_COUNT is
      // 20, a POST_COUNT of 5 will give you 100 posts per community). With
      // more than 10 communities this can get slow!
      POST_COUNT: 3,

      // Chance a user will create a community. Multiply this by total users
      // for an idea of how many communities you'll get.
      USER_COMMUNITY_CHANCE: 0.3,

      // Total users
      USER_COUNT: 10
    })
  ],

  stats: {
    assets: false,
    hash: false,
    modules: false,
    timings: false,
    version: false
  }
}
