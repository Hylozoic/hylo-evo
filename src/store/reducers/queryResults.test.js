import { get } from 'lodash/fp'
import orm from 'store/models'
import queryResults, {
  buildKey,
  matchNewPostIntoQueryResults,
  makeGetQueryResults,
  makeQueryResultsModelSelector,
  matchNewThreadIntoQueryResults
} from './queryResults'
import { FETCH_MEMBERS } from 'routes/Members/Members.store'
import {
  REMOVE_POST_PENDING
} from 'store/constants'

const variables = { activePostsOnly: false, context: 'groups', slug: 'foo', sortBy: 'name' }

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
          group: {
            members: {
              total: 22,
              items: [{ id: 7 }, { id: 8 }, { id: 9 }],
              hasMore: true
            }
          }
        }
      },
      meta: {
        graphql: { variables },
        extractQueryResults: {
          getItems: get('payload.data.group.members')
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
          group: {
            members: {
              total: 22,
              items: [{ id: 7 }, { id: 8 }, { id: 9 }],
              hasMore: false
            }
          }
        }
      },
      meta: {
        graphql: {
          variables
        },
        extractQueryResults: {
          getItems: get('payload.data.group.members')
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
          group: {
            members: {
              total: 22,
              items: [{ id: 7 }, { id: 8 }, { id: 9 }],
              hasMore: true
            }
          }
        }
      },
      meta: {
        graphql: { variables },
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
      payload: { data: { test: { items: [] } } },
      meta: {
        graphql: { variables },
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

  it('uses params in key returned by getRouteParams', () => {
    const initialState = {}

    const action = {
      type: FETCH_MEMBERS,
      payload: { data: { test: { items: [] } } },
      meta: {
        graphql: { variables },
        customVariables: {
          id: 1
        },
        extractQueryResults: {
          getItems: get('payload.data.test'),
          getRouteParams: get('meta.customVariables')
        }
      }
    }

    const expectedKey = JSON.stringify({
      type: action.type,
      params: action.meta.extractQueryResults.getRouteParams(action)
    })

    expect(queryResults(initialState, action)).toEqual(
      expect.objectContaining({
        [expectedKey]: expect.any(Object)
      })
    )
  })
})

describe('queryResults reducer', () => {
  const key1 = '{"type":"FETCH_POSTS","params":{"context":"groups","slug":"foo"}}'
  const key2 = '{"type":"FETCH_POSTS","params":{"context":"groups","slug":"foo","filter":"request"}}'
  const key3 = '{"type":"FETCH_POSTS","params":{"context":"groups","slug":"bar"}}'

  const state = {
    [key1]: {
      hasMore: true,
      ids: ['18', '11']
    },
    [key2]: {
      hasMore: true,
      ids: ['18', '11']
    },
    [key3]: {
      hasMore: true,
      ids: ['18', '11']
    }
  }

  const action = {
    type: REMOVE_POST_PENDING,
    meta: {
      postId: '18',
      slug: 'foo'
    }
  }

  it('removes the id from results on REMOVE_POST_PENDING', () => {
    const newState = queryResults(state, action)
    expect(newState[key1].ids).toEqual(['11'])
    expect(newState[key2].ids).toEqual(['11'])
    expect(newState[key3].ids).toEqual(['18', '11'])
  })
})

describe('buildKey', () => {
  it('omits blank parameters', () => {
    expect(buildKey('actionType', { context: 'groups', slug: 'foo', search: null }))
      .toEqual('{"type":"actionType","params":{"context":"groups","slug":"foo"}}')
  })
})

describe('matchNewPostIntoQueryResults', () => {
  it('prepends the post id to matching query result sets', () => {
    const state = {
      '{"type":"FETCH_POSTS","params":{"activePostsOnly":false,"childPostInclusion":"yes","context":"groups","slug":"bar"}}': {
        hasMore: true,
        ids: ['18', '11']
      },
      '{"type":"FETCH_POSTS","params":{"activePostsOnly":false,"childPostInclusion":"yes","context":"groups","filter":"request","slug":"bar"}}': {
        hasMore: true,
        ids: ['18', '11']
      }
    }
    const groups = [{ slug: 'foo' }, { slug: 'bar' }]
    const post = { id: '17', type: 'request', groups }

    expect(matchNewPostIntoQueryResults(state, post)).toEqual({
      '{"type":"FETCH_POSTS","params":{"activePostsOnly":false,"childPostInclusion":"yes","context":"groups","slug":"bar"}}': {
        hasMore: true,
        ids: ['17', '18', '11'],
        total: false
      },
      '{"type":"FETCH_POSTS","params":{"activePostsOnly":false,"childPostInclusion":"yes","context":"groups","filter":"request","slug":"bar"}}': {
        hasMore: true,
        ids: ['17', '18', '11'],
        total: false
      }
    })
  })

  it('prepends the post id to matching query result sets with a topic', () => {
    const state = {
      '{"type":"FETCH_POSTS","params":{"childPostInclusion":"no","context":"groups","filter":"chat","order":"asc","slug":"bar","sortBy":"id","topic":"123"}}': {
        hasMore: true,
        ids: ['18', '11']
      }
    }
    const groups = [{ slug: 'foo' }, { slug: 'bar' }]
    const post = { id: '17', type: 'request', groups, topics: [{ name: 'a', id: '123' }] }
    expect(matchNewPostIntoQueryResults(state, post)).toEqual({
      '{"type":"FETCH_POSTS","params":{"childPostInclusion":"no","context":"groups","filter":"chat","order":"asc","slug":"bar","sortBy":"id","topic":"123"}}': {
        hasMore: true,
        ids: ['17', '18', '11'],
        total: false
      }
    })
  })
})

describe('matchNewThreadIntoQueryResults', () => {
  it('prepends the thread id to matching query result sets', () => {
    const state = {
      '{"type":"FETCH_THREADS","params":{}}': {
        hasMore: true,
        ids: ['20', '21']
      }
    }

    const thread = { id: '27' }

    expect(matchNewThreadIntoQueryResults(state, thread)).toEqual({
      '{"type":"FETCH_THREADS","params":{}}': {
        hasMore: true,
        ids: ['27', '20', '21'],
        total: false
      }
    })
  })
})

describe('makeQueryResultsModelSelector', () => {
  const session = orm.session(orm.getEmptyState())

  const specs = [
    {
      modelName: 'Person',
      values: {
        id: 1,
        name: 'The Creator'
      }
    },
    {
      modelName: 'Post',
      values: {
        id: 2,
        title: 'First past the',
        creator: 1
      }
    },
    {
      modelName: 'Post',
      values: {
        id: 3,
        title: 'third post',
        creator: 1
      }
    },
    {
      modelName: 'Post',
      values: {
        id: 4,
        title: 'Fourth',
        creator: 1
      }
    },
    {
      modelName: 'Post',
      values: {
        id: 5,
        title: 'Fifth',
        creator: 1
      }
    }
  ]

  specs.forEach(spec => session[spec.modelName].create(spec.values))

  const ACTION_NAME = 'ACTION_NAME'

  const state = {
    orm: session.state,
    queryResults: {
      [buildKey(ACTION_NAME)]: {
        ids: [5, 2, 3]
      }
    }
  }

  const resultsSelector = makeGetQueryResults(ACTION_NAME)

  it('returns the models in the right order', () => {
    const modelSelector = makeQueryResultsModelSelector(
      resultsSelector,
      'Post',
      post => ({
        ...post.ref,
        creator: post.creator
      }))

    const models = modelSelector(state)
    expect(models.length).toEqual(3)
    expect(models.map(m => m.id)).toEqual([5, 2, 3])
    expect(models[0].creator.name).toEqual('The Creator')
  })
})
