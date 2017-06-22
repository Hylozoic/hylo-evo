import createStore from 'store'
import { LOGOUT } from 'store/constants'

describe('store', () => {
  let store = createStore(null)

  it('resets to initial state on logout', () => {
    let initialState = store.getState()
    const action = {
      type: 'FOO',
      payload: {
        data: {
          post: {
            id: '1',
            title: 'Cat on the loose'
          }
        }
      },
      meta: {
        extractModel: 'Post'
      }
    }

    store.dispatch(action)

    expect(store.getState()).not.toEqual(initialState)

    store.dispatch({type: LOGOUT})

    expect(store.getState()).toEqual(initialState)
  })
})
