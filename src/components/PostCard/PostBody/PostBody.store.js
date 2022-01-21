import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import gql from 'graphql-tag'

export const MODULE_NAME = 'PostBody'

// Constants
export const FULFILL_POST = `${MODULE_NAME}/FULFILL_POST`
export const FULFILL_POST_PENDING = `${MODULE_NAME}/FULFILL_POST_PENDING`
export const UNFULFILL_POST = `${MODULE_NAME}/UNFULFILL_POST`
export const UNFULFILL_POST_PENDING = `${MODULE_NAME}/UNFULFILL_POST_PENDING`

// Action Creators
export function fulfillPost (postId) {
  return {
    type: FULFILL_POST,
    graphql: {
      query: gql`
        mutation FulfillPost($postId: ID) {
          fulfillPost (postId: $postId) {
            success
          }
        }
      `,
      variables: {
        postId
      }
    },
    meta: {
      optimistic: true,
      postId
    }
  }
}

export function unfulfillPost (postId) {
  return {
    type: UNFULFILL_POST,
    graphql: {
      query: gql`
        mutation UnfullfillPost($postId: ID) {
          unfulfillPost (postId: $postId) {
            success
          }
        }
      `,
      variables: {
        postId
      }
    },
    meta: {
      optimistic: true,
      postId
    }
  }
}

export const getGroup = ormCreateSelector(
  orm,
  (_, { routeParams }) => routeParams,
  (session, { slug }) => session.Group.safeGet({ slug })
)

export function ormSessionReducer ({ Post }, { type, meta }) {
  var post
  switch (type) {
    case FULFILL_POST_PENDING:
      post = Post.withId(meta.postId)
      post.update({ fulfilledAt: (new Date()).toISOString() })
      break

    case UNFULFILL_POST_PENDING:
      post = Post.withId(meta.postId)
      post.update({ fulfilledAt: null })
      break
  }
}
