import { FETCH_POSTS } from 'store/constants'

export function fetchPosts (slug, sortBy, offset, search) {
  return {
    type: FETCH_POSTS,
    graphql: {
      query: `query ($slug: String, $sortBy: String, $offset: Int, $search: String, $first: Int) {
        community(slug: $slug) {
          id
          slug
          name
          avatarUrl
          bannerUrl
          postCount
          posts(first: $first, offset: $offset, sortBy: $sortBy, search: $search, order: "desc") {
            hasMore
            items {
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
        }
      }`,
      variables: {
        slug,
        sortBy,
        offset,
        search,
        first: 20
      }
    },
    meta: {
      extractModel: 'Community'
    }
  }
}
