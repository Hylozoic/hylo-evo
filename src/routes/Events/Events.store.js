export const MODULE_NAME = 'Events'
export const UPDATE_TIMEFRAME = `${MODULE_NAME}/UPDATE_TIMEFRAME`

export function updateTimeframe (timeframe) {
  return {
    type: UPDATE_TIMEFRAME,
    payload: timeframe
  }
}

// reducer
const DEFAULT_STATE = {
  timeframe: 'future'
}

export default function (state = DEFAULT_STATE, action) {
  if (action.type === UPDATE_TIMEFRAME) {
    return {
      ...state,
      timeframe: action.payload
    }
  }
  return state
}
