import React from 'react'
import { MemoryRouter } from 'react-router'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { render } from '@testing-library/react'
import rootReducer from 'store/reducers'
import createMiddleware from 'store/middleware'

export function generateStore (history, initialState) {
  return createStore(rootReducer, initialState, createMiddleware(history))
}

// To be used in `customRender` (exported as `render`) as follows when needed:
//
//   `render(<ComponentUnderTest/>, { container: createRootContainer() }, AllTheProviders())`
//
// Generally only needed if the component or any of it's children need to
// append nodes to the DOM as the `root` node is not in the test DOM by default
export function createRootContainer () {
  const rootElement = document.createElement('div')
  rootElement.setAttribute('id', 'root')
  return document.body.appendChild(rootElement)
}

export const AllTheProviders = (store) => ({ children }) => {
  // Probably would be helpful to default to providing our
  // store in it's initial state (so redux-orm included)
  // either here or as the default for `generateStore` above
  return (
    <Provider store={store || createStore(() => {})}>
      <MemoryRouter>
        {children}
      </MemoryRouter>
    </Provider>
  )
}

const customRender = (ui, options, providersFunc) =>
  render(ui, { wrapper: providersFunc, ...options })

// re-export everything

/* eslint-disable import/export */
export * from '@testing-library/react'

// override render method
export { customRender as render }
