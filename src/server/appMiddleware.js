import { serverRouter } from 'router'
import { renderToString } from 'react-dom/server'
import { readFileSync } from 'fs'
import root from 'root-path'
import { once } from 'lodash'

export default function appMiddleware (req, res, next) {
  // TODO: async data loading

  const context = {}
  const markup = renderToString(serverRouter(req, context))

  // context may now have been mutated; check its values and redirect,
  // show an error, etc. as appropriate
  // https://reacttraining.com/react-router/web/guides/server-rendering

  return res.status(200).send(html(markup))
}

// this is set up as a property to make it easy to mock in tests
appMiddleware.getIndexFile = once(() => {
  const indexPath = root('build/index.html')
  return readFileSync(indexPath, {encoding: 'utf-8'})
})


function html (markup) {
  const newRoot = `<div id="root">${markup}</div>`
  return appMiddleware.getIndexFile().replace('<div id="root"></div>', newRoot)
}
