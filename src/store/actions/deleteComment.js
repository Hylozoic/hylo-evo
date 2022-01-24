import gql from 'graphql-tag'
import { DELETE_COMMENT } from 'store/constants'

export default function deleteComment (id) {
  return {
    type: DELETE_COMMENT,
    graphql: {
      query: gql`
        mutation DeleteCommentMutation ($id: ID) {
          deleteComment(id: $id) {
            success
          }
        }
      `,
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
