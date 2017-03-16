import express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import { createIsomorphicWebpack } from 'isomorphic-webpack'
import webpackConfiguration from './webpack.config.prod'

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

const { evalBundleCode } = createIsomorphicWebpack(webpackConfiguration, {
  nodeExternalsWhitelist: [
    /^react\-router/, // eslint-disable-line
    /^history/
  ]
})

app.get('/*', (req, res) => {
  const requestUrl = req.protocol + '://' + req.get('host') + req.originalUrl
  const myApp = evalBundleCode(requestUrl).default
  res.status(200).send(renderFullPage(myApp))
})

app.listen(8000)
