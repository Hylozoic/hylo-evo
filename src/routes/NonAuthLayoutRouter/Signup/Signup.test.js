import React from 'react'
import { history } from 'router'
import orm from 'store/models'
import { AllTheProviders, generateStore, render, screen } from 'util/reactTestingLibraryExtended'
import Signup from './Signup'

function testProviders () {
  const ormSession = orm.mutableSession(orm.getEmptyState())
  const reduxState = { orm: ormSession.state }
  const store = generateStore(history, reduxState)

  return AllTheProviders(store)
}

it('renders correctly', () => {
  render(
    <Signup location={{ search: '' }} />,
    null,
    testProviders()
  )

  expect(screen.getByText('Enter your email to get started:')).toBeInTheDocument()
})
