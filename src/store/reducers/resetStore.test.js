// import { rootReducer, initialState } from 'store'
// import { LOGOUT } from 'store/constants'

// describe('store', () => {
//   it('resets to initial state on logout', () => {
//     const fullInitialState = rootReducer(initialState, {})
//     const state = {foo: 'bar'}
//     const action = {type: LOGOUT}
//     const newState = rootReducer(state, action)
//     expect(newState).toEqual(fullInitialState)
//   })
// })
import { pick } from 'lodash/fp'
import { getEmptyState } from 'store'
import resetStore, { PRESERVE_STATE_ON_RESET } from './resetStore'
import {
  LOGOUT,
  RESET_STORE
} from 'store/constants'

describe('store', () => {
  it('resets to initial state on logout', () => {
    const fullInitialState = resetStore(getEmptyState(), {})
    const state = {foo: 'bar'}
    const action = {type: LOGOUT}
    const newState = resetStore(state, action)
    expect(newState).toEqual(fullInitialState)
  })

  it('preserves necessary state on reset', () => {
    const fullInitialState = resetStore(getEmptyState(), {})
    const state = {}
    state[PRESERVE_STATE_ON_RESET[0]] = 'foo'
    const action = {type: RESET_STORE}
    const newState = resetStore(state, action)
    expect(newState).toEqual({
      ...fullInitialState,
      ...state
    })
  })
})
