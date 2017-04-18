import configureStore from 'redux-mock-store'
import { get } from 'lodash/fp'
import promiseMiddleware from 'redux-promise'

import orm from 'store/models'
import graphqlMiddleware from 'store/middleware/graphql'
import { ADD_PERSON, FETCH_PERSON } from 'store/constants'
import payload from './MemberProfile.test.json'
import normalized from './MemberProfile.normalized.test.json'
import { fetchPerson, personSelector } from './MemberProfile.store'

const apiMiddleware = store => next => action => {
  const { id, slug } = get('payload.api.params.variables', action) || {}
  return id === '12345' ? next({ ...action, payload }) : next(action)
}

it('Returns the correct action', () => {
  const expected = {
    type: FETCH_PERSON,
    graphql: {
      query: 'A very wombaty query.',
      variables: {
        id: '12345',
        limit: 10,
        order: 'desc'
      }
    }
  }
  const { query, variables } = expected.graphql
  const actual = fetchPerson(variables.id, 'desc', 10, query)
  expect(actual).toEqual(expected)
})

describe('personSelector', () => {
  let session = null
  let state = null
  let props = null

  beforeEach(() => {
    session = orm.mutableSession(orm.getEmptyState())

    const { communities, memberships, person } = normalized
    session.Person.create(person)
    session.Community.create(communities[0])
    state = { orm: session.state }
    props = { match: { params: { id: '46816', slug: 'wombats' } } }
  })

  it('returns a default object for a non-existent person', () => {
    const expected = { avatarUrl: '', bannerUrl: '', name: '' }
    props.match.params.id = '1'
    const actual = personSelector(state, props)
    expect(actual).toEqual(expected)
  })

  it('returns the correct person', () => {
    const expected = '46816'
    const actual = personSelector(state, props).id
    expect(actual).toBe(expected)
  })

  it('sets role to null if person is not moderator', () => {
    const actual = personSelector(state, props).role
    expect(actual).toBe(null)
  })

  it('adds a role if person is moderator', () => {
    session.Membership.create(normalized.memberships[0])
    const actual = personSelector({ orm: session.state }, props).role
    expect(actual).toBeTruthy()
  })
})

describe('ACTIONS', () => {
  let store = null
  let mockStore = configureStore([
    graphqlMiddleware,
    apiMiddleware
  ])

  beforeEach(() => {
    store = mockStore({})
  })
})
