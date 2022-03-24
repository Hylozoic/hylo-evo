import React from 'react'
import { history } from 'router'
import orm from 'store/models'
import { AllTheProviders, generateStore, render } from 'util/reactTestingLibraryExtended'
import Login from './Login'

function testProviders () {
  const ormSession = orm.mutableSession(orm.getEmptyState())
  const reduxState = { orm: ormSession.state }
  const store = generateStore(history, reduxState)
  return AllTheProviders(store)
}

it('renders correctly', () => {
  const { getByText } = render(
    <Login location={{ search: '' }} />,
    null,
    testProviders()
  )
  expect(getByText('Sign in to Hylo')).toBeInTheDocument()
})
