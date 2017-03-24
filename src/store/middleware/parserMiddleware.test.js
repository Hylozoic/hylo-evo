import configureStore from 'redux-mock-store'

import parserMiddleware from './parserMiddleware'
import { data } from './parserMiddleware.test.json'

it('Returns a function to handle next', () => {
  const nextHandler = parserMiddleware({ action: 'ADD_POST' })
  expect(typeof nextHandler).toBe('function')
  expect(nextHandler.length).toBe(1)
})

it('Returns a function to handle action', () => {
  const actionHandler = parserMiddleware({ action: 'ADD_POST' })()
  expect(typeof actionHandler).toBe('function')
  expect(actionHandler.length).toBe(1)
})

it('Returns the value of next', () => {
  const expected = 'Wombat'
  const nextHandler = parserMiddleware({ action: 'ADD_POST' })
  const actionHandler = nextHandler(() => expected)
  const actual = actionHandler()
  expect(actual).toBe(expected)
})

describe('Dispatching the correct actions', () => {
  let store = null
  let mockStore = configureStore([parserMiddleware])

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
      payload: data
    })
    const actual = store.getActions().find(a => a.type === 'ADD_POST')
    expect(actual).toBeTruthy()
  })

  it('Does not dispatch ADD_POST when payload does not include a post', () => {
    store.dispatch({
      type: 'FETCH_POSTS',
      payload: {}
    })
    const actual = store.getActions().find(a => a.type === 'ADD_POST')
    expect(actual).toBeFalsy()
  })

  it('Dispatches correct number of ADD_POST actions', () => {
    store.dispatch({
      type: 'FETCH_POSTS',
      payload: data
    })
    const expected = data.me.posts.length
    const actual = store.getActions().filter(a => a.type === 'ADD_POST').length
    expect(actual).toBe(expected)
  })
})

