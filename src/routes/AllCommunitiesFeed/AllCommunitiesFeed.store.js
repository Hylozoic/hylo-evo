import { FETCH_TOPICS } from 'store/constants'

const query =
`query ($name: String, $autocomplete: String, $first: Int, $offset: Int) {
  topics(name: $name, autocomplete: $autocomplete, first: $first, offset: $offset) {
    total
    hasMore
    items {
      id
      name
      postsTotal
      followersTotal
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
