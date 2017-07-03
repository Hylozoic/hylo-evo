import queryResults, { buildKey, matchNewPostIntoQueryResults } from './queryResults'
import { FETCH_MEMBERS } from 'routes/Members/Members.store'

const variables = {slug: 'foo', sortBy: 'name'}

const key = JSON.stringify({
  type: FETCH_MEMBERS,
  params: variables
})

it('adds data to empty state', () => {
  const state = {}
  const action = {
    type: FETCH_MEMBERS,
    payload: {
      data: {
        community: {
          members: {
            total: 22,
            items: [{id: 7}, {id: 8}, {id: 9}],
            hasMore: true
          }
        }
      }
    },
    meta: {
      graphql: {variables}
    }
  }

  expect(queryResults(state, action)).toEqual({
    [key]: {
      ids: [7, 8, 9],
      total: 22,
      hasMore: true
    }
  })
})

it('appends to existing data, ignoring duplicates', () => {
  const state = {
    [key]: {
      ids: [4, 7, 5, 6],
      total: 21,
      hasMore: true
    }
  }

  const action = {
    type: FETCH_MEMBERS,
    payload: {
      data: {
        community: {
          members: {
            total: 22,
            items: [{id: 7}, {id: 8}, {id: 9}],
            hasMore: false
          }
        }
      }
    },
    meta: {
      graphql: {
        variables: {slug: 'foo', sortBy: 'name'}
      }
    }
  }

  expect(queryResults(state, action)).toEqual({
    [key]: {
      ids: [4, 7, 5, 6, 8, 9],
      total: 22,
      hasMore: false
    }
  })
})

describe('buildKey', () => {
  it('omits blank parameters', () => {
    expect(buildKey('actionType', {slug: 'foo', search: null}))
    .toEqual('{"type":"actionType","params":{"slug":"foo"}}')
  })
})

describe('matchNewPostIntoQueryResults', () => {
  it('prepends the post id to matching query result sets', () => {
    const state = {
      '{"type":"FETCH_POSTS","params":{"slug":"bar"}}': {
        hasMore: true,
        ids: ['18', '11']
      },
      '{"type":"FETCH_POSTS","params":{"slug":"bar","filter":"request"}}': {
        hasMore: true,
        ids: ['18', '11']
      }
    }
    const communities = [{slug: 'foo'}, {slug: 'bar'}]
    const post = {id: '17', type: 'request', communities}

    expect(matchNewPostIntoQueryResults(state, post)).toEqual({
      '{"type":"FETCH_POSTS","params":{"slug":"bar"}}': {
        hasMore: true,
        ids: ['17', '18', '11']
      },
      '{"type":"FETCH_POSTS","params":{"slug":"bar","filter":"request"}}': {
        hasMore: true,
        ids: ['17', '18', '11']
      }
    })
  })
})
