import React from 'react'
import { ConnectedRouter } from 'connected-react-router'
import { Provider } from 'react-redux'
import { LayoutFlagsProvider } from 'contexts/LayoutFlagsContext'
import isWebView from 'util/webView'
import createStore, { history } from '../store'
import RootRouter from 'routes/RootRouter'

const store = createStore()

if (isWebView()) {
  window.ReactNativeWebView.reactRouterHistory = history
}

export default function App () {
  require('client/rollbar') // set up handling of uncaught errors

  return (
    <LayoutFlagsProvider>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <RootRouter />
        </ConnectedRouter>
      </Provider>
    </LayoutFlagsProvider>
  )
}
