import { SET_STATE } from 'store/constants'

export const composeReducers = (...reducers) => (state, action) =>
  reducers.reduce((newState, reducer) => reducer(newState, action), state)

export const handleSetState = (state = {}, { type, payload }) =>
  type === SET_STATE ? payload : state
