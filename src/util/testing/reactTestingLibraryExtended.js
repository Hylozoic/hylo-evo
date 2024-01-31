import React from 'react'
import { MemoryRouter } from 'react-router'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { render } from '@testing-library/react'
import createRootReducer from 'store/reducers'
import createMiddleware from 'store/middleware'
import { history, getEmptyState } from 'store'
import { LayoutFlagsProvider } from 'contexts/LayoutFlagsContext'

// Note: This is ran by default via `customRender` below, but it's necessary to manually
// generate the store when pre-populating the ReduxORM in a test. Search across tests to
// for examples. Merges `provideState` over default app empty state
export function generateStore (providedState, providedHistory = history) {
  return createStore(
    createRootReducer(providedHistory),
    { ...getEmptyState(), ...providedState },
    createMiddleware(providedHistory)
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
      <Provider store={generateStore(providedState)}>
        <MemoryRouter>
          {children}
        </MemoryRouter>
      </Provider>
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
