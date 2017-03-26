import configureStore from 'redux-mock-store'

import transformMiddleware from './transformMiddleware'
import { data } from './transformMiddleware.test.json'

it('Returns a function to handle next', () => {
  const nextHandler = transformMiddleware({ action: 'ADD_POSTS' })
  expect(typeof nextHandler).toBe('function')
  expect(nextHandler.length).toBe(1)
})

it('Returns a function to handle action', () => {
  const actionHandler = transformMiddleware({ action: 'ADD_POSTS' })()
  expect(typeof actionHandler).toBe('function')
  expect(actionHandler.length).toBe(1)
})

it('Returns the value of next', () => {
  const expected = 'Wombat'
  const nextHandler = transformMiddleware({ action: 'ADD_POSTS' })
  const actionHandler = nextHandler(() => expected)
  const actual = actionHandler()
  expect(actual).toBe(expected)
})

describe('Actions', () => {
  let store = null
  let mockStore = configureStore([transformMiddleware])

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

  it('Dispatches ADD_POSTS when payload includes a post', () => {
    store.dispatch({
      type: 'FETCH_POSTS',
      payload: data.me.posts
    })
    const actual = store.getActions().find(a => a.type === 'ADD_POSTS')
    expect(actual).toBeTruthy()
  })

  it('Does not dispatch ADD_POSTS when payload does not include a post', () => {
    store.dispatch({
      type: 'FETCH_POSTS',
      payload: []
    })
    const actual = store.getActions().find(a => a.type === 'ADD_POSTS')
    expect(actual).toBeFalsy()
  })

  it('Dispatches a single ADD_POSTS action when a post is present', () => {
    store.dispatch({
      type: 'FETCH_POSTS',
      payload: data.me.posts
    })
    const actual = store.getActions().filter(a => a.type === 'ADD_POSTS').length
    expect(actual).toBe(1)
  })

  it('Sends the correct number of posts in the ADD_POSTS payload', () => {
    store.dispatch({
      type: 'FETCH_POSTS',
      payload: data.me.posts
    })
    const expected = data.me.posts.length
    const action = store.getActions().filter(a => a.type === 'ADD_POSTS')[0]
    const actual = Object.keys(action.payload).length
    expect(actual).toBe(expected)
  })

  it('Dispatches a single ADD_COMMENTS action when a comment is present', () => {
    store.dispatch({
      type: 'FETCH_POSTS',
      payload: data.me.posts
    })
    // Comments are consolidated into a single action
    const expected = 1
    const actual = store.getActions().filter(a => a.type === 'ADD_COMMENTS').length
    expect(actual).toBe(expected)
  })

  it('Sends the correct number of comments in ADD_COMMENTS payload', () => {
    store.dispatch({
      type: 'FETCH_POSTS',
      payload: data.me.posts
    })
    const expected = data.me.posts.reduce((total, post) => total + post.comments.length, 0)
    const action = store.getActions().filter(a => a.type === 'ADD_COMMENTS')[0]
    const actual = Object.keys(action.payload).length
    expect(actual).toBe(expected)
  })

  it('Does not dispatch ADD_COMMENTS when no comment is present', () => {
    store.dispatch({
      type: 'FETCH_POSTS',
      payload: data.me.posts.map(p => ({ ...p, comments: [] }))
    })
    const actual = store.getActions().filter(a => a.type === 'ADD_COMMENTS').length
    expect(actual).toBe(0)
  })

  it('Dispatches ADD_COMMUNITIES for communities', () => {
    store.dispatch({
      type: 'FETCH_POSTS',
      payload: data.me.posts
    })
    // Communities should be consolidated: there's a single community repeated twice in test data
    const expected = 1
    const actual = store.getActions().filter(a => a.type === 'ADD_COMMUNITIES').length
    expect(actual).toBe(expected)
  })

  it('Dispatches a single ADD_PEOPLE action when a person is present', () => {
    store.dispatch({
      type: 'FETCH_POSTS',
      payload: data.me.posts
    })
    const actual = store.getActions().filter(a => a.type === 'ADD_PEOPLE').length
    expect(actual).toBe(1)
  })

  it('Does not dispatch ADD_PEOPLE when no person is present', () => {
    store.dispatch({
      type: 'FETCH_POSTS',
      payload: data.me.posts.map(({ id, name }) => ({ id, name }))
    })
    const actual = store.getActions().filter(a => a.type === 'ADD_PEOPLE').length
    expect(actual).toBe(0)
  })

  it('Has the correct payload', () => {
    store.dispatch({
      type: 'FETCH_POSTS',
      payload: data.me.posts
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
    const actual = store.getActions().filter(a => a.type === 'ADD_POSTS')[0].payload
    expect(actual).toEqual(expected)
  })
})

