import { FETCH_COMMUNITY_TOPICS } from 'store/constants'

const query =
`query ($topicName: String, $communitySlug: String, $first: Int, $offset: Int, $autocomplete: String) {
  communityTopics(topicName: $topicName, communitySlug: $communitySlug, first: $first, offset: $offset, autocomplete: $autocomplete) {
    total
    hasMore
    items {
      id
      postsTotal
      followersTotal
      topic {
        id
        name
      }
      community {
        id
      }
    }
  }
}`

export function fetchCommunityTopics (topicName, communitySlug, opts = {}) {
  return {
    type: FETCH_COMMUNITY_TOPICS,
    graphql: {
      query,
      variables: {
        topicName,
        communitySlug,
        autocomplete: opts.autocomplete,
        first: opts.first,
        offset: opts.offset
      }
    },
    meta: {
      extractModel: 'CommunityTopic'
    }
  }
}
