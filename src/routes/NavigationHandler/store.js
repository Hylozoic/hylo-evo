const NAVIGATE = 'NAVIGATE'
const RESET_NAVIGATION = 'RESET_NAVIGATION'

export function navigate (to) {
  return {
    type: NAVIGATE,
    payload: {to}
  }
}

export function resetNavigation (to) {
  return {type: RESET_NAVIGATION}
}

const reducer = (state = null, { type, error, payload, meta }) => {
  switch (type) {
    case NAVIGATE:
      return payload.to
    case RESET_NAVIGATION:
      return null
  }
  return state
}

export default reducer
