import { communityTopicsQueryFragment } from 'store/actions/fetchCommunityTopics'
import { get } from 'lodash/fp'

export const MODULE_NAME = 'PrimaryLayout'
const FETCH_FOR_CURRENT_USER = `${MODULE_NAME}/FETCH_FOR_CURRENT_USER`
const FETCH_FOR_COMMUNITY = `${MODULE_NAME}/FETCH_FOR_COMMUNITY`
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

export function fetchForCurrentUser (slug, skipTopics) {
  const query = slug
    ? `query ($slug: String, $first: Int, $offset: Int, $subscribed: Boolean) {
      ${meQueryFragment}
      ${communityQueryFragment}
    }`
    : (skipTopics
      ? `{
        ${meQueryFragment}
      }`
      : `query ($first: Int, $offset: Int, $subscribed: Boolean) {
        ${meQueryFragment}
        ${communityTopicsQueryFragment}
      }`)

  return {
    type: FETCH_FOR_CURRENT_USER,
    graphql: {query, variables: queryVariables(slug)},
    meta: {
      extractModel: [
        {
          getRoot: get('me'),
          modelName: 'Me'
        },
        {
          getRoot: get(slug ? 'community' : 'communityTopics'),
          modelName: slug ? 'Community' : 'CommunityTopic'
        }
      ]
    }
  }
}

export function fetchForCommunity (slug) {
  const query = slug
    ? `query ($slug: String, $first: Int, $offset: Int, $subscribed: Boolean) {
      ${communityQueryFragment}
    }`
    : `query ($first: Int, $offset: Int, $subscribed: Boolean) {
      ${communityTopicsQueryFragment}
    }`

  return {
    type: FETCH_FOR_COMMUNITY,
    graphql: {query, variables: queryVariables(slug)},
    meta: {
      extractModel: slug ? 'Community' : 'CommunityTopic'
    }
  }
}

const queryVariables = slug => ({slug, first: 20, offset: 0, subscribed: true})

const meQueryFragment = `
me {
  id
  name
  avatarUrl
  newNotificationCount
  unseenThreadCount
  memberships {
    id
    lastViewedAt
    newPostCount
    community {
      id
      name
      slug
      avatarUrl
    }
  }
}`

const communityQueryFragment = `
community(slug: $slug) {
  id
  name
  slug
  description
  avatarUrl
  memberCount
  members(first: 8, sortBy: "id", order: "desc") {
    items {
      id
      name
      avatarUrl
    }
  }
  moderators {
    items {
      id
      name
      avatarUrl
    }
  }
  ${communityTopicsQueryFragment}
}`
