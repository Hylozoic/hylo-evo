import React from 'react'
import { history } from 'router'
import orm from 'store/models'
import { AllTheProviders, generateStore, render } from 'util/reactTestingLibraryExtended'
import VerifyEmail from './VerifyEmail'

function testProviders () {
  const ormSession = orm.mutableSession(orm.getEmptyState())
  const reduxState = { orm: ormSession.state }
  const store = generateStore(history, reduxState)

  return AllTheProviders(store)
}

it('renders correctly', async () => {
  const { getByText } = render(
    <VerifyEmail location={{ search: '?email=test@hylo.com' }} />,
    null,
    testProviders()
  )

  expect(getByText("We've sent a 6 digit code", { exact: false })).toBeInTheDocument()
})
