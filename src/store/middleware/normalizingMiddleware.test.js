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
      payload
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

  it('Dispatches a single ADD_POST action when a post is present', () => {
    store.dispatch({
      type: 'FETCH_POST',
      payload
    })
    const actual = store.getActions().filter(a => a.type === 'ADD_POST').length
    expect(actual).toBe(1)
  })

  it('Sends the correct number of posts in the ADD_POST payload', () => {
    store.dispatch({
      type: 'FETCH_POST',
      payload
    })
    const expected = payload.data.me.posts.length
    const action = store.getActions().filter(a => a.type === 'ADD_POST')[0]
    const actual = Object.keys(action.payload).length
    expect(actual).toBe(expected)
  })

  it('Dispatches a single ADD_COMMENTS action when a comment is present', () => {
    store.dispatch({
      type: 'FETCH_POST',
      payload
    })
    // Comments are consolidated into a single action
    const expected = 1
    const actual = store.getActions().filter(a => a.type === 'ADD_COMMENTS').length
    expect(actual).toBe(expected)
  })

  it('Sends the correct number of comments in ADD_COMMENTS payload', () => {
    store.dispatch({
      type: 'FETCH_POST',
      payload
    })
    const expected = payload.data.me.posts.reduce((total, post) => total + post.comments.length, 0)
    const action = store.getActions().filter(a => a.type === 'ADD_COMMENTS')[0]
    const actual = Object.keys(action.payload).length
    expect(actual).toBe(expected)
  })

  it('Does not dispatch ADD_COMMENTS when no comment is present', () => {
    const posts = payload.data.me.posts.map(p => ({ ...p, comments: [] }))
    store.dispatch({
      type: 'FETCH_POST',
      payload: { data: { me: { posts } } }
    })
    const actual = store.getActions().filter(a => a.type === 'ADD_COMMENTS').length
    expect(actual).toBe(0)
  })

  it('Dispatches a single ADD_COMMUNITIES action when a community is present', () => {
    store.dispatch({
      type: 'FETCH_POST',
      payload
    })
    const expected = 1
    const actual = store.getActions().filter(a => a.type === 'ADD_COMMUNITIES').length
    expect(actual).toBe(expected)
  })

  it('Does not dispatch ADD_COMMUNITIES when no community is present', () => {
    const posts = payload.data.me.posts.map(p => ({ ...p, communities: [] }))
    store.dispatch({
      type: 'FETCH_POST',
      payload: { data: { me: { posts } } }
    })
    const actual = store.getActions().filter(a => a.type === 'ADD_COMMUNITIES').length
    expect(actual).toBe(0)
  })

  it('Consolidates communities with the same ID', () => {
    store.dispatch({
      type: 'FETCH_POST',
      payload
    })
    const action = store.getActions().filter(a => a.type === 'ADD_COMMUNITIES')[0]
    const actual = Object.keys(action.payload).map(id => Number(id))
    expect(actual.length).toBe([...new Set(actual)].length)
  })

  it('Dispatches a single ADD_PEOPLE action when a person is present', () => {
    store.dispatch({
      type: 'FETCH_POST',
      payload
    })
    const actual = store.getActions().filter(a => a.type === 'ADD_PEOPLE').length
    expect(actual).toBe(1)
  })

  it('Does not dispatch ADD_PEOPLE when no person is present', () => {
    const posts = payload.data.me.posts.map(({ id, name }) => ({ id, name }))
    store.dispatch({
      type: 'FETCH_POST',
      payload: { data: { me: { posts } } }
    })
    const actual = store.getActions().filter(a => a.type === 'ADD_PEOPLE').length
    expect(actual).toBe(0)
  })

  it('Consolidates people with the same ID', () => {
    store.dispatch({
      type: 'FETCH_POST',
      payload
    })
    const action = store.getActions().filter(a => a.type === 'ADD_PEOPLE')[0]
    const actual = Object.keys(action.payload).map(id => Number(id))
    expect(actual.length).toBe([...new Set(actual)].length)
  })

  it('Has the correct payload', () => {
    store.dispatch({
      type: 'FETCH_POST',
      payload
    })
    const expected = 
    {
      '30002': {
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
      },
      '30003': {
        id: '30003',
        title: 'Yup',
        type: null,
        details: '<p>So true.</p>',
        creator: '46816',
        followers: [ '46816' ],
        followersTotal: '1',
        communities: [ '1836' ],
        communitiesTotal: '1',
        comments: [ '2' ],
        commentsTotal: '1',
        createdAt: 'Sat Mar 18 2017 10:49:43 GMT+1300 (NZDT)',
        startsAt: null,
        endsAt: null,
        fulfilledAt: null
      }
    }
    const actual = store.getActions().filter(a => a.type === 'ADD_POST')[0].payload
    expect(actual).toEqual(expected)
  })
})

