import { get } from 'lodash/fp'
import {
  FETCH_POST,
  FETCH_COMMENTS
} from 'store/constants'

export const postFieldsFragment = `
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
  commenters(first: 3) {
    id
    name
    avatarUrl
  }
  commentersTotal
  comments(first: 10, order: "desc") {
    items {
      id
      text
      creator {
        id
        name
        avatarUrl
      }
      createdAt
    }
    total
    hasMore
  }
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
  attachments {
    id
    position
    url
  }`

export default function fetchPost (id, opts = {}) {
  return {
    type: FETCH_POST,
    graphql: {
      query: `query ($id: ID) {
        post(id: $id) {
          ${postFieldsFragment}
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
