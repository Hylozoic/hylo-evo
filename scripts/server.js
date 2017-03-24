import express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import { createIsomorphicWebpack } from 'isomorphic-webpack'
import ReactDOMServer from 'react-dom/server'
import webpackConfiguration from '../config/webpack.config.prod.js'

const app = express()

const compiler = webpack(webpackConfiguration)

app.use(webpackDevMiddleware(compiler, {
  noInfo: false,
  publicPath: '/static',
  quiet: false,
  stats: 'minimal'
}))

const renderFullPage = (body) => {
  return `
  <!doctype html>
  <html>
    <head></head>
    <body>
      <div id='root'>${body}</div>
      <script src='/static/app.js'></script>
    </body>
  </html>
  `
}

// With isomorphic-webpack
//
const { evalBundleCode } = createIsomorphicWebpack(webpackConfiguration, {
  // useCompilationPromise: true,
  nodeExternalsWhitelist: [
    /^bootstrap/, // eslint-disable-line
    /^react\-router/, // eslint-disable-line
    /^history/
  ]
})

app.get('/*', (req, res) => {
  const requestUrl = req.protocol + '://' + req.get('host') + req.originalUrl
  const myApp = ReactDOMServer.renderToString(evalBundleCode(requestUrl).default)
  res.status(200).send(renderFullPage(myApp))
})

app.listen(8000)
