const path = require('path');
const hyloWebpackConfig = require('../config/webpack.config.dev')

// Building using dev webpack config, but may need to make work with prod config
module.exports = async ({ config }) => {
  const mergedConfig = {
    ...config,
    resolve: {
      ...config.resolve,
      modules: [
        ...hyloWebpackConfig.resolve.modules,
        ...config.resolve.modules
      ]
    },
    module: {
      ...config.module,
      rules: hyloWebpackConfig.module.rules
    }
  }

  return mergedConfig
}
