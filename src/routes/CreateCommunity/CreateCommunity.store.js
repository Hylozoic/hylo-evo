export const MODULE_NAME = `CreateCommunity`
export const ADD_COMMUNITY_NAME = `${MODULE_NAME}/ADD_COMMUNITY_NAME`
export const ADD_COMMUNITY_DOMAIN = `${MODULE_NAME}/ADD_COMMUNITY_DOMAIN`
export const ADD_COMMUNITY_PRIVACY = `${MODULE_NAME}/ADD_COMMUNITY_PRIVACY`
export const ADD_NETWORK_ID = `${MODULE_NAME}/ADD_NETWORK_ID`

export const FETCH_COMMUNITY_EXISTS = `${MODULE_NAME}/FETCH_COMMUNITY_EXISTS`

export default function reducer (state = {}, action) {
  if (action.type === ADD_COMMUNITY_NAME) {
    return {...state, name: action.payload}
  }
  if (action.type === ADD_COMMUNITY_DOMAIN) {
    return {...state, domain: action.payload}
  }
  if (action.type === ADD_COMMUNITY_PRIVACY) {
    return {...state, privacy: action.payload}
  }
  if (action.type === ADD_NETWORK_ID) {
    return {...state, networkId: action.payload}
  }
  if (action.type === FETCH_COMMUNITY_EXISTS) {
    return {...state, domainExists: action.payload.data.communityExists.exists}
  }
  return state
}

export function addCommunityName (name) {
  return {
    type: ADD_COMMUNITY_NAME,
    payload: name
  }
}

export function addCommunityPrivacy (privacy) {
  return {
    type: ADD_COMMUNITY_PRIVACY,
    payload: privacy
  }
}

export function addCommunityDomain (domain) {
  return {
    type: ADD_COMMUNITY_DOMAIN,
    payload: domain
  }
}

export function addNetworkId (networkId) {
  return {
    type: ADD_NETWORK_ID,
    payload: networkId
  }
}

export function fetchCommunityExists (slug) {
  return {
    type: FETCH_COMMUNITY_EXISTS,
    graphql: {
      query: `
        query ($slug: String) {
          communityExists (slug: $slug) {
            exists
          }
        }
      `,
      variables: {
        slug
      }
    }
  }
}
