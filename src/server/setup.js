// this file sets up an environment that allows us to do server-side rendering
// without webpack.

import { join } from 'path'
import dotenv from 'dotenv-safe'
import { addPath } from 'app-module-path'
import postcssScss from 'postcss-scss'
import postcssNested from 'postcss-nested'
import postcssModulesResolvePath from 'postcss-modules-resolve-path'
import cssModulesRequireHook from 'css-modules-require-hook'
import rootPath from 'root-path'

const startTime = new Date().getTime()

export default startTime

dotenv.load()

// This allows files to require or import paths that are relative to src/,
// duplicating the effect of resolve.modules in the webpack config.
//
// We have to pass a relative path as an argument here, because when this app is
// transpiled by Babel for production, the ES5 output is placed into a different
// directory from the original source. So we have to make sure that whether this
// is the original or transpiled file, it sets up require/import for its
// matching source tree.
addPath(join(__dirname, '..'))

// Configuration files are already ES5 so they doesn't get transpiled or copied
// anywhere. We can always require them relative to the app's root path.
const { resolveApp, babelConfigFile } = require(rootPath('config/paths'))
const sharedConfig = require(rootPath('config/webpack.config.shared'))
const cssModulesConfig = require(babelConfigFile)()
  .env
  .production
  .plugins.find(x => x[0] === 'react-css-modules')[1]

// handle CSS imports and generate class names the same way that webpack does
cssModulesRequireHook({
  extensions: ['.css', '.scss'],
  generateScopedName: sharedConfig.cssLoader.options.localIdentName,
  processorOpts: {
    parser: postcssScss.parse
  },
  prepend: [
    postcssNested,
    postcssModulesResolvePath({
      paths: cssModulesConfig.searchPaths.map(resolveApp)
    })
  ]
})
