const path = require('path');
// your app's webpack.config.js
const hyloWebpackConfig = require('../config/webpack.config.dev')

module.exports = async ({ config, mode }) => {
  return { ...config, module: { ...config.module, rules: hyloWebpackConfig.module.rules } };
};