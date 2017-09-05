export const MODULE_NAME = 'Comment'
export const DELETE_COMMENT = `${MODULE_NAME}/DELETE_COMMENT`
export const DELETE_COMMENT_PENDING = `${DELETE_COMMENT}_PENDING`
import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'

export function deleteComment (id) {
  return {
    type: DELETE_COMMENT,
    graphql: {
      query: `mutation ($id: ID) {
        deleteComment(id: $id) {
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

export const getCommunity = ormCreateSelector(
  orm,
  state => state.orm,
  (_, { slug }) => slug,
  (session, slug) => session.Community.safeGet({slug})
)
