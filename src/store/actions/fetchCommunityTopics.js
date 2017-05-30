const FETCH_COMMUNITY_TOPICS = 'FETCH_COMMUNITY_TOPICS'

const communityTopicsQueryFragment = `
communityTopics(first: $first, offset: $offset, subscribed: $subscribed) {
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
query ($id: ID, $first: Int, $offset: Int, $subscribed: Boolean) {
  community (id: $id) {
    id
    ${communityTopicsQueryFragment}
  }
}
`

const rootQuery = `
query ($first: Int, $offset: Int, $subscribed: Boolean) {
  ${communityTopicsQueryFragment}
}
`

export default function fetchCommunityTopics (communityId, subscribed, offset = 0) {
  const query = communityId ? communityQuery : rootQuery
  return {
    type: FETCH_COMMUNITY_TOPICS,
    graphql: {
      query,
      variables: {
        id: communityId,
        first: 20,
        offset,
        subscribed
      }
    },
    meta: {
      extractModel: communityId ? 'Community' : 'CommunityTopic'
    }
  }
}
