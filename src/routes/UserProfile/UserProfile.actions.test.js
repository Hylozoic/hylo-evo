import configureStore from 'redux-mock-store'
import promiseMiddleware from 'redux-promise'

import graphqlMiddleware from 'store/middleware/graphql'
import normalizingMiddleware from 'store/middleware/normalizingMiddleware'
import { ADD_PERSON, FETCH_PERSON } from 'store/constants'
import payload from './UserProfile.test.json'
import { fetchPerson } from './UserProfile.actions'

// Return a payload without hitting the API
const apiMiddleware = store => next => action => {
  const { payload, meta } = action
  if (!payload || !payload.api) return next(action)
  return next({...action, payload: Promise.resolve(payload)})
}

let store = null
let mockStore = configureStore([
  graphqlMiddleware,
  apiMiddleware,
  promiseMiddleware,
  normalizingMiddleware
])

beforeEach(() => {
  store = mockStore({})
})

it('Has a store', () => {
  const expected = { type: 'NOT_A_FETCH', payload: { wombat: true } }
  store.dispatch(expected)
  const actual = store.getActions()
  expect(actual).toEqual([expected])
})

it('Dispatches ADD_PERSON when person is requested', () => {
  store.dispatch(fetchPerson('46816'))
  const actual = store.getActions().find(a => a.type === ADD_PERSON)
  expect(actual).toBeTruthy()
})
