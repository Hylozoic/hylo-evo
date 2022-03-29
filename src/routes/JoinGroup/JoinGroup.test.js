import React from 'react'
import { useSelector } from 'react-redux'
import { Route } from 'react-router'
import { graphql } from 'msw'
import { setupServer } from 'msw/node'
import orm from 'store/models'
import getReturnToPath from 'store/selectors/getReturnToPath'
import extractModelsFromAction from 'store/reducers/ModelExtractor/extractModelsFromAction'
import { AllTheProviders, render, screen } from 'util/reactTestingLibraryExtended'
import JoinGroup, { SIGNUP_PATH, EXPIRED_INVITE_PATH } from './JoinGroup'

jest.mock('store/selectors/getMixpanel', () => () => ({
  identify: jest.fn(),
  track: jest.fn()
}))

const mockGraphqlServer = setupServer()
mockGraphqlServer.listen()

function currentUserProvider (signupStateComplete) {
  const ormSession = orm.mutableSession(orm.getEmptyState())
  const reduxState = { orm: ormSession.state }

  extractModelsFromAction({
    payload: {
      data: {
        me: {
          id: '1',
          name: 'Test User',
          hasRegistered: true,
          emailValidated: true,
          settings: {
            signupInProgress: !signupStateComplete
          },
          memberships: [
            {
              id: '2',
              group: {
                id: '3',
                slug: 'test-group'
              }
            }
          ]
        }
      }
    },
    meta: {
      extractModel: 'Me'
    }
  }, ormSession)

  return AllTheProviders(reduxState)
}

it('joins and forwards to group when current user is fully signed-up', async () => {
  const testMembership = {
    id: '2',
    group: {
      id: '3',
      slug: 'test-group'
    }
  }

  mockGraphqlServer.resetHandlers(
    graphql.mutation('UseInvitation', (req, res, ctx) => {
      return res(
        ctx.data({
          useInvitation: {
            membership: testMembership
          }
        })
      )
    }),
    graphql.query('FetchForGroup', (req, res, ctx) => {
      return res(
        ctx.data({
          group: testMembership.group
        })
      )
    })
  )

  render(
    <>
      <JoinGroup match={{ params: { accessCode: 'anything' } }} location={{ search: '' }} />
      <Route path='/' component={({ location }) => location.pathname} />
    </>,
    currentUserProvider(true)
  )

  expect(await screen.findByText('/groups/test-group/welcome')).toBeInTheDocument()
})

it('checks invitation and forwards to expired invite page when invitation is invalid when not logged-in', async () => {
  mockGraphqlServer.resetHandlers(
    graphql.query('CheckInvitation', (req, res, ctx) => {
      return res(
        ctx.data({
          checkInvitation: {
            valid: false
          }
        })
      )
    })
  )
  render(
    <>
      <JoinGroup match={{ params: { accessCode: 'anything' } }} location={{ search: '' }} />
      <Route path='/' component={({ location }) => location.pathname} />
    </>,
    currentUserProvider(false)
  )

  expect(await screen.findByText(EXPIRED_INVITE_PATH)).toBeInTheDocument()
})

it('sets returnToPath and forwards to signup page when invitation is valid and user is not logged-in', async () => {
  mockGraphqlServer.resetHandlers(
    graphql.query('CheckInvitation', (req, res, ctx) => {
      return res(
        ctx.data({
          checkInvitation: {
            valid: true
          }
        })
      )
    })
  )
  render(
    <>
      <JoinGroup match={{ params: { accessCode: 'anything' } }} location={{ pathname: 'route/to/join-group', search: '' }} />
      <Route
        path='/'
        component={({ location }) => {
          const returnToPath = useSelector(getReturnToPath)
          return (
            <>
              <div>{returnToPath}</div>
              <div>{location.pathname}</div>
            </>
          )
        }}
      />
    </>,
    currentUserProvider(false)
  )

  expect(await screen.findByText('route/to/join-group')).toBeInTheDocument()
  expect(await screen.findByText(SIGNUP_PATH)).toBeInTheDocument()
})
