import { FETCH_FOR_COMMUNITY } from 'store/constants'
import { communityTopicsQueryFragment } from 'store/actions/fetchCommunityTopics'

export default function (slug) {
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

export const communityQueryFragment = `
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
    communities(first: 300) {
      items {
        id
      }
    }
  }
  memberCount
  members(first: 8, sortBy: "name", order: "desc") {
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
