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
  $subscribed: Boolean
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
  const query = communityId ? communityQuery : rootQuery
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
      extractModel: communityId ? 'Community' : 'CommunityTopic'
    }
  }
}
