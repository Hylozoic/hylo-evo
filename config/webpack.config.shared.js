const { appSrc } = require('./paths')

module.exports = {
  cssLoader: {
    loader: 'css-loader',
    options: {
      modules: true,
      localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
      importLoaders: 3
    }
  },
  postcssLoader: {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
      plugins: () => [
        require('autoprefixer')({
          browsers: [
            '>1%',
            'last 4 versions',
            'Firefox ESR',
            'not ie < 9' // React doesn't support IE8 anyway
          ]
        })
      ]
    }
  },
  sassResourcesLoader: {
    loader: 'sass-resources-loader',
    options: {
      // LEJ: Define global SASS variables in the files specified here
      // for preloading by the sass-resources loader. The explicit
      // load order is on purpose.
      resources: [
        appSrc + '/css/global/_sass_resources.scss',
        appSrc + '/routes/UIKit/css/_sass_resources.scss'
      ]
    }
  }
}
