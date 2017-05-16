import { FETCH_POSTS } from 'store/constants'

export const ALL_COMMUNITIES_ID = 'all-communities'

export function fetchPosts ({ subject, id, sortBy, offset, search, filter }) {
  var query, extractModel

  if (subject === 'community') {
    query = communityQuery
    extractModel = 'Community'
  } else if (subject === 'all-communities') {
    query = allCommunitiesQuery
    id = ALL_COMMUNITIES_ID // this is just for queryResults, not the API
    extractModel = 'Post'
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
    meta: {extractModel}
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
      tagline
    }
    createdAt
    updatedAt
    commenters(first: 3) {
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
    myVote
    communities {
      id
      name
      slug
    }
  }
}`

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

const allCommunitiesQuery = `query (
  $sortBy: String,
  $offset: Int,
  $search: String,
  $filter: String,
  $first: Int
) {
  ${postsQueryFragment}
}`
