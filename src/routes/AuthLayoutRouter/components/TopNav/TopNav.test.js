import React from 'react'
import { graphql } from 'msw'
import mockGraphqlServer from 'util/testing/mockGraphqlServer'
import { AllTheProviders, render, screen } from 'util/testing/reactTestingLibraryExtended'
import TopNav from './TopNav'

jest.mock('react-use-intercom', () => ({
  useIntercom: () => ({ show: () => {} })
}))

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: (domain) => {
    return {
      t: (str) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {})
      }
    }
  },
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: (str) => str }
    return Component
  }
}))

function TestWrapper ({ children }) {
  const AllTheProvidersComponent = AllTheProviders()

  return (
    <AllTheProvidersComponent>
      {children}
    </AllTheProvidersComponent>
  )
}

it('renders as expected with no group', async () => {
  const me = {
    id: '1',
    name: 'Test User',
    hasRegistered: true,
    emailValidated: true,
    settings: {
      signupInProgress: false,
      alreadySeenTour: true
    }
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
    })
  )

  render(
    <TopNav />,
    { wrapper: TestWrapper }
  )

  expect(await screen.findByText("You don't have any messages yet")).toBeInTheDocument()
})
