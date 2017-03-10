import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import {
  createIsomorphicWebpack
} from 'isomorphic-webpack';
import {
  renderToString
} from 'react-dom/server';
import webpackConfiguration from '../config/webpack.config.prod.js';

const compiler = webpack(webpackConfiguration);

const app = express();

app.use(webpackDevMiddleware(compiler, {
  noInfo: false,
  publicPath: '/static',
  quiet: false,
  stats: {
    assets: false,
    chunkModules: false,
    chunks: false,
    colors: true,
    hash: false,
    timings: false,
    version: false
  }
}));

const {
  createCompilationPromise,
  evalBundleCode
} = createIsomorphicWebpack(webpackConfiguration, {
  useCompilationPromise: true,
  nodeExternalsWhitelist: [
    /^react\-router/,
    /^history/
  ]
});

app.use(async (req, res, next) => {
  await createCompilationPromise();

  next();
});

const {
  evalCode
} = createIsomorphicWebpack(webpackConfiguration, {
  nodeExternalsWhitelist: [
    /^react\-router/,
    /^history/
  ]
});

app.get('/*', (req, res) => {
  evalCode(req.protocol + '://' + req.get('host') + req.originalUrl);
  const appBody = renderToString(require('../src/index.js').default);
  res.send(renderFullPage(appBody));
});



// const renderFullPage = (body) => {
//   // eslint-disable-next-line no-restricted-syntax
//   return `
//   <!doctype html>
//   <html>
//     <head></head>
//     <body>
//       <div id='app'>${body}</div>
//
//       <script src='/static/app.js'></script>
//     </body>
//   </html>
//   `;
// };
//
// app.get('/', (req, res) => {
//   const requestUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
//
//   const app = renderToString(evalBundleCode(requestUrl).default);
//
//   res.send(renderFullPage(app));
// });

app.listen(8000);
