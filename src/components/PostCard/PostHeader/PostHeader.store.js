import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'

export const MODULE_NAME = 'PostHeader'

// Constants
export const DELETE_POST = `${MODULE_NAME}/DELETE_POST`
export const DELETE_POST_PENDING = DELETE_POST + '_PENDING'
export const REMOVE_POST = `${MODULE_NAME}/REMOVE_POST`
export const REMOVE_POST_PENDING = REMOVE_POST + '_PENDING'
export const PIN_POST = `${MODULE_NAME}/PIN_POST`
export const PIN_POST_PENDING = `${PIN_POST}_PENDING`
export const FULFILL_POST = `${MODULE_NAME}/FULFILL_POST`
export const FULFILL_POST_PENDING = `${MODULE_NAME}/FULFILL_POST_PENDING`

// Action Creators
export function deletePost (id) {
  return {
    type: DELETE_POST,
    graphql: {
      query: `mutation ($id: ID) {
        deletePost(id: $id) {
          success
        }
      }`,
      variables: {
        id
      }
    },
    meta: {
      optimistic: true,
      id
    }
  }
}

export function removePost (postId, slug) {
  return {
    type: REMOVE_POST,
    graphql: {
      query: `mutation ($postId: ID, $slug: String) {
        removePost(postId: $postId, slug: $slug) {
          success
        }
      }`,
      variables: {
        postId,
        slug
      }
    },
    meta: {
      optimistic: true,
      postId,
      slug
    }
  }
}

export function pinPost (postId, communityId) {
  return {
    type: PIN_POST,
    graphql: {
      query: `mutation ($postId: ID, $communityId: ID) {
        pinPost(postId: $postId, communityId: $communityId) {
          success
        }
      }`,
      variables: {
        postId,
        communityId
      }
    },
    meta: {
      optimistic: true,
      postId,
      communityId
    }
  }
}

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

export const getCommunity = ormCreateSelector(
  orm,
  (_, { routeParams }) => routeParams,
  (session, { slug }) => session.Community.safeGet({ slug })
)

export function ormSessionReducer ({ Post }, { type, meta }) {
  var post
  switch (type) {
    case DELETE_POST_PENDING:
      Post.withId(meta.id).delete()
      break

    case REMOVE_POST_PENDING:
      post = Post.withId(meta.postId)
      const communities = post.communities.filter(c =>
        c.slug !== meta.slug).toModelArray()
      post.update({ communities })
      break

    case PIN_POST_PENDING:
      post = Post.withId(meta.postId)
      // this line is to clear the selector memoization
      post.update({ _invalidate: (post._invalidate || 0) + 1 })
      let postMembership = post.postMemberships.filter(p =>
        Number(p.community) === Number(meta.communityId)).toModelArray()[0]
      postMembership && postMembership.update({ pinned: !postMembership.pinned })
  }
}
