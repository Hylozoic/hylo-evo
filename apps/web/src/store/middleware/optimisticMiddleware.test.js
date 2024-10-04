import optimisticMiddleware from 'store/middleware/optimisticMiddleware'
import { SET_STATE } from 'store/constants'

describe('optimisticMiddleware', () => {
  let next, initialState, store, middleware

  beforeEach(() => {
    initialState = {
      aReducer: { a: 1, b: 2 }
    }
    store = { dispatch: jest.fn(), getState: () => initialState }
    middleware = optimisticMiddleware(store)
    next = jest.fn(val => Promise.resolve(val))
  })

  it('continues the chain for a non optimistic action', () => {
    let action = { type: 'FOO', payload: { id: 3 } }
    middleware(next)(action)
    expect(next).toHaveBeenCalled()
  })

  describe('with a promise payload and meta.optimistic', () => {
    it('dispatches SET_STATE on error', () => {
      const error = new Error('promise failed')
      const action = {
        type: 'FOO',
        payload: Promise.reject(error),
        meta: { optimistic: true }
      }

      expect.assertions(3)

      return middleware(next)(action)
        .then(() => {
          expect(next).toHaveBeenCalled()
          expect(store.dispatch).toBeCalledWith({
            type: SET_STATE,
            payload: initialState,
            meta: { error }
          })

          return action.payload.catch(err => {
            expect(err).toEqual(error)
          })
        })
    })
  })
})
