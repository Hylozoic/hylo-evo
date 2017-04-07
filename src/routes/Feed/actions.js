import { FETCH_POSTS } from 'store/constants'

export function fetchPosts (slug, opts = {}) {
  return {
    type: FETCH_POSTS,
    graphql: {
      query: `query ($slug: String, $first: Int, $cursor: ID) {
        community(slug: $slug) {
          id
          slug
          name
          avatarUrl
          bannerUrl
          postCount
          posts(first: $first, cursor: $cursor, order: "desc") {
            id
            title
            details
            type
            creator {
              id
              name
              avatarUrl
            }
            createdAt
            updatedAt
            commenters(first: 2) {
              id
              name
              avatarUrl
            }
            commentersTotal
            linkPreview {
              title
              url
              imageUrl
            }
            votesTotal
            communities {
              id
              name
              slug
            }
          }
        }
      }`,
      variables: {
        slug,
        first: opts.first || 20,
        cursor: opts.cursor
      }
    }
  }
}
