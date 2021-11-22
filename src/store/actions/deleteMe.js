import { DELETE_ME } from '../constants'

export default function deleteMe (userId) {
  return {
    type: DELETE_ME,
    graphql: {
      query: `mutation ($userId: ID) {
        deleteMe (id: $userId) {
          success
        }
      }`,
      variables: {
        userId
      }
    }
  }
}
