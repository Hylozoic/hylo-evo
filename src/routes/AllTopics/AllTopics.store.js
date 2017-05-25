const FETCH_COMMUNITY_TOPICS = 'FETCH_COMMUNITY_TOPICS'

export function fetchCommunityTopics (communityId, offset = 0) {
  return {
    type: FETCH_COMMUNITY_TOPICS,
    graphql: {
      query: `query ($id: ID, $first: Int, $offset: Int) {
        community (id: $id) {
          id
          communityTopics(first: $first, offset: $offset) {
            hasMore
            items {
              id
              postsTotal
              followersTotal
              isSubscribed
              topic {
                id
                name
              }
            }
          }
        }
      }`,
      variables: {
        id: communityId,
        first: 20,
        offset
      }
    },
    meta: {
      extractModel: 'Community'
    }
  }
}
