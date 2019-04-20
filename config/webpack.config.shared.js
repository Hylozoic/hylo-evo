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
      ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
      plugins: () => [
        require('postcss-flexbugs-fixes'),
        require('postcss-preset-env')({
          autoprefixer: {
            flexbox: 'no-2009'
          },
          stage: 3
        }),
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
      resources: [paths.appSrc + '/css/global/_sass_resources.scss']
    }
  }
}
