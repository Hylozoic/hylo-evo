import { rootReducer, initialState } from 'store'
import { LOGOUT } from 'store/constants'

describe('store', () => {
  it('resets to initial state on logout', () => {
    const fullInitialState = rootReducer(initialState, {})
    const state = {foo: 'bar'}
    const action = {type: LOGOUT}
    const newState = rootReducer(state, action)
    expect(newState).toEqual(fullInitialState)
  })
})
