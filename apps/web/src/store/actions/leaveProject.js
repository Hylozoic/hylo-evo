import { LEAVE_PROJECT } from 'store/constants'

export default function (id) {
  return {
    type: LEAVE_PROJECT,
    graphql: {
      query: `mutation ($id: ID) {
        leaveProject (id: $id) {
          success
        }
      }`,
      variables: {
        id
      }
    },
    meta: {
      id
    }
  }
}
