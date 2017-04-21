import { mockReduxStore } from 'tests/mocks'
import optimisticMiddleware from 'store/middleware/optimisticMiddleware'
import graphqlMiddleware from 'store/middleware/graphql'
import { SET_STATE } from 'store/constants'

describe('optimisticMiddleware', () => {
  let next, initialState, store, middleware

  beforeEach(() => {
    initialState = {
      aReducer: {a: 1, b: 2}
    }
    store = {dispatch: jest.fn(), getState: () => initialState}
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
      return middleware(next)(action)
      .then(() => {
        expect(next).toHaveBeenCalled()
        expect(store.dispatch).toBeCalledWith({type: SET_STATE, payload: initialState})
      })
    })
  })
})

describe('graphqlMiddleware', () => {
  let next, initialState, store, middleware

  const expectMetaThenToReject = (shouldReject, action) =>
    middleware(next)(action)
    .then(({meta}) => {
      expect(next).toHaveBeenCalled()
      const then = meta.then
      let rejected = false
      return Promise.resolve(action.payload)
      .then(then)
      .then(result => result, reject => { rejected = true })
      .then(() => {
        expect(rejected).toEqual(shouldReject)
      })
    })

  beforeEach(() => {
    initialState = {
      aReducer: {a: 1, b: 2}
    }
    store = mockReduxStore(initialState)
    middleware = graphqlMiddleware(store)
    next = jest.fn(val => Promise.resolve(val))
  })

  it('adds a then that rejects when there are errors', () => {
    const action = {
      type: 'FOO',
      graphql: true,
      payload: {
        errors: [{message: 'problems'}]
      }
    }
    return expectMetaThenToReject(true, action)
  })

  it('adds a then that passes through the payload when there are no errors', () => {
    const action = {
      type: 'FOO',
      graphql: true,
      payload: {
        data: 'no problems'
      }
    }
    return expectMetaThenToReject(false, action)
  })
})
