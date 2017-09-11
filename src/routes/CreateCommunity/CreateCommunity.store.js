export const MODULE_NAME = `CREATE_COMMUNITY`
export const ADD_COMMUNITY_NAME = `${MODULE_NAME}_ADD_COMMUNITY_NAME`
export const ADD_COMMUNITY_DOMAIN = `${MODULE_NAME}_ADD_COMMUNITY_DOMAIN`
export const ADD_COMMUNITY_PRIVACY = `${MODULE_NAME}_ADD_COMMUNITY_PRIVACY`

export const FETCH_COMMUNITY_EXISTS = `${MODULE_NAME}_FETCH_COMMUNITY_EXISTS`

export default function reducer (state = {}, action) {
  if (action.type === ADD_COMMUNITY_NAME) {
    return {...state, name: action.payload.name}
  }
  if (action.type === ADD_COMMUNITY_DOMAIN) {
    return {...state, domain: action.payload.domain}
  }
  if (action.type === ADD_COMMUNITY_PRIVACY) {
    return {...state, privacy: action.payload.privacy}
  }
  if (action.type === FETCH_COMMUNITY_EXISTS) {
    return {...state, domainExists: action.payload.data.communityExists.data}
  }
  return state
}

export function addCommunityName (name) {
  return {
    type: ADD_COMMUNITY_NAME,
    payload: {
      name
    }
  }
}

export function addCommunityPrivacy (privacy) {
  return {
    type: ADD_COMMUNITY_PRIVACY,
    payload: {
      privacy
    }
  }
}

export function addCommunityDomain (domain) {
  return {
    type: ADD_COMMUNITY_DOMAIN,
    payload: {
      domain
    }
  }
}
