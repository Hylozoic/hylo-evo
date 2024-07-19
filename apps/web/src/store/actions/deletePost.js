import { DELETE_POST } from 'store/constants'

export default function deletePost (id, groupId) {
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
      id,
      groupId
    }
  }
}
