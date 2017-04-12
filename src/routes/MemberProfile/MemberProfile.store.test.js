import configureStore from 'redux-mock-store'
import { get } from 'lodash/fp'
import promiseMiddleware from 'redux-promise'

import graphqlMiddleware from 'store/middleware/graphql'
import normalizingMiddleware from 'store/middleware/normalizingMiddleware'
import { ADD_PERSON, FETCH_PERSON } from 'store/constants'
import payload from './MemberProfile.test.json'
import { fetchPerson } from './MemberProfile.store'

const apiMiddleware = store => next => action => {
  const { id, slug } = get('payload.api.params.variables', action) || {}
  return id === '46816' ? next({ ...action, payload }) : next(action)
}

it('Returns the correct action', () => {
  const expected = {
    type: FETCH_PERSON,
    graphql: {
      query: 'A very wombaty query.',
      variables: {
        id: '12345'
      }
    }
  }
  const { query, variables } = expected.graphql
  const actual = fetchPerson(variables.id, query)
  expect(actual).toEqual(expected)
})

describe('ACTIONS', () => {
  let store = null
  let mockStore = configureStore([
    graphqlMiddleware,
    apiMiddleware,
    normalizingMiddleware
  ])

  beforeEach(() => {
    store = mockStore({})
  })
})
