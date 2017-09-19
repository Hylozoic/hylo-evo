export const MODULE_NAME = 'AuthLayout'
const TOGGLE_DRAWER = `${MODULE_NAME}/TOGGLE_DRAWER`

export default function reducer (state = {}, action) {
  if (action.type === TOGGLE_DRAWER) {
    return {...state, isDrawerOpen: !state.isDrawerOpen}
  }
  return state
}

export function toggleDrawer () {
  return {
    type: TOGGLE_DRAWER
  }
}
