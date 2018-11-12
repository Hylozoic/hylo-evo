import { get } from 'lodash/fp'
import {
  FETCH_POST,
  FETCH_COMMENTS
} from 'store/constants'

export const getPostFieldsFragment = withComments => `
  id
  announcement
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
  commenters(first: 3) {
    id
    name
    avatarUrl
  }
  commentersTotal
  ${withComments ? `comments(first: 10, order: "desc") {
    items {
      id
      text
      creator {
        id
        name
        avatarUrl
      }
      attachments {
        id
        url
      }
      createdAt
    }
    total
    hasMore
  }` : ''}
  linkPreview {
    id
    title
    url
    imageUrl
  }
  votesTotal
  myVote
  acceptContributions
  totalContributions
  communities {
    id
    name
    slug
  }
  attachments {
    id
    position
    type
    url
  }
  postMemberships {
    id
    pinned
    community {
      id
    }
  }
  topics {
    id
    name
    postsTotal
    followersTotal
  }
  members {
    total
    hasMore
    items {
      id
      name
      avatarUrl
      bio
      tagline
      location  
      skills (first: 100) {
        items {
          id
          name
        }
      }
    }
  }`

export default function fetchPost (id, opts = {}) {
  return {
    type: FETCH_POST,
    graphql: {
      query: `query ($id: ID) {
        post(id: $id) {
          ${getPostFieldsFragment(true)}
        }
      }`,
      variables: {
        id
      }
    },
    meta: {
      extractModel: 'Post',
      extractQueryResults: {
        getType: () => FETCH_COMMENTS,
        getItems: get('payload.data.post.comments')
      }
    }
  }
}
