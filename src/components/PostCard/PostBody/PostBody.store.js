import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'

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
      query: `mutation ($postId: ID) {
        fulfillPost (postId: $postId) {
          success
        }
      }`,
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
      query: `mutation ($postId: ID) {
        unfulfillPost (postId: $postId) {
          success
        }
      }`,
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

export const getCommunity = ormCreateSelector(
  orm,
  state => state.orm,
  (_, { routeParams }) => routeParams,
  (session, { slug }) => session.Community.safeGet({ slug })
)

export function ormSessionReducer ({ Post }, { type, meta }) {
  var post
  switch (type) {
    // case DELETE_POST_PENDING:
    //   Post.withId(meta.id).delete()
    //   break
    //
    // case REMOVE_POST_PENDING:
    //   post = Post.withId(meta.postId)
    //   const communities = post.communities.filter(c =>
    //     c.slug !== meta.slug).toModelArray()
    //   post.update({ communities })
    //   break
    //
    // case PIN_POST_PENDING:
    //   post = Post.withId(meta.postId)
    //   // this line is to clear the selector memoization
    //   post.update({ _invalidate: (post._invalidate || 0) + 1 })
    //   let postMembership = post.postMemberships.filter(p =>
    //     Number(p.community) === Number(meta.communityId)).toModelArray()[0]
    //   postMembership && postMembership.update({ pinned: !postMembership.pinned })

    case FULFILL_POST_PENDING:
      post = Post.withId(meta.postId)
      post.update({ fulfilledAt: true })
      break

    case UNFULFILL_POST_PENDING:
      post = Post.withId(meta.postId)
      post.update({ fulfilledAt: false })
      break
  }
}
