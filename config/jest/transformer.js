const paths = require('../paths')

module.exports = require('babel-jest').createTransformer(
  require(paths.babelConfigFile)()
)
