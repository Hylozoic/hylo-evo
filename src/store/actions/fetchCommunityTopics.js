import { get } from 'lodash/fp'
export const FETCH_COMMUNITY_TOPICS = 'FETCH_COMMUNITY_TOPICS'

export const communityTopicsQueryFragment = `
communityTopics(
  first: $first,
  offset: $offset,
  sortBy: $sortBy,
  order: $order,
  subscribed: $subscribed,
  autocomplete: $autocomplete
) {
  hasMore
  total
  items {
    id
    postsTotal
    followersTotal
    isSubscribed
    newPostCount
    topic {
      id
      name
    }
  }
}
`

const communityQuery = `
query (
  $id: ID,
  $first: Int,
  $offset: Int,
  $sortBy: String,
  $order: String,
  $subscribed: Boolean,
  $autocomplete: String
) {
  community (id: $id) {
    id
    ${communityTopicsQueryFragment}
  }
}
`

const rootQuery = `
query ($first: Int, $offset: Int, $subscribed: Boolean, $autocomplete: String) {
  ${communityTopicsQueryFragment}
}
`

export default function fetchCommunityTopics (communityId, {
  subscribed = false, first = 20, offset = 0, sortBy, autocomplete = ''
}) {
  let query, extractModel, getItems
  if (communityId) {
    query = communityQuery
    extractModel = 'Community'
    getItems = get('community.communityTopics')
  } else {
    query = rootQuery
    extractModel = 'CommunityTopic'
    getItems = get('communityTopics')
  }
  return {
    type: FETCH_COMMUNITY_TOPICS,
    graphql: {
      query,
      variables: {
        id: communityId,
        first,
        offset,
        subscribed,
        autocomplete,
        sortBy,
        order: 'desc'
      }
    },
    meta: {
      extractModel,
      extractQueryResults: {
        getItems
      }
    }
  }
}
