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

export const AllTheProviders = (store) => ({ children }) => {
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
