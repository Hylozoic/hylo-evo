import { UPDATE_COMMENT } from 'store/constants'

export default function updateComment (id, text, attachments = []) {
  return {
    type: UPDATE_COMMENT,
    graphql: {
      query: `mutation UpdateComment ($id: ID, $data: CommentInput) {
        updateComment(id: $id, data: $data) {
          id
          text
          attachments {
            type
            url
            position
            id
          }
        }
      }`,
      variables: {
        id,
        data: {
          text,
          attachments
        }
      }
    },
    meta: {
      optimistic: true,
      id,
      data: {
        text,
        attachments
      }
    }
  }
}
