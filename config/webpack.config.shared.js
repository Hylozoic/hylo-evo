const paths = require('./paths')

module.exports = {
  tsLoader: {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    loader: 'ts-loader'
  },
  graphqlLoader: {
    test: /\.(graphql|gql)$/,
    exclude: /node_modules/,
    loader: 'graphql-tag/loader'
  },
  cssLoader: {
    loader: 'css-loader',
    options: {
      modules: true,
      context: paths.rootPath,
      localIdentName: '[name]__[local]___[hash:base64:5]',
      importLoaders: 3
    }
  },
  postcssLoader: {
    loader: 'postcss-loader',
    options: {
      config: {
        path: paths.config
      }
    }
  },
  sassResourcesLoader: {
    loader: 'sass-resources-loader',
    options: {
      // * Define global SASS variables in the files specified here
      // for preloading by the sass-resources loader. The explicit
      // load order is on purpose.
      resources: [paths.appSrc + '/css/global/_sass_resources.scss']
    }
  },
  fileLoader: {
    test: /\.(ttf|eot|woff|woff2|svg)$/,
    loader: 'file-loader'
  }
}
