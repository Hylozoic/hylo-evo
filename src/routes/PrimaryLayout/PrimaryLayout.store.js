import { communityTopicsQueryFragment } from 'store/actions/fetchCommunityTopics'
import { get } from 'lodash/fp'

export const MODULE_NAME = 'PrimaryLayout'
const FETCH_FOR_CURRENT_USER = `${MODULE_NAME}/FETCH_FOR_CURRENT_USER`
const FETCH_FOR_COMMUNITY = `${MODULE_NAME}/FETCH_FOR_COMMUNITY`
export const FETCH_FOR_COMMUNITY_PENDING = FETCH_FOR_COMMUNITY + '_PENDING'
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
    ? `query ($slug: String, $first: Int, $offset: Int, $sortBy: String, $order: String, $autocomplete: String, $subscribed: Boolean, $updateLastViewed: Boolean) {
      ${meQueryFragment}
      ${communityQueryFragment}
    }`
    : (skipTopics
      ? `{
        ${meQueryFragment}
      }`
      : `query ($first: Int, $offset: Int, $sortBy: String, $order: String, $autocomplete: String, $subscribed: Boolean) {
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
          modelName: 'Me',
          append: true
        },
        {
          getRoot: get(slug ? 'community' : 'communityTopics'),
          modelName: slug ? 'Community' : 'CommunityTopic',
          append: true
        }
      ]
    }
  }
}

export function fetchForCommunity (slug) {
  const query = slug
    ? `query ($slug: String, $first: Int, $offset: Int, $sortBy: String, $order: String, $autocomplete: String, $subscribed: Boolean, $updateLastViewed: Boolean) {
      ${communityQueryFragment}
    }`
    : `query ($first: Int, $offset: Int, $sortBy: String, $order: String, $autocomplete: String, $subscribed: Boolean) {
      ${communityTopicsQueryFragment}
    }`

  return {
    type: FETCH_FOR_COMMUNITY,
    graphql: {query, variables: queryVariables(slug)},
    meta: {
      extractModel: slug ? 'Community' : 'CommunityTopic',
      slug
    }
  }
}

// the value of `first` is high because we are receiving unaggregated data from
// the API, so there could be many duplicates
const queryVariables = slug => ({slug, first: 200, offset: 0, subscribed: true, updateLastViewed: true})

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
    hasModeratorRole
    community {
      id
      name
      slug
      avatarUrl
      network {
        id
        slug
        name
        avatarUrl
        communities {
          items {
            id
          }
        }
      }
    }
  }
}`

const communityQueryFragment = `
community(slug: $slug, updateLastViewed: $updateLastViewed) {
  id
  name
  slug
  description
  avatarUrl
  network {
    id
    slug
    name
    avatarUrl
    communities {
      items {
        id
      }
    }
  }
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
