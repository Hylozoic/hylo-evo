import React from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'

const AllTheProviders = ({ children }) => {
  return (
    <MemoryRouter>
      {children}
    </MemoryRouter>
  )
}

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// CAUSING PROBLEMS with babel + standard + eslint tool chain
// uncomment and try again after Group Explorer merge
// re-export everything
// export * from '@testing-library/react'

// override render method
export { customRender as render }
