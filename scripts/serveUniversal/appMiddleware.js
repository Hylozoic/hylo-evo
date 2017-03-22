import React from 'react'
import { StaticRouter } from 'react-router'
import routes from 'routes'
import { renderToString } from 'react-dom/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export default function appMiddleware (req, res, next) {
  const app = <StaticRouter location={req.url} context={{}}>
    {routes}
  </StaticRouter>

  return res.status(200).send(html(app))
}

const indexPath = join(__dirname, '../../build/index.html')
const indexFile = readFileSync(indexPath, {encoding: 'utf-8'})

function html (app) {
  const newRoot = '<div id="root">' + renderToString(app) + '</div>'
  return indexFile.replace('<div id="root"></div>', newRoot)
}
