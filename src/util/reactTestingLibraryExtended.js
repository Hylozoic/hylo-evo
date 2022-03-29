import React from 'react'
import { MemoryRouter } from 'react-router'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { render } from '@testing-library/react'
import { history } from 'router'
import rootReducer from 'store/reducers'
import createMiddleware from 'store/middleware'
import { getEmptyState } from 'store'

export function generateStore (initialState) {
  return createStore(rootReducer, initialState || getEmptyState(), createMiddleware(history))
}

/*
  This is used by default with an empty state in `customRender` (exported as render)
  import and use this directly, providing state, when needing custom state, e.g.:

    `render(<ComponentUnderTest />, AllTheProvieders(myOwnReduxState))`
*/
export const AllTheProviders = providedState => ({ children }) => {
  return (
    <Provider store={generateStore(providedState)}>
      <MemoryRouter>
        {children}
      </MemoryRouter>
    </Provider>
  )
}

/*
  To be used in `customRender` (exported as `render`) as follows when needed:

    `render(<ComponentUnderTest/>, { container: createRootContainer() }, AllTheProviders())`

  Generally only needed if the component or any of it's children need to
  append nodes to the DOM as the `root` node is not in the test DOM by default
*/
export function createRootContainer () {
  const rootElement = document.createElement('div')
  rootElement.setAttribute('id', 'root')
  return document.body.appendChild(rootElement)
}

const customRender = (ui, providersFunc = AllTheProviders(), options) =>
  render(ui, { wrapper: providersFunc, ...options })

// re-export everything

/* eslint-disable import/export */
export * from '@testing-library/react'

// override render method
export { customRender as render }
