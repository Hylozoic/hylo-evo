import Consent from './Consent'
import { render, screen } from 'util/testing/reactTestingLibraryExtended'
import React from 'react'

it('renders correctly', () => {
  render(
    <Consent location={{ search: '?name=CoolApp' }} appName='CoolApp' />
  )

  expect(screen.getByText('{{appName}} wants access to your Hylo account')).toBeInTheDocument()
})
