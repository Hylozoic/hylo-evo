import { DEACTIVATE_ME } from '../constants'

export default function deactivateMe (userId) {
  return {
    type: DEACTIVATE_ME,
    graphql: {
      query: `mutation ($userId: ID) {
        deactivateMe (id: $userId) {
          success
        }
      }`,
      variables: {
        userId
      }
    }
  }
}
