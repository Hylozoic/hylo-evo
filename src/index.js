import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { clientRouter, history } from './router'
import createStore from './store'
import './client/websockets'
import { rootDomId } from 'client/util'

const store = createStore(history)

ReactDOM.render(
  <Provider store={store}>
    { clientRouter() }
  </Provider>,
  document.getElementById(rootDomId)
)
