import React from 'react'
import { graphql } from 'msw'
import { setupServer } from 'msw/node'
import { history } from 'router'
import { generateStore, render, AllTheProviders, fireEvent } from 'util/reactTestingLibraryExtended'
import GroupSearch from './GroupSearch'
import orm from 'store/models'

jest.mock('components/ScrollListener', () => () => <div />) // was throwing errors with this.element().removeEventListener('blabadlbakdbfl')

const server = setupServer(
  graphql.operation((req, res, ctx) => {
    const { search } = req.body.variables
    return res(ctx.data({
      groups: {
        items: search !== 'different group'
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
          ] : [
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
          ],
        hasMore: false,
        total: 0
      }
    }))
  })
)

let providersWithStore = null

// Enable API mocking before tests.
beforeAll(() => server.listen())

beforeEach(() => {
  // setup store
  const session = orm.mutableSession(orm.getEmptyState())
  session.Me.create({ id: '1' })
  const initialState = { orm: session.state }
  const store = generateStore(history, initialState)
  providersWithStore = AllTheProviders(store)
})

afterEach(() => {
  server.resetHandlers()
  providersWithStore = null
})

// Disable API mocking after the tests are done.
afterAll(() => server.close())

test('GroupSearch integration test', async () => {
  const { findByText, getByRole } = render(
    <GroupSearch />,
    null,
    providersWithStore
  )

  expect(await findByText('Test Group Title')).toBeInTheDocument()

  fireEvent.change(getByRole('textbox'), {
    target: { value: 'different group' }
  })

  expect(await findByText('Search input results')).toBeInTheDocument()
})
