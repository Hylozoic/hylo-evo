import React from 'react'
import { render, screen } from 'util/reactTestingLibraryExtended'
import NonAuthLayoutRouter from './NonAuthLayoutRouter'

// Currently the test below is going to default route to `/login`
// so until more tests are added this test is identical to the `Login`
// component test

it('renders correctly', () => {
  render(
    <NonAuthLayoutRouter location={{ search: '' }} />
  )

  expect(screen.getByText('Sign in to Hylo')).toBeInTheDocument()
})
