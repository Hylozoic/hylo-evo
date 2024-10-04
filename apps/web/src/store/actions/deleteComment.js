import { DELETE_COMMENT } from 'store/constants'

export default function deleteComment (id) {
  return {
    type: DELETE_COMMENT,
    graphql: {
      query: `mutation DeleteComment ($id: ID) {
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
