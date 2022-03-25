import React from 'react'
import { history } from 'router'
import orm from 'store/models'
import { AllTheProviders, generateStore, render, screen } from 'util/reactTestingLibraryExtended'
import NonAuthLayoutRouter from './NonAuthLayoutRouter'

function testProvider () {
  const ormSession = orm.mutableSession(orm.getEmptyState())
  const reduxState = { orm: ormSession.state }
  const store = generateStore(history, reduxState)

  return AllTheProviders(store)
}

// Currently both tests below are going to default route `/login`
// so until elabtorated these tests are identical to the Login
// component tests

it('renders correctly', () => {
  render(
    <NonAuthLayoutRouter location={{ search: '' }} />,
    null,
    testProvider()
  )

  expect(screen.getByText('Sign in to Hylo')).toBeInTheDocument()
})
