const path = require('path');
const hyloWebpackConfig = require('../config/webpack.config.dev')

module.exports = async ({ config, mode }) => {
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
  console.log('1!!!', mergedConfig)
  return mergedConfig
}
