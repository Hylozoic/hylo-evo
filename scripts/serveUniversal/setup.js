// this file sets up an environment that allows us to do server-side rendering
// without webpack.

import { join } from 'path'
import { addPath } from 'app-module-path'
import scss from 'postcss-scss'
import cssHook from 'css-modules-require-hook'
import { once } from 'lodash/fp'
import root from 'root-path'
const paths = require(root('config/paths'))

const startTime = new Date().getTime()
export default startTime

// allow files to require or import paths that are relative to src/ (duplicate
// the effect of resolve.modules in webpack config)
addPath(join(__dirname, '../../src'))

// allow files to require or import paths that are relative to src/ (duplicate
// the effect of resolve.modules in webpack config)
addPath(join(__dirname, '../../src'))

const sharedConfig = require(root('config/webpack.config.shared'))

// add a header to each css file that gets imported, to mimic the behavior of
// sass-resources-loader
const cssHeader = once(() => {
  const { resources } = sharedConfig.sassResourcesLoader.options
  return resources.map(path => `@import "${path}";`).join('\n') + `\n`
})

// handle CSS imports and generate class names the same way that webpack does
cssHook({
  extensions: ['.css', '.scss'],
  generateScopedName: sharedConfig.cssLoader.options.localIdentName,
  preprocessCss: css => cssHeader() + css,
  processorOpts: {parser: scss.parse}
})
