import { get } from 'lodash/fp'
import { communityTopicsQueryFragment } from 'store/actions/fetchCommunityTopics'
import { FETCH_FOR_CURRENT_USER } from 'store/constants'

export default function fetchForCurrentUser (slug, skipTopics) {
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

// the value of `first` is high because we are receiving unaggregated data from
// the API, so there could be many duplicates
export const queryVariables = slug => ({slug, first: 200, offset: 0, subscribed: true, updateLastViewed: true})

const meQueryFragment = `
me {
  id
  name
  avatarUrl
  newNotificationCount
  unseenThreadCount
  location
  email
  settings {
    signupInProgress
  }
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
        communities(first: 100) {
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
    communities(first: 100) {
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
