export const MODULE_NAME = `CREATE_COMMUNITY`
export const ADD_COMMUNITY_NAME = `${MODULE_NAME}_ADD_COMMUNITY_NAME`

export default function reducer (state = {}, action) {
  if (action.type === ADD_COMMUNITY_NAME) {
    return {...state, name: action.payload.name}
  }
  return state
}
