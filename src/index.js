import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { clientRouter } from './router'
import createHistory from 'history/createBrowserHistory'
import createStore from './store'
import './client/websockets'
import { rootDomId } from 'client/util'

const history = createHistory()
const store = createStore(history)

ReactDOM.render(
  <Provider store={store}>
    { clientRouter(history) }
  </Provider>,
  document.getElementById(rootDomId)
)
