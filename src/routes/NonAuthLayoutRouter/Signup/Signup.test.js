import React from 'react'
import { history } from 'router'
import orm from 'store/models'
import { AllTheProviders, generateStore, render } from 'util/reactTestingLibraryExtended'
import Signup from './Signup'

function testProviders () {
  const ormSession = orm.mutableSession(orm.getEmptyState())
  const reduxState = { orm: ormSession.state }
  const store = generateStore(history, reduxState)
  return AllTheProviders(store)
}

it('renders correctly', () => {
  const { getByText } = render(
    <Signup location={{ search: '' }} />,
    null,
    testProviders()
  )

  expect(getByText('Enter your email to get started:')).toBeInTheDocument()
})
