const paths = require('./paths')

module.exports = {
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
      // LEJ: Define global SASS variables in the files specified here
      // for preloading by the sass-resources loader. The explicit
      // load order is on purpose.
      resources: [paths.appSrc + '/css/global/_sass_resources.scss']
    }
  }
}
