import React from 'react'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'
import { Provider } from 'react-redux'

import router from './router'
import store from './store'

let output

if (typeof ISOMORPHIC_WEBPACK === 'undefined') {
  ReactDOM.render(
    <Provider store={store}>{ router }</Provider>,
    document.getElementById('root')
  )
} else {
  output = ReactDOMServer.renderToString(
    <Provider store={store}>{ router }</Provider>
  )
}

export default output
