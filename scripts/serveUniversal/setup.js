// this file sets up an environment that allows us to do server-side rendering
// without webpack.

import { join } from 'path'
import { addPath } from 'app-module-path'

const startTime = new Date().getTime()
export default startTime

// allow files to require or import paths that are relative to src/ (duplicate
// the effect of resolve.modules in webpack config)
addPath(join(__dirname, '../../src'))

function scratchpad () {
  // to be added to a fork of babel-plugin-react-css-modules
  function preprocess (file, data) {
    console.log('preprocessing ' + file)
    const sass = require('node-sass')
    const root = require('root-path')
    const sharedConfig = require(root('config/webpack.config.shared'))
    const paths = require(root('config/paths'))

    function cssHeader () {
      const { resources } = sharedConfig.sassResourcesLoader.options
      return resources.map(path => `@import "${path}";`).join('\n') +
      `\n$bootstrap-path: '${paths.appSrc}/css/bootstrap.scss';\n`
    }

    return sass.renderSync({
      file,
      data: cssHeader() + data,
      includePaths: [paths.appSrc]
    }).css
  }
  const text = (0, _fs.readFileSync)(cssSourceFilePath, 'utf-8');
  const lazyResult = runner.process(preprocess(cssSourceFilePath, text), options);
}
