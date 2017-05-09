import { FETCH_COMMUNITY_TOPICS } from 'store/constants'

const query =
`query ($slug: String, $name: String, $first: Int, $offset: Int, $autocomplete: String) {
  community(slug: $slug) {
    id
    communityTopics(name: $name, autocomplete: $autocomplete, first: $first, offset: $offset) {
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
  }
}`

export function fetchCommunityTopics (name, slug, opts = {}) {
  return {
    type: FETCH_COMMUNITY_TOPICS,
    graphql: {
      query,
      variables: {
        slug,
        name,
        autocomplete: opts.autocomplete,
        first: opts.first,
        offset: opts.offset
      }
    },
    meta: {
      extractModel: 'Community'
    }
  }
}
