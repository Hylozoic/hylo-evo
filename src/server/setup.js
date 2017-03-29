// this file sets up an environment that allows us to do server-side rendering
// without webpack.

import dotenv from 'dotenv-safe'
import { join } from 'path'
import { addPath } from 'app-module-path'
import scss from 'postcss-scss'
import nested from 'postcss-nested'
import resolvePath from 'postcss-modules-resolve-path'
import cssHook from 'css-modules-require-hook'
import root from 'root-path'

const startTime = new Date().getTime()
export default startTime

dotenv.load()
const { appSrc } = require(root('config/paths'))

// allow files to require or import paths that are relative to src/ (duplicate
// the effect of resolve.modules in webpack config)
addPath(appSrc)

const sharedConfig = require(root('config/webpack.config.shared'))
const { babel } = require(root('package.json'))
const cssModulesConfig = babel.plugins.find(x => x[0] === 'react-css-modules')[1]

// handle CSS imports and generate class names the same way that webpack does
cssHook({
  extensions: ['.css', '.scss'],
  generateScopedName: sharedConfig.cssLoader.options.localIdentName,
  processorOpts: {parser: scss.parse},
  prepend: [
    nested,
    resolvePath({
      paths: cssModulesConfig.searchPaths.map(x => root(x))
    })
  ]
})
