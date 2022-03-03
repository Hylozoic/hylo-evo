import React from 'react'
import { history } from 'router'
import orm from 'store/models'
import { AllTheProviders, generateStore, render } from 'util/reactTestingLibraryExtended'
import CreateModal from './CreateModal'

let providersWithStore

beforeEach(() => {
  const session = orm.mutableSession(orm.getEmptyState())
  session.Me.create({ id: '1' })
  const initialState = { orm: session.state }
  const store = generateStore(history, initialState)
  providersWithStore = AllTheProviders(store)
})

it('renders', () => {
  const { getByText } = render(
    <CreateModal match={{ params: {} }} location={{ search: '' }} />,
    null,
    providersWithStore
  )

  expect(getByText('What would you like to create?')).toBeTruthy()
})

afterEach(() => {
  providersWithStore = null
})
