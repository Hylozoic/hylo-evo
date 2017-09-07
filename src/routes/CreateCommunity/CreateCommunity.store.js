export const MODULE_NAME = `CREATE_COMMUNITY`
export const ADD_COMMUNITY_NAME = `${MODULE_NAME}_ADD_COMMUNITY_NAME`
export const ADD_COMMUNITY_DOMAIN = `${MODULE_NAME}_ADD_COMMUNITY_DOMAIN`

export default function reducer (state = {}, action) {
  if (action.type === ADD_COMMUNITY_NAME) {
    return {...state, name: action.payload.name}
  }
  if (action.type === ADD_COMMUNITY_DOMAIN) {
    return {...state, domain: action.payload.domain}
  }
  return state
}
