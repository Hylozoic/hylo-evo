import { LOCATION_CHANGE } from 'react-router-redux'

const initialState = {
  previousLocation: null,
  currentLocation: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return {
        previousLocation: state.currentLocation,
        currentLocation: action.payload.pathname
      }
    default:
      return state
  }
}
