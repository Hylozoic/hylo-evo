import { get } from 'lodash/fp'
import queryResults, { buildKey, matchNewPostIntoQueryResults } from './queryResults'
import { FETCH_MEMBERS } from 'routes/Members/Members.store'

const variables = {slug: 'foo', sortBy: 'name'}

const key = JSON.stringify({
  type: FETCH_MEMBERS,
  params: variables
})

describe('using extractQueryResults', () => {
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
        graphql: {variables},
        extractQueryResults: {
          getItems: get('payload.data.community.members')
        }
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
        },
        extractQueryResults: {
          getItems: get('payload.data.community.members')
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

  it('state is unchanged when extractQueryResults.getItems data not found', () => {
    const state = {
      emptyState: ''
    }
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
        graphql: {variables},
        extractQueryResults: {
          getItems: get('invalid-data-path')
        }
      }
    }

    expect(queryResults(state, action)).toEqual(state)
  })

  it('uses type returned by getType', () => {
    const initialState = {}

    const action = {
      type: FETCH_MEMBERS,
      payload: {data: {test: {items: []}}},
      meta: {
        graphql: {variables},
        extractQueryResults: {
          getItems: get('payload.data.test'),
          getType: () => 'TEST_TYPE'
        }
      }
    }

    const expectedKey = JSON.stringify({
      type: action.meta.extractQueryResults.getType(),
      params: variables
    })

    expect(queryResults(initialState, action)).toEqual(
      expect.objectContaining({
        [expectedKey]: expect.any(Object)
      })
    )
  })

  it('uses params in key returned by getParams', () => {
    const initialState = {}

    const action = {
      type: FETCH_MEMBERS,
      payload: {data: {test: {items: []}}},
      meta: {
        graphql: {variables},
        customVariables: {
          id: 1
        },
        extractQueryResults: {
          getItems: get('payload.data.test'),
          getParams: get('meta.customVariables')
        }
      }
    }

    const expectedKey = JSON.stringify({
      type: action.type,
      params: action.meta.extractQueryResults.getParams(action)
    })

    expect(queryResults(initialState, action)).toEqual(
      expect.objectContaining({
        [expectedKey]: expect.any(Object)
      })
    )
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
