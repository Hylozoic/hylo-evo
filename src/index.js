import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { clientRouter } from './router'
import store from './store'
import './client/websockets'

ReactDOM.render(
  <Provider store={store}>{ clientRouter() }</Provider>,
  document.getElementById('root')
)
