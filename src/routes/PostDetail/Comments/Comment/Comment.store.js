export const MODULE_NAME = 'Comment'
export const DELETE_COMMENT = `${MODULE_NAME}/DELETE_COMMENT`
export const DELETE_COMMENT_PENDING = `${DELETE_COMMENT}_PENDING`

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
