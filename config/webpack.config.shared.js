var paths = require('./paths')

module.exports = {
  cssLoader: {
    loader: 'css-loader',
    options: {
      modules: true,
      localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
      importLoaders: 3
    }
  },
  sassResourcesLoader: {
    loader: 'sass-resources-loader',
    options: {
      // LEJ: Define global SASS variables in the files specified here
      // for preloading by the sass-resources loader. The explicit
      // load order is on purpose.
      resources: [
        paths.appSrc + '/css/sass-resources/_app.scss',
        paths.appSrc + '/css/sass-resources/_bootstrap-customization.scss',
        paths.appSrc + '/routes/UIKit/css/_sass_resources.scss'
      ]
    }
  }
}
