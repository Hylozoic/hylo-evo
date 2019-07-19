const prodConfig = require('./webpack.config.prod')
const paths = require('./paths')

// Holochain specifics for build
prodConfig.output.path = process.env['HOLOCHAIN_BUILD_PATH'] || paths.hcBuild

module.exports = prodConfig
