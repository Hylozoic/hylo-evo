import React from 'react'
import { history } from 'router'
import orm from 'store/models'
import { AllTheProviders, generateStore, render } from 'util/reactTestingLibraryExtended'
import CreateModal from './CreateModal'

function testProviders () {
  const ormSession = orm.mutableSession(orm.getEmptyState())
  ormSession.Me.create({ id: '1' })
  const reduxState = { orm: ormSession.state }
  const store = generateStore(history, reduxState)

  return AllTheProviders(store)
}

it('renders', () => {
  const { getByText } = render(
    <CreateModal match={{ params: {} }} location={{ search: '' }} />,
    null,
    testProviders()
  )

  expect(getByText('What would you like to create?')).toBeInTheDocument()
})
