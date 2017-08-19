import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import mobileRedirect from 'util/mobileRedirect'
import { clientRouter } from './router'
import createHistory from 'history/createBrowserHistory'
import createStore from './store'
import './client/websockets'

const history = createHistory()
const store = createStore(history)

const redirecting = process.env.REDIRECT_TO_APP_STORE && mobileRedirect()

console.log('!!! test of basic console logging')

if (!redirecting) {
  ReactDOM.render(
    <Provider store={store}>{ clientRouter(history) }</Provider>,
    document.getElementById('root')
  )
}
