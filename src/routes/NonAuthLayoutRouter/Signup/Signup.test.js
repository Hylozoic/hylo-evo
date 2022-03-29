import React from 'react'
import { render, screen } from 'util/reactTestingLibraryExtended'
import Signup from './Signup'

it('renders correctly', () => {
  render(
    <Signup location={{ search: '' }} />
  )

  expect(screen.getByText('Enter your email to get started:')).toBeInTheDocument()
})
