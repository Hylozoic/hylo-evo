import React from 'react'
import { shallow } from 'enzyme'
import AuthLayoutRouter from './AuthLayoutRouter'

it('shows NotFound if a currentUser is loaded and the group does not exist', () => {
  const wrapper = shallow(
    <AuthLayoutRouter
      isGroupRoute
      currentUser={{ hasRegistered: true }}
      location={{ pathname: '', search: '' }}
      routeParams={{ view: '' }}
    />
    , { disableLifecycleMethods: true }
  )
  expect(wrapper).toMatchSnapshot()
})

it('shows nothing for a group route if the group and currentUser are not loaded', () => {
  const wrapper = shallow(
    <AuthLayoutRouter
      currentUserPending
      isGroupRoute
      groupPending
      location={{ pathname: '/', search: '' }}
      routeParams={{ view: '' }}
    />
    , { disableLifecycleMethods: true }
  )
  expect(wrapper).toMatchSnapshot()
})

it('shows normal children for a group route if the group is loaded', () => {
  const wrapper = shallow(
    <AuthLayoutRouter
      currentUser={{ name: 'Testy Face', hasRegistered: true }}
      isGroupRoute
      group={{ id: '1' }}
      location={{ pathname: '/', search: '' }}
      routeParams={{ view: '' }}
    />
    , { disableLifecycleMethods: true }
  )
  expect(wrapper.name()).toEqual('Div100vh')
})

// WIP -- React Testing Library Tests
//
// Currently paused at mocking Intercom...

// import { Route } from 'react-router'
// import { graphql } from 'msw'
// import orm from 'store/models'
// import mockGraphqlServer from 'util/testing/mockGraphqlServer'
// import extractModelsForTest from 'util/testing/extractModelsForTest'
// import { AllTheProviders, render, screen } from 'util/testing/reactTestingLibraryExtended'
//
// jest.mock('store/selectors/getMixpanel', () => () => ({
//   identify: jest.fn(),
//   track: jest.fn(),
//   people: {
//     set: jest.fn()
//   }
// }))

// jest.mock('react-intercom', () => ({
//   IntercomAPI: () => jest.fn()
// }))

// jest.mock('client/rollbar', () => ({
//   error: jest.fn(),
//   configure: jest.fn()
// }))

// beforeEach(() => {
//   delete window.ResizeObserver
//   window.ResizeObserver = jest.fn().mockImplementation(() => ({
//     observe: jest.fn(),
//     unobserve: jest.fn(),
//     disconnect: jest.fn()
//   }))
// })

// // afterEach(() => {
// //   window.ResizeObserver = ResizeObserver
// //   jest.restoreAllMocks()
// // })

// function currentUserProvider (signupStateComplete) {
//   const ormSession = orm.mutableSession(orm.getEmptyState())
//   const reduxState = { orm: ormSession.state }

//   extractModelsForTest({
//     me: {
//       id: '1',
//       name: 'Test User',
//       hasRegistered: true,
//       emailValidated: true,
//       settings: {
//         signupInProgress: !signupStateComplete,
//         alreadySeenTour: true
//       },
//       memberships: [
//         {
//           id: '2',
//           person: {
//             id: '1'
//           },
//           group: {
//             id: '3',
//             slug: 'test-group'
//           }
//         }
//       ]
//     }
//   }, 'Me', ormSession)

//   return AllTheProviders(reduxState)
// }

// it('joins and forwards to group when current user is fully signed-up', async () => {
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
//       {
//         id: '2',
//         person: {
//           id: '2'
//         },
//         group: {
//           id: '3',
//           slug: 'test-group',
//           name: 'Test Group'
//         }
//       }
//     ]
//   }

//   mockGraphqlServer.resetHandlers(
//     graphql.query('MeQuery', (req, res, ctx) => {
//       return res(
//         ctx.data({ me })
//       )
//     }),
//     graphql.query('FetchForGroup', (req, res, ctx) => {
//       return res(
//         ctx.data({ group: me.memberships[0].group })
//       )
//     })
//   )

//   await render(
//     <AuthLayoutRouter
//       location={{ pathname: '/groups/test-group', search: '' }}
//       match={{
//         params: {
//           groupSlug: 'test-group'
//         }
//       }}
//     />,
//     { wrapper: currentUserProvider(true) }
//   )
//   await screen.debug()
//   expect(await screen.findByText('Test Group')).toBeInTheDocument()
// })
