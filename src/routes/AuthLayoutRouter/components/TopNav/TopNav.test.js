// import TopNav from './TopNav'
// import { shallow } from 'enzyme'
// import React from 'react'

// it('renders as expected with no group', () => {
//   const wrapper = shallow(<TopNav />)
//   expect(wrapper).toMatchSnapshot()

//   const logo = wrapper.find('Logo').first().dive()
//   expect(logo.props().style).toEqual({
//     backgroundImage: 'url(/hylo-merkaba.png)'
//   })
// })

import React from 'react'
import { IntercomProvider } from 'react-use-intercom'
import { graphql } from 'msw'
import mockGraphqlServer from 'util/testing/mockGraphqlServer'
import { AllTheProviders, render, screen } from 'util/testing/reactTestingLibraryExtended'
import TopNav from './TopNav'

function TestWrapper ({ children }) {
  const AllTheProvidersComponent = AllTheProviders()

  return (
    <AllTheProvidersComponent>
      <IntercomProvider>
        {children}
      </IntercomProvider>
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
