import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import {
  renderToString
} from 'react-dom/server';
import {
  createIsomorphicWebpack
} from 'isomorphic-webpack';
import webpackConfiguration from '../config/webpack.config.prod.js';
// import React from 'react'
// import { match, RouterContext } from 'react-router'
// import routes from '../src'

const compiler = webpack(webpackConfiguration);

const {
  createCompilationPromise,
  evalCode,
  evalBundleCode,
  formatErrorStack
} = createIsomorphicWebpack(webpackConfiguration, {
  useCompilationPromise: true,
  nodeExternalsWhitelist: [
    /^react\-router/,
    /^history/
  ]
});

const app = express();

app.use(webpackDevMiddleware(compiler, {
  noInfo: false,
  publicPath: '/static',
  quiet: false,
  stats: 'minimal'
}));

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
  `;
};

app.get('/*', (req, res) => {
  evalCode(req.protocol + '://' + req.get('host') + req.originalUrl);
  const appBody = renderToString(require('../src/index.js').default);
  res.send(renderFullPage(appBody));

  //   match({ routes, location: req.url }, (err, redirect, props) => {
  //   if (err) {
  //     // there was an error somewhere during route matching
  //     res.status(500).send(err.message)
  //   } else {
  //     // `RouterContext` is what the `Router` renders. `Router` keeps these
  //     // `props` in its state as it listens to `browserHistory`. But on the
  //     // server our app is stateless, so we need to use `match` to
  //     // get these props before rendering.
  //     const appBody = renderToString(<RouterContext {...props} />)
  //     // dump the HTML into a template, lots of ways to do this, but none are
  //     // really influenced by React Router, so we're just using a little
  //     // function, `renderPage`
  //     res.send(renderFullPage(appBody))
  //   }
  // })
});

app.listen(8000);


// import express from 'express';
// import webpack from 'webpack';
// import webpackDevMiddleware from 'webpack-dev-middleware';
// import {
//   createIsomorphicWebpack
// } from 'isomorphic-webpack';
// import {
//   renderToString
// } from 'react-dom/server';
// import webpackConfiguration from '../config/webpack.config.prod.js';
//
// const compiler = webpack(webpackConfiguration);
//
// const app = express();
//
// app.use(webpackDevMiddleware(compiler, {
//   noInfo: false,
//   publicPath: '/public',
//   quiet: false,
//   stats: {
//     assets: false,
//     chunkModules: false,
//     chunks: false,
//     colors: true,
//     hash: false,
//     timings: false,
//     version: false
//   }
// }));
//
// const {
//   createCompilationPromise,
//   evalCode,
//   evalBundleCode,
//   formatErrorStack
// } = createIsomorphicWebpack(webpackConfiguration, {
//   useCompilationPromise: true,
//   nodeExternalsWhitelist: [
//     /^react\-router/,
//     /^history/
//   ]
// });
//
//
// app.use(async (req, res, next) => {
//   await createCompilationPromise();
//
//   next();
// });
//
//
// app.get('/*', (req, res) => {
//   evalCode(req.protocol + '://' + req.get('host') + req.originalUrl);
//   const appBody = renderToString(require('../src/index.js').default);
//   res.send(renderFullPage(appBody));
// });
//
// app.use((err, req, res, next) => {
//   console.error(formatErrorStack(err.stack));
// });
//
//
// // const renderFullPage = (body) => {
// //   // eslint-disable-next-line no-restricted-syntax
// //   return `
// //   <!doctype html>
// //   <html>
// //     <head></head>
// //     <body>
// //       <div id='app'>${body}</div>
// //
// //       <script src='/static/app.js'></script>
// //     </body>
// //   </html>
// //   `;
// // };
// //
// // app.get('/', (req, res) => {
// //   const requestUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
// //
// //   const app = renderToString(evalBundleCode(requestUrl).default);
// //
// //   res.send(renderFullPage(app));
// // });
//
// app.listen(8000);
//
//
//
//
//
//
//
//
//
//
//
//
