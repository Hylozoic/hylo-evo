// this file sets up an environment that allows us to do server-side rendering
// without webpack.

import { join } from 'path'
import { addPath } from 'app-module-path'
import scss from 'postcss-scss'
import nested from 'postcss-nested'
import cssHook from 'css-modules-require-hook'
import root from 'root-path'

const startTime = new Date().getTime()
export default startTime

// allow files to require or import paths that are relative to src/ (duplicate
// the effect of resolve.modules in webpack config)
addPath(join(__dirname, '../../src'))

const sharedConfig = require(root('config/webpack.config.shared'))

// handle CSS imports and generate class names the same way that webpack does
cssHook({
  extensions: ['.css', '.scss'],
  generateScopedName: sharedConfig.cssLoader.options.localIdentName,
  processorOpts: {parser: scss.parse},
  prepend: [nested]
})
