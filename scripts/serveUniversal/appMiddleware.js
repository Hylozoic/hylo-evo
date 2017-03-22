import React from 'react'
import { StaticRouter } from 'react-router'
import routes from 'routes'
import { renderToString } from 'react-dom/server'
import { readFileSync } from 'fs'
import root from 'root-path'

export default function appMiddleware (req, res, next) {
  // TODO: async data loading

  const context = {}
  const app = <StaticRouter location={req.url} context={context}>
    {routes}
  </StaticRouter>

  const markup = renderToString(app)

  // context may now have been mutated; check its values and redirect,
  // show an error, etc. as appropriate
  // https://reacttraining.com/react-router/web/guides/server-rendering

  return res.status(200).send(html(markup))
}

const indexPath = root('build/index.html')
const indexFile = readFileSync(indexPath, {encoding: 'utf-8'})

function html (markup) {
  const newRoot = `<div id="root">${markup}</div>`
  return indexFile.replace('<div id="root"></div>', newRoot)
}
