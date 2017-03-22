// this file sets up an environment that allows us to do server-side rendering
// without webpack.

import { join } from 'path'
import { addPath } from 'app-module-path'
import cssHook from 'css-modules-require-hook'
import { compact, flatten, flow, map, once } from 'lodash/fp'
import sass from 'node-sass'
import paths from '../../config/paths'

const startTime = new Date().getTime()
export default startTime

// allow files to require or import paths that are relative to src/ (duplicate
// the effect of resolve.modules in webpack config)
addPath(join(__dirname, '../../src'))

// load webpack config
const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
const webpackConfig = require(`../../config/webpack.config.${env}`)

// add a header to each css file that gets imported. this does two things:
// 1. reproduces the behavior of sass-resources-loader
// 2. sets the global Sass variable $bootstrap-path to an absolute path, because
//    it is used with `composes` and
const cssHeader = once(() => {
  const sassResourcesLoader = findLoader('sass-resources')
  const { resources } = sassResourcesLoader.options
  return resources.map(path => `@import "${path}";`).join('\n') +
  `\n$bootstrap-path: '${paths.appSrc}/css/bootstrap.scss';\n`
})

// handle CSS imports and generate class names the same way that webpack does
cssHook({
  extensions: ['.css', '.scss'],
  generateScopedName: findLoader('css').options.localIdentName,
  preprocessCss: (css, filename) =>
    sass.renderSync({
      file: filename,
      data: cssHeader() + css,
      includePaths: [paths.appSrc]
    }).css
})

function findLoader (name) {
  const loaders = flow(
    map(x => [x.loader ? x : null].concat(x.use)),
    flatten,
    compact
  )(webpackConfig.module.rules)

  return loaders.find(x => x.loader === name || x.loader === name + '-loader')
}
