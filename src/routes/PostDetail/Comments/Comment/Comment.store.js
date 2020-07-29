export const MODULE_NAME = 'Comment'
export const DELETE_COMMENT = `${MODULE_NAME}/DELETE_COMMENT`
export const DELETE_COMMENT_PENDING = `${DELETE_COMMENT}_PENDING`
export const UPDATE_COMMENT = `${MODULE_NAME}/UPDATE_COMMENT`
export const UPDATE_COMMENT_PENDING = `${UPDATE_COMMENT}_PENDING`

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

export function updateComment (id, text) {
  return {
    type: UPDATE_COMMENT,
    graphql: {
      query: `mutation ($id: ID, $data: CommentInput) {
        updateComment(id: $id, data: $data) {
          id
          text
        }
      }`,
      variables: {
        id,
        data: {
          text
        }
      }
    },
    meta: {
      optimistic: true,
      id,
      data: {
        text
      }
    }
  }
}
