import React from 'react'
import { graphql } from 'msw'
import { setupServer } from 'msw/node'
import orm from 'store/models'
import { history } from 'router'
import { generateStore, render, AllTheProviders, fireEvent } from 'util/reactTestingLibraryExtended'
import GroupSearch from './GroupSearch'

// was throwing errors with this.element().removeEventListener('blabadlbakdbfl')
jest.mock('components/ScrollListener', () => () => <div />)

const mockGraphqlServer = setupServer()
mockGraphqlServer.listen()

function testProviders () {
  const ormSession = orm.mutableSession(orm.getEmptyState())
  ormSession.Me.create({ id: '1' })
  const reduxState = { orm: ormSession.state }
  const store = generateStore(history, reduxState)

  return AllTheProviders(store)
}

afterEach(() => {
  mockGraphqlServer.resetHandlers()
})

test('GroupSearch integration test', async () => {
  mockGraphqlServer.resetHandlers(
    graphql.operation((req, res, ctx) => {
      const { search } = req.body.variables
      return res(ctx.data({
        groups: {
          items: search !== 'different group'
            ? [
              {
                id: '345',
                name: 'Test Group Title',
                slug: 'test-group-title',
                accessibility: [3],
                description: 'Words do not belong in this here town'
              }
            ] : [
              {
                id: '345',
                name: 'Search input results',
                slug: 'test-group-title',
                accessibility: [3],
                description: 'Completely different group don\'t you think'
              }
            ],
          hasMore: false,
          total: 0
        }
      }))
    })
  )
  const { findByText, getByRole } = render(
    <GroupSearch />,
    null,
    testProviders()
  )

  expect(await findByText('Test Group Title')).toBeInTheDocument()

  fireEvent.change(getByRole('textbox'), {
    target: { value: 'different group' }
  })

  expect(await findByText('Search input results')).toBeInTheDocument()
})

// Disable API mocking after the tests are done.
afterAll(() => mockGraphqlServer.close())
