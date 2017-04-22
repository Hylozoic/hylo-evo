import { FETCH_POSTS } from 'store/constants'

export function fetchPosts ({ subject, id, sortBy, offset, search, filter }) {
  var query
  if (subject === 'community') {
    query = communityQuery
  } else if (subject === 'all-communities') {
    return {
      type: 'TODO: FETCH_POSTS for all communities'
    }
  } else {
    throw new Error(`FETCH_POSTS with subject=${subject} is not implemented`)
  }

  return {
    type: FETCH_POSTS,
    graphql: {
      query,
      variables: {
        id,
        sortBy,
        offset,
        search,
        filter,
        first: 20
      }
    },
    meta: {
      extractModel: 'Community'
    }
  }
}

const postsQueryFragment = `
  posts(
    first: $first,
    offset: $offset,
    sortBy: $sortBy,
    search: $search,
    filter: $filter,
    order: "desc"
  ) {
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
`

const communityQuery = `query (
  $id: String,
  $sortBy: String,
  $offset: Int,
  $search: String,
  $filter: String,
  $first: Int
) {
  community(slug: $id) {
    id
    slug
    name
    avatarUrl
    bannerUrl
    postCount
${postsQueryFragment}
  }
}`
