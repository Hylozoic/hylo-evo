import { getBrowserSnippet } from './newrelic' // this must be first
import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import { createMemoryHistory } from 'history'
import { StaticRouter } from 'react-router'
import root from 'root-path'
import { readFileSync } from 'fs'
import { once } from 'lodash'
import createStore from '../store'
import RootRouter from 'routes/RootRouter'

/*

Server-side Rendering Configuration

Doesn't do much for us currently, ref:
https://github.com/Hylozoic/hylo-evo/issues/1069

* To remove simply eliminate the  `renderToString` setup below,
and change the last line of this function to be:

`return res.status(200).send(html(''))`

* The NewRelic setup could be revisited.

*/
export default function appMiddleware (req, res, next) {
  // Note: Add async data loading here for more effective SSR
  const store = createStore(createMemoryHistory())
  const context = {}
  const markup = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={context}>
        <RootRouter />
      </StaticRouter>
    </Provider>
  )

  /*

  Context may now have been mutated; check its values and redirect,
  show an error, etc. as appropriate, ref:
  https://v5.reactrouter.com/web/guides/server-rendering

  */

  return res.status(200).send(html(markup))
}

// A property to make it easy to mock in tests
appMiddleware.getIndexFile = once(() => {
  const indexPath = root('build/index.html')
  return readFileSync(indexPath, { encoding: 'utf-8' })
})

function html (markup) {
  const newRoot = `<div id="root">${markup}</div>`
  return appMiddleware.getIndexFile()
    .replace('<script id="newrelic"></script>', getBrowserSnippet())
    .replace('<div id="root"></div>', newRoot)
}
