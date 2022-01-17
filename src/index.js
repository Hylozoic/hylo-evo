import { CookiesProvider } from 'react-cookie'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { rootDomId } from 'client/util'
import './client/websockets'
import { LayoutFlagsProvider } from 'contexts/LayoutFlagsContext'
import { clientRouter, history } from './router'
import createStore from './store'

const store = createStore(history)

ReactDOM.render(
  <LayoutFlagsProvider>
    <CookiesProvider>
      <Provider store={store}>
        { clientRouter() }
      </Provider>
    </CookiesProvider>
  </LayoutFlagsProvider>,
  document.getElementById(rootDomId)
)
