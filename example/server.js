import express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import { createIsomorphicWebpack } from 'isomorphic-webpack'
import webpackConfiguration from './webpack.configuration'

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
    /^react\-router/, // eslint-disable-line
    /^history/
  ]
})

app.get('/*', (req, res) => {
  //  ReactDOM.render(router, document.getElementById('root'))
  const requestUrl = req.protocol + '://' + req.get('host') + req.originalUrl
  const myApp = evalBundleCode(requestUrl).default
  res.status(200).send(renderFullPage(myApp))
})

app.listen(8000)

//   // Evaluated in browser context:
// // Issues with NPM history "Cannot read property 'getCurrentLocation' of undefined" https://github.com/ReactTraining/history/issues/402
// evalBundleCode(req.protocol + '://' + req.get('host') + '#' + req.originalUrl)
// const appBody = renderToString(require('./app').default)
// res.send(renderFullPage(appBody))


// const requestUrl = req.protocol + '://' + req.get('host') + req.originalUrl
// const myApp = ReactDOMServer.renderToString(evalBundleCode(requestUrl).default)
// res.status(200).send(renderFullPage(myApp))

// Without isomorphic-webpack
//
// import React from 'react'
// import { match, RouterContext } from 'react-router'
// import routes from './app'

// app.get('/*', (req, res) => {
//   match({ routes, location: req.url }, (err, redirect, props) => {
//     if (err) {
//       // there was an error somewhere during route matching
//       res.status(500).send(err.message)
//     } else {
//       // `RouterContext` is what the `Router` renders. `Router` keeps these
//       // `props` in its state as it listens to `browserHistory`. But on the
//       // server our app is stateless, so we need to use `match` to
//       // get these props before rendering.
//       const appBody = renderToString(<RouterContext {...props} />)
//       // dump the HTML into a template, lots of ways to do this, but none are
//       // really influenced by React Router, so we're just using a little
//       // function, `renderPage`
//       res.send(renderFullPage(appBody))
//     }
//   })
// })
