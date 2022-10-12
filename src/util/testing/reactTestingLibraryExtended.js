import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { MemoryRouter } from 'react-router'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { render } from '@testing-library/react'
import { history } from 'router'
import rootReducer from 'store/reducers'
import createMiddleware from 'store/middleware'
import { getEmptyState } from 'store'
import { LayoutFlagsProvider } from 'contexts/LayoutFlagsContext'

// Note: This is ran by default via `customRender` below, but it's necessary to manually
// generate the store when pre-populating the ReduxORM in a test. Search across tests to
// for examples. Merges `provideState` over default app empty state
export function generateStore (providedState, providedHistory) {
  return createStore(
    rootReducer,
    { ...getEmptyState(), ...providedState },
    createMiddleware(providedHistory || history)
  )
}

// This is used by default with an empty state in `customRender` (exported as render)
// import and use this directly, providing state, when needing custom state, e.g.:
//
//   `render(<ComponentUnderTest />, { wrapper: AllTheProvieders(myOwnReduxState) }) />)`
//
export const AllTheProviders = providedState => ({ children }) => {
  return (
    <LayoutFlagsProvider>
      <DndProvider backend={HTML5Backend}>
        <Provider store={generateStore(providedState)}>
          <MemoryRouter>
            {children}
          </MemoryRouter>
        </Provider>
      </DndProvider>
    </LayoutFlagsProvider>
  )
}

// Creates the `<div id='root'>`
export function createRootContainer () {
  const rootElement = document.createElement('div')
  rootElement.setAttribute('id', 'root')
  return document.body.appendChild(rootElement)
}

// If an initialized but empty store is adequate then no providerFunc needs to be supplied
const customRender = (ui, options, providersFunc) =>
  render(ui, {
    wrapper: providersFunc || AllTheProviders(),
    container: createRootContainer(),
    ...options
  })

// re-export everything

/* eslint-disable import/export */
export * from '@testing-library/react'

// override render method
export { customRender as render }
