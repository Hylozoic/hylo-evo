import configureStore from 'redux-mock-store'
import { get } from 'lodash/fp'
import promiseMiddleware from 'redux-promise'

import graphqlMiddleware from 'store/middleware/graphql'
import normalizingMiddleware from 'store/middleware/normalizingMiddleware'
import { ADD_PERSON } from 'store/constants'
import payload from './UserProfile.test.json'
import { fetchPerson } from './UserProfile.actions'

const apiMiddleware = store => next => action => {
  const id = get('payload.api.params.variables.id', action)
  return id === '46816' ? next({...action, payload }) : next(action)
}

let store = null
let mockStore = configureStore([
  graphqlMiddleware,
  apiMiddleware,
  normalizingMiddleware
])

beforeEach(() => {
  store = mockStore({})
})

it('Does not dispatch ADD_PERSON when no person in payload', () => {
  store.dispatch({ type: 'FLARGLE_ARGLE', payload: {} })
  const actual = store.getActions().find(a => a.type === ADD_PERSON)
  expect(actual).toBeFalsy()
})

it('Dispatches ADD_PERSON when person is requested', () => {
  store.dispatch(fetchPerson('46816'))
  const actual = store.getActions().find(a => a.type === ADD_PERSON)
  expect(actual).toBeTruthy()
})
