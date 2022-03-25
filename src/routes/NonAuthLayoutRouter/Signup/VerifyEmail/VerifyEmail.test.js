import React from 'react'
import { history } from 'router'
import orm from 'store/models'
import { AllTheProviders, generateStore, render, screen } from 'util/reactTestingLibraryExtended'
import VerifyEmail from './VerifyEmail'

function testProviders () {
  const ormSession = orm.mutableSession(orm.getEmptyState())
  const reduxState = { orm: ormSession.state }
  const store = generateStore(history, reduxState)

  return AllTheProviders(store)
}

it('renders correctly', async () => {
  render(
    <VerifyEmail location={{ search: '?email=test@hylo.com' }} />,
    null,
    testProviders()
  )

  expect(screen.getByText("We've sent a 6 digit code", { exact: false })).toBeInTheDocument()
})
