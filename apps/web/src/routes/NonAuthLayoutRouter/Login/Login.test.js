import React from 'react'
import { render, screen } from 'util/testing/reactTestingLibraryExtended'
import Login from './Login'

it('renders correctly', () => {
  render(
    <Login location={{ search: '' }} />
  )

  expect(screen.getByText('Sign in to Hylo')).toBeInTheDocument()
})
