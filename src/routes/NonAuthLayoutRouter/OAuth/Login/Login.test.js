import Login from './Login'
import { render, screen } from 'util/testing/reactTestingLibraryExtended'
import React from 'react'

it('renders correctly', () => {
  render(
    <Login location={{ search: '' }} match={{ params: { uid: 'uid' }}} />
  )

  expect(screen.getByText('Sign in to Hylo')).toBeInTheDocument()
})
