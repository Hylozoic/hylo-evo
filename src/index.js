import React from 'react'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'
import { BrowserRouter } from 'react-router-dom'
import routes from './routes'

const router = <BrowserRouter>{routes}</BrowserRouter>

let output = router

if (typeof ISOMORPHIC_WEBPACK === 'undefined') {
  output = ReactDOMServer.renderToString(router)
  // ReactDOM.render(router, document.getElementById('root'))
} else {
  output = ReactDOMServer.renderToString(router)
}

export default output
