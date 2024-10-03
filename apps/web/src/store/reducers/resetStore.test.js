import { getEmptyState } from 'store'
import resetStore, { KEYS_PRESERVED_ON_RESET } from './resetStore'
import {
  LOGOUT,
  RESET_STORE
} from 'store/constants'

describe('resetStore', () => {
  it('resets to initial state on logout', () => {
    const fullInitialState = resetStore(getEmptyState(), {})
    const state = { foo: 'bar' }
    const action = { type: LOGOUT }
    const newState = resetStore(state, action)
    expect(newState).toEqual(fullInitialState)
  })

  it('preserves necessary state on reset', () => {
    const fullInitialState = resetStore(getEmptyState(), {})
    const preservedState = { [KEYS_PRESERVED_ON_RESET[0]]: 'foo' }
    const notPreservedState = { 'randomkey': 'foo' }
    const action = { type: RESET_STORE }
    const newState = resetStore({
      ...preservedState,
      ...notPreservedState
    }, action)
    expect(newState).toMatchObject(preservedState)
    expect(newState).not.toMatchObject(notPreservedState)
    expect(newState).toEqual({
      ...fullInitialState,
      ...preservedState
    })
  })
})
