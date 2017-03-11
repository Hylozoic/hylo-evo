import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import {
  renderToString
} from 'react-dom/server';
import {
  createIsomorphicWebpack
} from 'isomorphic-webpack';
import webpackConfiguration from './webpack.configuration';
import React from 'react'
import { match, RouterContext } from 'react-router'
import routes from './app';

const compiler = webpack(webpackConfiguration);

const { evalBundleCode } = createIsomorphicWebpack(webpackConfiguration, {
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
  match({ routes, location: req.url }, (err, redirect, props) => {
    if (err) {
      // there was an error somewhere during route matching
      res.status(500).send(err.message)
    } else {
      // `RouterContext` is what the `Router` renders. `Router` keeps these
      // `props` in its state as it listens to `browserHistory`. But on the
      // server our app is stateless, so we need to use `match` to
      // get these props before rendering.
      const appBody = renderToString(<RouterContext {...props} />)
      // dump the HTML into a template, lots of ways to do this, but none are
      // really influenced by React Router, so we're just using a little
      // function, `renderPage`
      res.send(renderFullPage(appBody))
    }
  })
});

app.listen(8000);
