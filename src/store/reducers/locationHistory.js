import { LOCATION_CHANGE } from 'connected-react-router'

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
