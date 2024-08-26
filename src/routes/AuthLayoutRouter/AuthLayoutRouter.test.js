import React from 'react'
import { graphql } from 'msw'
import orm from 'store/models'
import mockGraphqlServer from 'util/testing/mockGraphqlServer'
import { AllTheProviders, render, screen, waitForElementToBeRemoved } from 'util/testing/reactTestingLibraryExtended'
import AuthLayoutRouter from './AuthLayoutRouter'

const { ResizeObserver } = window

jest.mock('mixpanel-browser', () => ({
  track: jest.fn(),
  identify: jest.fn(),
  get_group: jest.fn().mockImplementation(() => ({
    set: jest.fn()
  })),
  set_group: jest.fn(),
  people: {
    set: jest.fn()
  }
}))

beforeEach(() => {
  delete window.ResizeObserver
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
  }))
})

afterEach(() => {
  window.ResizeObserver = ResizeObserver
  jest.restoreAllMocks()
})

function testWrapper (providedState) {
  const ormSession = orm.mutableSession(orm.getEmptyState())
  const reduxState = { orm: ormSession.state, ...providedState }

  return AllTheProviders(reduxState)
}

// it('shows group if the group exists', async () => {
//   const group = {
//     id: '1',
//     slug: 'test-group',
//     name: 'Test Group'
//   }
//   const membership = { id: '1', person: { id: '1' }, group, commonRoles: { items: [] } }
//   const me = {
//     id: '1',
//     name: 'Test User',
//     hasRegistered: true,
//     emailValidated: true,
//     settings: {
//       signupInProgress: false,
//       alreadySeenTour: true
//     },
//     memberships: [
//       membership
//     ]
//   }

//   mockGraphqlServer.resetHandlers(
//     graphql.query('MeQuery', (req, res, ctx) => {
//       return res(
//         ctx.data({
//           me: me
//         })
//       )
//     }),
//     graphql.query('FetchForGroup', (req, res, ctx) => {
//       return res(
//         ctx.data({
//           group
//         })
//       )
//     }),
//     graphql.query('GroupDetailsQuery', (req, res, ctx) => {
//       return res(
//         ctx.data({
//           group
//         })
//       )
//     }),
//     graphql.query('GroupWelcomeQuery', (req, res, ctx) => {
//       return res(
//         ctx.data({
//           group: null
//         })
//       )
//     }),
//     graphql.query('PostsQuery', (req, res, ctx) => {
//       return res(
//         ctx.data({
//           group: null
//         })
//       )
//     }),
//     graphql.query('GroupPostsQuery', (req, res, ctx) => {
//       return res(
//         ctx.data({
//           group: null
//         })
//       )
//     }),
//     // defaults
//     graphql.query('MessageThreadsQuery', (req, res, ctx) => {
//       return res(
//         ctx.data({
//           me: null
//         })
//       )
//     }),
//     graphql.query('MyPendingJoinRequestsQuery', (req, res, ctx) => {
//       return res(
//         ctx.data({
//           joinRequests: null
//         })
//       )
//     }),
//     graphql.query('NotificationsQuery', (req, res, ctx) => {
//       return res(
//         ctx.data({
//           notifications: null
//         })
//       )
//     }),
//     graphql.query('FetchCommonRoles', (req, res, ctx) => {
//       return res(
//         ctx.data({
//           commonRoles: null
//         })
//       )
//     })
//   )

//   render(
//     <AuthLayoutRouter location={{ pathname: '/groups/test-group', search: '' }} />,
//     { wrapper: testWrapper() }
//   )

//   await waitForElementToBeRemoved(screen.queryByTestId('loading-screen'))

//   expect(screen.getByText('Stream')).toBeInTheDocument()
// })

it('shows NotFound if the group does not exist', async () => {
  const me = {
    id: '1',
    name: 'Test User',
    hasRegistered: true,
    emailValidated: true,
    settings: {
      signupInProgress: false,
      alreadySeenTour: true
    },
    memberships: [{ id: '3', person: { id: '3' }, commonRoles: { items: [] } }]
  }

  mockGraphqlServer.resetHandlers(
    graphql.query('MeQuery', (req, res, ctx) => {
      return res(
        ctx.data({
          me: me
        })
      )
    }),
    graphql.query('FetchForGroup', (req, res, ctx) => {
      return res(
        ctx.data({
          group: null
        })
      )
    }),
    graphql.query('GroupDetailsQuery', (req, res, ctx) => {
      return res(
        ctx.data({
          group: null
        })
      )
    }),
    graphql.query('GroupWelcomeQuery', (req, res, ctx) => {
      return res(
        ctx.data({
          group: null
        })
      )
    }),
    graphql.query('PostsQuery', (req, res, ctx) => {
      return res(
        ctx.data({
          group: null
        })
      )
    }),
    graphql.query('GroupPostsQuery', (req, res, ctx) => {
      return res(
        ctx.data({
          group: null
        })
      )
    }),
    // defaults
    graphql.query('MessageThreadsQuery', (req, res, ctx) => {
      return res(
        ctx.data({
          me: null
        })
      )
    }),
    graphql.query('MyPendingJoinRequestsQuery', (req, res, ctx) => {
      return res(
        ctx.data({
          joinRequests: null
        })
      )
    }),
    graphql.query('NotificationsQuery', (req, res, ctx) => {
      return res(
        ctx.data({
          notifications: null
        })
      )
    }),
    graphql.query('FetchCommonRoles', (req, res, ctx) => {
      return res(
        ctx.data({
          commonRoles: null
        })
      )
    })
  )

  render(
    <AuthLayoutRouter location={{ pathname: '/groups/no-group', search: '' }} />,
    { wrapper: testWrapper() }
  )

  await waitForElementToBeRemoved(screen.queryByTestId('loading-screen'))

  expect(screen.getByText('404 Not Found')).toBeInTheDocument()
})
