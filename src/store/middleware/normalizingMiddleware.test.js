import configureStore from 'redux-mock-store'
import normalizingMiddleware, { collectAndMergeActions } from './normalizingMiddleware'
import testPayloads from './normalizingMiddleware.test.json'

const payload = testPayloads['FETCH_POSTS for me']

it('Returns a function to handle next', () => {
  const nextHandler = normalizingMiddleware({ action: 'ADD_POST' })
  expect(typeof nextHandler).toBe('function')
  expect(nextHandler.length).toBe(1)
})

it('Returns a function to handle action', () => {
  const actionHandler = normalizingMiddleware({ action: 'ADD_POST' })()
  expect(typeof actionHandler).toBe('function')
  expect(actionHandler.length).toBe(1)
})

describe('collectAndMergeActions', () => {
  it("produces a list of ADD actions from the payload's tree, leaf-first", () => {
    const actions = collectAndMergeActions('data', payload.data)
    expect(actions).toMatchSnapshot()
  })
})

describe('Actions:', () => {
  let store = null
  let mockStore = configureStore([normalizingMiddleware])

  beforeEach(() => {
    store = mockStore({})
  })

  describe('FETCH_POSTS', () => {
    it('Ignores actions that are not FETCH_*', () => {
      const expected = {
        type: 'NOT_A_FETCH',
        payload: {
          wombat: true
        }
      }
      store.dispatch(expected)
      const actual = store.getActions()
      expect(actual).toEqual([expected])
    })

    it('Dispatches ADD_POST when payload includes a post', () => {
      store.dispatch({
        type: 'FETCH_POSTS',
        payload
      })
      const actual = store.getActions().find(a => a.type === 'ADD_POST')
      expect(actual).toBeTruthy()
    })

    it('Does not dispatch ADD_POST when payload does not include a post', () => {
      store.dispatch({
        type: 'FETCH_POSTS',
        payload: []
      })
      const actual = store.getActions().find(a => a.type === 'ADD_POST')
      expect(actual).toBeFalsy()
    })

    it('Does not dispatch ADD_COMMENTS when no comment is present', () => {
      const posts = payload.data.me.posts.map(p => ({ ...p, comments: [] }))
      store.dispatch({
        type: 'FETCH_POSTS',
        payload: { data: { me: { posts } } }
      })
      const actual = store.getActions().filter(a => a.type === 'ADD_COMMENTS').length
      expect(actual).toBe(0)
    })

    it('Does not dispatch ADD_COMMUNITY when no community is present', () => {
      const posts = payload.data.me.posts.map(p => ({ ...p, communities: [] }))
      store.dispatch({
        type: 'FETCH_POSTS',
        payload: { data: { me: { posts } } }
      })
      const actual = store.getActions().filter(a => a.type === 'ADD_COMMUNITY').length
      expect(actual).toBe(0)
    })

    it('Dispatches correct number of ADD_PERSON actions', () => {
      store.dispatch({
        type: 'FETCH_POSTS',
        payload: payload
      })
      // Two people in the test data
      const actual = store.getActions().filter(a => a.type === 'ADD_PERSON').length
      expect(actual).toBe(2)
    })

    it('Does not dispatch ADD_PERSON when no person is present', () => {
      const posts = payload.data.me.posts.map(({ id, name }) => ({ id, name }))
      store.dispatch({
        type: 'FETCH_POSTS',
        payload: { data: { me: { posts } } }
      })
      const actual = store.getActions().filter(a => a.type === 'ADD_PERSON').length
      expect(actual).toBe(0)
    })

    it('Has the correct payload', () => {
      const withSinglePost = {
        data: {
          me: {
            posts: payload.data.me.posts.filter(p => p.id === '30002')
          }
        }
      }
      store.dispatch({
        type: 'FETCH_POSTS',
        payload: withSinglePost
      })
      const expected = {
        id: '30002',
        title: 'Hello',
        type: null,
        details: '<p><a href="https://wombat.life">https://wombat.life</a></p>\n<p></p>\n<p></p>',
        creator: '46816',
        followers: [ '46816' ],
        followersTotal: '1',
        communities: [ '1836' ],
        communitiesTotal: '1',
        comments: [ '1' ],
        commentsTotal: '1',
        createdAt: 'Sat Mar 18 2017 10:48:43 GMT+1300 (NZDT)',
        startsAt: null,
        endsAt: null,
        fulfilledAt: null
      }
      const actual = store.getActions().filter(a => a.type === 'ADD_POST')[0].payload
      expect(actual).toEqual(expected)
    })

    it('merges data from different actions related to the same object', () => {
      store.dispatch({
        type: 'FETCH_POSTS',
        payload: testPayloads['FETCH_POSTS for community']
      })

      const action = store.getActions().find(a => a.type === 'ADD_COMMUNITY')
      expect(action.payload).toEqual({
        id: '1',
        name: 'foo',
        slug: 'foo',
        bannerUrl: 'http://foo.com/banner.png',
        postCount: 21,
        avatarUrl: 'http://foo.com/avatar.png',
        memberCount: 42,
        posts: ['2', '3']
      })
    })
  })
})
