import React from 'react'
import { history } from 'router'
import orm from 'store/models'
import { AllTheProviders, generateStore, render, screen } from 'util/reactTestingLibraryExtended'
import Login from './Login'

function testProviders () {
  const ormSession = orm.mutableSession(orm.getEmptyState())
  const reduxState = { orm: ormSession.state }
  const store = generateStore(history, reduxState)

  return AllTheProviders(store)
}

it('renders correctly', () => {
  render(
    <Login location={{ search: '' }} />,
    null,
    testProviders()
  )

  expect(screen.getByText('Sign in to Hylo')).toBeInTheDocument()
})
