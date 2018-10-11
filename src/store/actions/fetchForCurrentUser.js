import { get } from 'lodash/fp'
import { FETCH_FOR_CURRENT_USER } from 'store/constants'
import { communityTopicsQueryFragment } from 'store/actions/fetchCommunityTopics'
import { communityQueryFragment } from 'store/actions/fetchForCommunity'

export default function (slug, skipTopics) {
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
const queryVariables = slug => ({slug, first: 200, offset: 0, subscribed: true, updateLastViewed: true})

const meQueryFragment = `
me {
  id
  isAdmin
  name
  avatarUrl
  newNotificationCount
  unseenThreadCount
  location
  email
  bannerUrl
  bio
  tagline
  twitterName
  linkedinUrl
  facebookUrl
  url
  hasDevice
  intercomHash
  blockedUsers {
    id
    name
  }
  settings {
    signupInProgress
    digestFrequency
    dmNotifications
    commentNotifications
  }
  memberships {
    id
    lastViewedAt
    newPostCount
    hasModeratorRole
    settings {
      sendEmail
      sendPushNotifications
    }
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
        communities(first: 300) {
          items {
            id
            name
            slug
            avatarUrl
            network {
              id
            }
          }
        }
      }
    }
  }
}`
