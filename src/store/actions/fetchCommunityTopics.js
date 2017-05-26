const FETCH_COMMUNITY_TOPICS = 'FETCH_COMMUNITY_TOPICS'

export default function fetchCommunityTopics (communityId, subscribed, offset = 0) {
  return {
    type: FETCH_COMMUNITY_TOPICS,
    graphql: {
      query: `query ($id: ID, $first: Int, $offset: Int, $subscribed: Boolean) {
        community (id: $id) {
          id
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
        }
      }`,
      variables: {
        id: communityId,
        first: 20,
        offset,
        subscribed
      }
    },
    meta: {
      extractModel: 'Community'
    }
  }
}
