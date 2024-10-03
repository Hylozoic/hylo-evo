import { LOCATION_CHANGE } from 'redux-first-history'

const initialState = {
  previousLocation: null,
  currentLocation: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return {
        previousLocation: state.currentLocation,
        currentLocation: action.payload.location
      }
    default:
      return state
  }
}
