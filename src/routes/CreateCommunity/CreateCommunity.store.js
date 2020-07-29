import { CREATE_COMMUNITY } from './Review/Review.store'
export const MODULE_NAME = `CreateCommunity`
export const ADD_COMMUNITY_NAME = `${MODULE_NAME}/ADD_COMMUNITY_NAME`
export const ADD_COMMUNITY_DOMAIN = `${MODULE_NAME}/ADD_COMMUNITY_DOMAIN`
export const ADD_COMMUNITY_PRIVACY = `${MODULE_NAME}/ADD_COMMUNITY_PRIVACY`
export const ADD_COMMUNITY_TEMPLATE = `${MODULE_NAME}/ADD_COMMUNITY_TEMPLATE`
export const SET_DEFAULT_TOPICS = `${MODULE_NAME}/SET_DEFAULT_TOPICS`
export const ADD_DEFAULT_TOPIC = `${MODULE_NAME}/ADD_DEFAULT_TOPIC`
export const REMOVE_DEFAULT_TOPIC = `${MODULE_NAME}/REMOVE_DEFAULT_TOPIC`
export const ADD_NETWORK_ID = `${MODULE_NAME}/ADD_NETWORK_ID`

export const FETCH_COMMUNITY_EXISTS = `${MODULE_NAME}/FETCH_COMMUNITY_EXISTS`
export const FETCH_COMMUNITY_TEMPLATES = `${MODULE_NAME}/FETCH_COMMUNITY_TEMPLATES`

const defaultState = {
  communityTemplates: [],
  defaultTopics: []
}

export default function reducer (state = defaultState, action) {
  const { error, payload, type } = action

  if (type === ADD_COMMUNITY_NAME) {
    return { ...state, name: payload }
  }
  if (type === ADD_COMMUNITY_DOMAIN) {
    return { ...state, domain: payload }
  }
  if (type === ADD_COMMUNITY_PRIVACY) {
    return { ...state, privacy: payload }
  }
  if (type === ADD_NETWORK_ID) {
    return { ...state, networkId: payload }
  }
  if (type === ADD_COMMUNITY_TEMPLATE) {
    return { ...state, templateId: payload }
  }
  if (type === SET_DEFAULT_TOPICS) {
    return { ...state, defaultTopics: payload }
  }
  if (type === ADD_DEFAULT_TOPIC) {
    return { ...state, defaultTopics: state.defaultTopics.concat(payload) }
  }
  if (type === REMOVE_DEFAULT_TOPIC) {
    return { ...state, defaultTopics: state.defaultTopics.filter(t => t !== payload) }
  }
  if (type === FETCH_COMMUNITY_EXISTS) {
    // console.log("exists", action.payload, 'data = ', payload.data)
    return { ...state, domainExists: payload.data ? payload.data.communityExists.exists : false }
  }
  if (type === FETCH_COMMUNITY_TEMPLATES) {
    return { ...state, communityTemplates: payload.data.communityTemplates }
  }
  if (type === CREATE_COMMUNITY) {
    if (!error) {
      return defaultState
    }
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

export function addCommunityTemplate (templateId) {
  return {
    type: ADD_COMMUNITY_TEMPLATE,
    payload: templateId
  }
}

export function setDefaultTopics (topics) {
  return {
    type: SET_DEFAULT_TOPICS,
    payload: topics
  }
}

export function addDefaultTopic (topic) {
  return {
    type: ADD_DEFAULT_TOPIC,
    payload: topic
  }
}

export function removeDefaultTopic (topic) {
  return {
    type: REMOVE_DEFAULT_TOPIC,
    payload: topic
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

export function fetchCommunityTemplates () {
  return {
    type: FETCH_COMMUNITY_TEMPLATES,
    graphql: {
      query: `
        query {
          communityTemplates {
            id
            displayName
            defaultTopics {
              id
              name
            }
          }
        }
      `
    }
  }
}
