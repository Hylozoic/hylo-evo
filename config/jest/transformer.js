module.exports = require('babel-jest').createTransformer(
  require(require('../paths').babelConfigFile)()
)
