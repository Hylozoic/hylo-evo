import React from 'react'
import { ConnectedRouter } from 'connected-react-router'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Provider } from 'react-redux'
import { LayoutFlagsProvider } from 'contexts/LayoutFlagsContext'
import createStore, { history } from '../store'
import RootRouter from 'routes/RootRouter'

const store = createStore()

export default function App () {
  require('client/rollbar') // set up handling of uncaught errors

  return (
    <LayoutFlagsProvider>
      <DndProvider backend={HTML5Backend}>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <RootRouter />
          </ConnectedRouter>
        </Provider>
      </DndProvider>
    </LayoutFlagsProvider>
  )
}
