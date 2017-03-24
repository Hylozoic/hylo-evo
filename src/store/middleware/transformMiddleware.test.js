import configureStore from 'redux-mock-store'

import transformMiddleware from './transformMiddleware'
import { data } from './transformMiddleware.test.json'

it('Returns a function to handle next', () => {
  const nextHandler = transformMiddleware({ action: 'ADD_POST' })
  expect(typeof nextHandler).toBe('function')
  expect(nextHandler.length).toBe(1)
})

it('Returns a function to handle action', () => {
  const actionHandler = transformMiddleware({ action: 'ADD_POST' })()
  expect(typeof actionHandler).toBe('function')
  expect(actionHandler.length).toBe(1)
})

it('Returns the value of next', () => {
  const expected = 'Wombat'
  const nextHandler = transformMiddleware({ action: 'ADD_POST' })
  const actionHandler = nextHandler(() => expected)
  const actual = actionHandler()
  expect(actual).toBe(expected)
})

describe('Dispatching the correct actions', () => {
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

  it('Dispatches ADD_POST when payload includes a post', () => {
    store.dispatch({
      type: 'FETCH_POSTS',
      payload: data.me.posts
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

  it('Dispatches correct number of ADD_POST actions', () => {
    store.dispatch({
      type: 'FETCH_POSTS',
      payload: data.me.posts
    })
    const expected = data.me.posts.length
    const actual = store.getActions().filter(a => a.type === 'ADD_POST').length
    expect(actual).toBe(expected)
  })

  it('Has the correct payload', () => {
    store.dispatch({
      type: 'FETCH_POSTS',
      payload: data.me.posts
    })
    const expected = {
      id: '30002',
      title: 'Hello',
      details: '<p><a href="https://wombat.life">https://wombat.life</a></p>\n<p></p>\n<p></p>',
      type: null,
      creator: '46816',
      followersTotal: '1',
      communitiesTotal: '1',
      commentsTotal: '1',
      createdAt: 'Sat Mar 18 2017 10:48:43 GMT+1300 (NZDT)',
      startsAt: null,
      endsAt: null,
      fulfilledAt: null,
      followers: [ '46816' ],
      communities: [ '1836' ],
      comments: [ '1' ]
    }
    const actual = store.getActions().filter(a => a.type === 'ADD_POST')[0].payload
    expect(actual).toEqual(expected)
  })
})

