import { mockReduxStore } from 'tests/mocks'
import optimisticMiddleware from 'store/middleware/optimisticMiddleware'
import grapphqlMiddleware from 'store/middleware/graphql'
import { SET_STATE } from 'store/constants'

describe('optimisticMiddleware', () => {
  let next, initialState, store, middleware

  beforeEach(() => {
    initialState = {
      aReducer: {a: 1, b: 2}
    }
    store = mockReduxStore(initialState)
    middleware = optimisticMiddleware(store)
    next = jest.fn(val => Promise.resolve(val))
  })

  it('continues the chain for a non optimistic action', () => {
    let action = {type: 'FOO', payload: {id: 3}}
    middleware(next)(action)
    expect(next).toHaveBeenCalled()
  })

  describe('with a promise payload and meta.optimistic', () => {
    it('dispatches SET_STATE on error', () => {
      const action = {
        type: 'FOO',
        payload: Promise.reject(new Error('promise failed')),
        meta: {optimistic: true}
      }
      let setStatePayload
      store.transformAction(SET_STATE, action => {
        setStatePayload = action.payload
      })
      return middleware(next)(action)
      .then(() => {
        expect(next).toHaveBeenCalled()
        expect(setStatePayload).toEqual(store.getState())
        expect(setStatePayload).toEqual(initialState)
      })
    })
  })
})

describe('graphqlMiddleware', () => {
  let next, initialState, store, middleware

  beforeEach(() => {
    initialState = {
      aReducer: {a: 1, b: 2}
    }
    store = mockReduxStore(initialState)
    middleware = graphqlMiddleware(store)
    next = jest.fn(val => Promise.resolve(val))
  })


  describe('with a promise payload and meta.optimistic', () => {
    it('dispatches SET_STATE on error', () => {
      const action = {
        type: 'FOO',
        payload: Promise.reject(new Error('promise failed')),
        meta: {optimistic: true}
      }
      let setStatePayload
      store.transformAction(SET_STATE, action => {
        setStatePayload = action.payload
      })
      return middleware(next)(action)
      .then(() => {
        expect(next).toHaveBeenCalled()
        expect(setStatePayload).toEqual(store.getState())
        expect(setStatePayload).toEqual(initialState)
      })
    })
  })
})
