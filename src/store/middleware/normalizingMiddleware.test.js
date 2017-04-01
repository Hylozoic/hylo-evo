import configureStore from 'redux-mock-store'

import normalizingMiddleware from './normalizingMiddleware'
import payload from './normalizingMiddleware.test.json'

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

it('Returns the value of next', () => {
  const expected = 'Wombat'
  const nextHandler = normalizingMiddleware({ action: 'ADD_POST' })
  const actionHandler = nextHandler(() => expected)
  const actual = actionHandler()
  expect(actual).toBe(expected)
})

describe('Actions', () => {
  let store = null
  let mockStore = configureStore([normalizingMiddleware])

  beforeEach(() => {
    store = mockStore({})
  })

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
      type: 'FETCH_POST',
      payload: payload.FETCH_POST
    })
    const actual = store.getActions().find(a => a.type === 'ADD_POST')
    expect(actual).toBeTruthy()
  })

  it('Does not dispatch ADD_POST when payload does not include a post', () => {
    store.dispatch({
      type: 'FETCH_POST',
      payload: []
    })
    const actual = store.getActions().find(a => a.type === 'ADD_POST')
    expect(actual).toBeFalsy()
  })

  it('Does not dispatch ADD_COMMENTS when no comment is present', () => {
    const posts = payload.FETCH_POST.data.me.posts.map(p => ({ ...p, comments: [] }))
    store.dispatch({
      type: 'FETCH_POST',
      payload: { data: { me: { posts } } }
    })
    const actual = store.getActions().filter(a => a.type === 'ADD_COMMENTS').length
    expect(actual).toBe(0)
  })

  it('Does not dispatch ADD_COMMUNITY when no community is present', () => {
    const posts = payload.FETCH_POST.data.me.posts.map(p => ({ ...p, communities: [] }))
    store.dispatch({
      type: 'FETCH_POST',
      payload: { data: { me: { posts } } }
    })
    const actual = store.getActions().filter(a => a.type === 'ADD_COMMUNITY').length
    expect(actual).toBe(0)
  })

  it('Dispatches correct number of ADD_PERSON actions', () => {
    store.dispatch({
      type: 'FETCH_POST',
      payload: payload.FETCH_POST
    })
    // Two people in the test data
    const actual = store.getActions().filter(a => a.type === 'ADD_PERSON').length
    expect(actual).toBe(2)
  })

  it('Does not dispatch ADD_PERSON when no person is present', () => {
    const posts = payload.FETCH_POST.data.me.posts.map(({ id, name }) => ({ id, name }))
    store.dispatch({
      type: 'FETCH_POST',
      payload: { data: { me: { posts } } }
    })
    const actual = store.getActions().filter(a => a.type === 'ADD_PERSON').length
    expect(actual).toBe(0)
  })

  it('Has the correct payload', () => {
    store.dispatch({
      type: 'FETCH_POST',
      payload: payload.FETCH_POST
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

  describe('FETCH_FEEDITEM', () => {
    it('Has the correct payload', () => {
      store.dispatch({
        type: 'FETCH_FEEDITEM',
        payload: payload.FETCH_FEEDITEM
      })
      const expected = {
        creator: "12345",
        details: "<p>This is a FeedItem.</p>",
        id: "30002",
        title: "Hello",
      }
      const actual = store.getActions().filter(a => a.type === 'ADD_POST')[0].payload
      expect(actual).toEqual(expected)
    })
  })
})

