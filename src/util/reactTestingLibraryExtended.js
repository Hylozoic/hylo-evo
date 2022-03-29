import React from 'react'
import { MemoryRouter } from 'react-router'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { render } from '@testing-library/react'
import { history } from 'router'
import rootReducer from 'store/reducers'
import createMiddleware from 'store/middleware'
import { getEmptyState } from 'store'

// Note: This is ran by default via `customRender` below, but it's necessary to manually
// generate the store when pre-populating the ReduxORM in a test. Search across tests to
// for examples.
export function generateStore (initialState, providedHistory) {
  return createStore(rootReducer, initialState || getEmptyState(), createMiddleware(providedHistory || history))
}

// This is used by default with an empty state in `customRender` (exported as render)
// import and use this directly, providing state, when needing custom state, e.g.:
//
//   `render(<ComponentUnderTest />, { wrapper: AllTheProvieders(myOwnReduxState) }) />)`
//
export const AllTheProviders = providedState => ({ children }) => {
  return (
    <Provider store={generateStore(providedState)}>
      <MemoryRouter>
        {children}
      </MemoryRouter>
    </Provider>
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
