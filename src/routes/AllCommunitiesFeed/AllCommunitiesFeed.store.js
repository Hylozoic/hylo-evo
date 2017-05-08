import { FETCH_TOPICS } from 'store/constants'

const query =
`query ($name: String, $autocomplete: String, $first: Int, $offset: Int) {
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

export function fetchTopics (opts) {
  return {
    type: FETCH_TOPICS,
    graphql: {
      query,
      variables: {
        name: opts.name,
        autocomplete: opts.autocomplete,
        first: opts.first,
        offset: opts.offset
      }
    },
    meta: {
      extractModel: 'Topic'
    }
  }
}
