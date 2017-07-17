import { FETCH_POSTS, STORE_CLEAR_FEED_LIST } from 'store/constants'

export function fetchPosts ({ subject, slug, sortBy, offset, search, filter, topic }) {
  var query, extractModel

  if (subject === 'community') {
    query = communityQuery
    extractModel = 'Community'
  } else if (subject === 'all-communities') {
    query = allCommunitiesQuery
    extractModel = 'Post'
  } else {
    throw new Error(`FETCH_POSTS with subject=${subject} is not implemented`)
  }

  return {
    type: FETCH_POSTS,
    graphql: {
      query,
      variables: {
        slug,
        sortBy,
        offset,
        search,
        filter,
        first: 20,
        topic
      }
    },
    meta: {extractModel}
  }
}

export const postsQueryFragment = `
posts(
  first: $first,
  offset: $offset,
  sortBy: $sortBy,
  search: $search,
  filter: $filter,
  topic: $topic,
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
      id
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
  $slug: String,
  $sortBy: String,
  $offset: Int,
  $search: String,
  $filter: String,
  $topic: Int,
  $first: Int
) {
  community(slug: $slug) {
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
  $topic: ID,
  $first: Int
) {
  ${postsQueryFragment}
}`

export function storeClearFeedList (action) {
  return {
    type: STORE_CLEAR_FEED_LIST,
    payload: action
  }
}

export default function (state = {}, action) {
  if (action.type === STORE_CLEAR_FEED_LIST) {
    return {
      ...state,
      clearFeedList: action.payload
    }
  }
  return state
}
