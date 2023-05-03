import React from 'react'
import { useSelector } from 'react-redux'
import { Route } from 'react-router'
import { graphql } from 'msw'
import orm from 'store/models'
import mockGraphqlServer from 'util/testing/mockGraphqlServer'
import getReturnToPath from 'store/selectors/getReturnToPath'
import extractModelsForTest from 'util/testing/extractModelsForTest'
import { AllTheProviders, render, screen } from 'util/testing/reactTestingLibraryExtended'
import JoinGroup, { SIGNUP_PATH } from './JoinGroup'

jest.mock('mixpanel-browser', () => ({
  track: jest.fn(),
  identify: jest.fn(),
  people: {
    set: jest.fn()
  }
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
  }
}))

function currentUserProvider (authStateComplete) {
  const ormSession = orm.mutableSession(orm.getEmptyState())
  const reduxState = { orm: ormSession.state }

  extractModelsForTest({
    me: {
      id: '1',
      name: 'Test User',
      hasRegistered: true,
      emailValidated: true,
      settings: {
        signupInProgress: !authStateComplete
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
  }, 'Me', ormSession)

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
      <Route component={({ location }) => location.pathname} />
    </>,
    { wrapper: currentUserProvider(true) }
  )

  expect(await screen.findByText('/groups/test-group/explore')).toBeInTheDocument()
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
      <Route component={({ location }) => location.pathname + location.search} />
    </>,
    { wrapper: currentUserProvider(false) }
  )

  expect(await screen.findByText(`${SIGNUP_PATH}?error=`, { exact: false })).toBeInTheDocument()
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
    { wrapper: currentUserProvider(false) }
  )

  expect(await screen.findByText('route/to/join-group')).toBeInTheDocument()
  expect(await screen.findByText(SIGNUP_PATH)).toBeInTheDocument()
})
