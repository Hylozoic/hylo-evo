import React from 'react'
import { MemoryRouter } from 'react-router'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
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

// re-export everything

const rtl = require('react-testing-library')
const customRender = (ui, options, providersFunc) =>
  rtl.render(ui, { wrapper: providersFunc, ...options })

module.exports = {
  ...rtl,
  render: customRender
}
