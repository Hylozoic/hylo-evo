import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'

export const MODULE_NAME = 'PostHeader'

// Constants
export const DELETE_POST = `${MODULE_NAME}/DELETE_POST`
export const DELETE_POST_PENDING = DELETE_POST + '_PENDING'
export const REMOVE_POST = `${MODULE_NAME}/REMOVE_POST`
export const REMOVE_POST_PENDING = REMOVE_POST + '_PENDING'

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

export const getCommunity = ormCreateSelector(
  orm,
  state => state.orm,
  (_, { slug }) => slug,
  (session, slug) => session.Community.safeGet({slug})
)

export function ormSessionReducer ({ Post }, { type, meta }) {
  switch (type) {
    case DELETE_POST_PENDING:
      Post.withId(meta.id).delete()
      break

    case REMOVE_POST_PENDING:
      let post = Post.withId(meta.postId)
      const communities = post.communities.filter(c =>
        c.slug !== meta.slug).toModelArray()
      post.update({communities})
      break
  }
}
