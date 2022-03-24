import React from 'react'
import { useSelector } from 'react-redux'
import { history } from 'router'
import { Route } from 'react-router'
import { graphql } from 'msw'
import { setupServer } from 'msw/node'
import orm from 'store/models'
import getReturnToPath from 'store/selectors/getReturnToPath'
import extractModelsFromAction from 'store/reducers/ModelExtractor/extractModelsFromAction'
import { AllTheProviders, generateStore, render, waitForElementToBeRemoved } from 'util/reactTestingLibraryExtended'
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
  const meWithMembershipResult = {
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
  }
  extractModelsFromAction(meWithMembershipResult, ormSession)
  const store = generateStore(history, reduxState)

  return AllTheProviders(store)
}

it('joins and forwards to group when current user is fully signed-up', async () => {
  mockGraphqlServer.resetHandlers(
    graphql.mutation('UseInvitation', (req, res, ctx) => {
      return res(
        ctx.data({
          useInvitation: {
            membership: {
              id: '2',
              group: {
                id: '3',
                slug: 'test-group'
              }
            }
          }
        })
      )
    })
  )
  const { getByText } = render(
    <>
      <JoinGroup match={{ params: {} }} location={{ search: '' }} />
      <Route path='/' component={({ location }) => location.pathname} />
    </>,
    null,
    currentUserProvider(true)
  )

  await waitForElementToBeRemoved(document.querySelector('[data-stylename="loading"]'))

  expect(getByText('/groups/test-group/explore')).toBeInTheDocument()
})

it('checks invitation and forwards to expired invite page when invitation is invalid when not logged-in', async () => {
  mockGraphqlServer.resetHandlers(
    graphql.query('CheckInvitation', (req, res, ctx) => {
      // query variables available at req.body.variables
      return res(
        ctx.data({
          checkInvitation: {
            valid: false
          }
        })
      )
    })
  )
  const { getByText } = render(
    <>
      <JoinGroup match={{ params: {} }} location={{ search: '' }} />
      <Route path='/' component={({ location }) => location.pathname} />
    </>
    ,
    null,
    currentUserProvider(false)
  )

  await waitForElementToBeRemoved(document.querySelector('[data-stylename="loading"]'))

  expect(getByText(EXPIRED_INVITE_PATH)).toBeInTheDocument()
})

it('sets returnToPath and forwards to signup page when invitation is valid and user is not logged-in', async () => {
  mockGraphqlServer.resetHandlers(
    graphql.query('CheckInvitation', (req, res, ctx) => {
      // query variables available at req.body.variables
      return res(
        ctx.data({
          checkInvitation: {
            valid: true
          }
        })
      )
    })
  )
  const { getByText } = render(
    <>
      <JoinGroup match={{ params: {} }} location={{ pathname: 'route/to/join-group', search: '' }} />
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
    </>
    ,
    null,
    currentUserProvider(false)
  )

  await waitForElementToBeRemoved(document.querySelector('[data-stylename="loading"]'))

  expect(getByText('route/to/join-group')).toBeInTheDocument()
  expect(getByText(SIGNUP_PATH)).toBeInTheDocument()
})
