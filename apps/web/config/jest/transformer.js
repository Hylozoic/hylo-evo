module.exports = require('babel-jest').default.createTransformer(
  require(require('../paths').babelConfigFile)()
)
