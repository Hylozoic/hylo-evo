import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
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
    <DndProvider backend={HTML5Backend}>
      <Provider store={store}>
        {clientRouter()}
      </Provider>
    </DndProvider>
  </LayoutFlagsProvider>,
  document.getElementById(rootDomId)
)
