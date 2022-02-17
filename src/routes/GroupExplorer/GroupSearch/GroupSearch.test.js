import React from 'react'
import { unmountComponentAtNode } from 'react-dom'
import { graphql } from 'msw'
import { setupServer } from 'msw/node'
import { history } from '../../../router'
import { generateStore, render, AllTheProviders, waitFor, fireEvent } from 'util/reactTestingLibraryExtended'
import GroupSearch from './GroupSearch'
import orm from '../../../store/models'

let container = null
let providersWithStore = null

export const handlers = [
  graphql.operation((req, res, ctx) => {
    const { search } = req.body.variables
    let items = search !== 'different group'
      ? [
        {
          accessibility: [3],
          memberCount: 12,
          description: 'Words do not belong in this here town',
          location: 'Baltimore',
          locationObject: {
            city: 'Baltimore',
            country: 'USA',
            fullText: 'Baltimore, USA',
            locality: '',
            neighborhood: '',
            region: 'East Coast'
          },
          id: '345',
          avatarUrl: 'wee.com',
          bannerUrl: 'wee.com',
          name: 'Test Group Title',
          slug: 'test-group-title',
          groupTopics: [],
          members: []
        }
      ]
      : [
        {
          accessibility: [3],
          memberCount: 16,
          description: 'Completely different group don\'t you think',
          location: 'Somewhere else',
          locationObject: {
            city: 'Austin',
            country: 'USA',
            fullText: 'Austin, USA',
            locality: '',
            neighborhood: '',
            region: 'East Coast'
          },
          id: '345',
          avatarUrl: 'wee.com',
          bannerUrl: 'wee.com',
          name: 'Search input results',
          slug: 'test-group-title',
          groupTopics: [],
          members: []
        }
      ]
    return res(
      ctx.data({ groups: { hasMore: false, items, total: 0 } })
    )
  })
]

jest.mock('components/ScrollListener', () => () => <div />) // was throwing errors with this.element().removeEventListener('blabadlbakdbfl')

const server = setupServer(...handlers)

// Enable API mocking before tests.
beforeAll(() => server.listen())

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div', { className: 'container' })
  document.body.appendChild(container)
  // setup store
  const session = orm.mutableSession(orm.getEmptyState())
  session.Me.create({ id: '1' })
  const initialState = { orm: session.state }
  const store = generateStore(history, initialState)
  providersWithStore = AllTheProviders(store)
})

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container)
  server.resetHandlers()
  container.remove()
  container = null
  providersWithStore = null
})

// Disable API mocking after the tests are done.
afterAll(() => server.close())

test('GroupSearch integration test', async () => {
  const { queryByText, getByRole } = render(<GroupSearch />, container, providersWithStore)

  expect(queryByText('Group Search')).toBeInTheDocument()
  await waitFor(() => expect(queryByText('Test Group Title')).toBeInTheDocument())

  fireEvent.change(getByRole('textbox'), {
    target: { value: 'different group' }
  })
  await waitFor(() => expect(queryByText('Search input results')).toBeInTheDocument())
})
