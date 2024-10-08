import React from 'react'
import orm from 'store/models'
import { AllTheProviders, render, screen } from 'util/testing/reactTestingLibraryExtended'
import CreateModal from './CreateModal'

function testProviders () {
  const ormSession = orm.mutableSession(orm.getEmptyState())
  ormSession.Me.create({ id: '1' })
  const reduxState = { orm: ormSession.state }

  return AllTheProviders(reduxState)
}

it('renders', () => {
  render(
    <CreateModal match={{ params: {} }} location={{ search: '' }} />,
    { wrapper: testProviders() }
  )

  expect(screen.getByText('What would you like to create?')).toBeInTheDocument()
})
