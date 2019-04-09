import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { clientRouter } from './router'
import { createBrowserHistory } from 'history'
import createStore from './store'
import './client/websockets'
import { rootDomId } from 'client/util'

const history = createBrowserHistory()
const store = createStore(history)

ReactDOM.render(
  <Provider store={store}>
    { clientRouter(history) }
  </Provider>,
  document.getElementById(rootDomId)
)
